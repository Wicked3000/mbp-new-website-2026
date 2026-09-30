"use client";

/**
 * Browser API client.
 *
 * ## What changed in the Vite -> Next.js migration
 *
 * 1. **Base URL is now relative.** It was `import.meta.env.VITE_API_BASE`,
 *    defaulting to `http://localhost/mbp-api` - a *different origin* from the
 *    page, which is why the Express app needed CORS, why credentials had to be
 *    negotiated, and why the admin worked only when XAMPP was up. The API is now
 *    a Route Handler in the same Next app, so every call is same-origin and
 *    CORS is gone entirely.
 *
 * 2. **The token is an httpOnly cookie, not localStorage.** Login no longer
 *    returns a token to store, and no request sets an Authorization header. The
 *    browser attaches the cookie itself. This is the security improvement the
 *    migration was for: script in the page can no longer read the admin
 *    credential out of storage.
 *
 *    The cost is that `isAuthed()` and `user()` no longer work - an httpOnly
 *    cookie is deliberately invisible to JavaScript. Admin gating moved
 *    server-side to app/admin/(dash)/layout.tsx, and the signed-in username is
 *    passed into the admin shell as a prop rather than read from storage.
 *
 * 3. **URLs lost their .php suffixes.** The Express app carried sixteen
 *    `alias()` shims that re-pointed `/entities.php` at `/api/entities` and so
 *    on, purely because this file spoke PHP. Those shims are gone and the paths
 *    below are the real ones.
 *
 * 4. **Seed initialisation is lazy.** It used to run at module scope, which is
 *    fine when the only consumer is a browser bundle but throws during the
 *    server render that Next performs for every client component. `seeded()`
 *    below guards on `typeof window` and runs once per page load instead.
 */
import { SEEDS } from "./seedData";

const BASE = process.env.NEXT_PUBLIC_API_BASE || "/api";

/**
 * The localStorage fallback store.
 *
 * This exists so the public site still renders with content when the API is
 * unreachable, and so the admin remains usable offline. Reads may fall back;
 * writes must not (see `request`), because silently "saving" an edit into the
 * admin's own browser after a 401 loses the edit and hides the fact that the
 * session is no longer valid.
 */
const LS_KEY = "mbp_mock_db_v1";
type MockDB = Record<string, any[]>;

function loadMock(): MockDB {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || "{}");
  } catch {
    return {};
  }
}

// localStorage is capped at roughly 5 MB. If the seed set ever outgrows it,
// setItem throws QuotaExceededError. Once a write has failed the store drops to
// memory-only for the rest of the session: the fallback still serves the bundled
// seeds, it just stops persisting edits.
let mockWritable = true;

function saveMock(db: MockDB) {
  if (!mockWritable) return;
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(db));
  } catch {
    mockWritable = false;
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[api] localStorage is full, so offline edits will not persist. ` +
          `Seeds still load from seedData. Clear "${LS_KEY}" or use a private window.`,
      );
    }
  }
}

function ensureMock(entity: string, seed: any[]) {
  const db = loadMock();
  if (!db[entity]) {
    db[entity] = seed;
    saveMock(db);
  }
}

let didSeed = false;

/**
 * Seeds the offline store on first use, in the browser only.
 *
 * Guarded per entity: a single throw here would take down every page that
 * imports this module. The `typeof window` check is the part that matters for
 * the migration - at module scope this ran during the server render, where
 * `localStorage` does not exist.
 */
function seedOnce() {
  if (didSeed || typeof window === "undefined") return;
  didSeed = true;
  for (const entity of Object.keys(SEEDS) as (keyof typeof SEEDS)[]) {
    try {
      ensureMock(entity, SEEDS[entity]);
    } catch (error) {
      if (process.env.NODE_ENV !== "production") console.warn(`[api] could not seed ${entity}`, error);
    }
  }
}

const isDev = () => process.env.NODE_ENV !== "production";

async function request(path: string, opts: RequestInit = {}) {
  seedOnce();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((opts.headers as Record<string, string>) || {}),
  };

  try {
    const res = await fetch(`${BASE}${path}`, {
      ...opts,
      headers,
      // Same-origin by default; stated explicitly because the session cookie is
      // what authorises every admin call and losing it would look like a random
      // 401 rather than a config error.
      credentials: "same-origin",
    });
    if (res.status === 204) return null;
    const j = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg = j.details ? `${j.error}: ${j.details}` : j.error || `HTTP ${res.status}`;
      const err: any = new Error(msg);
      err.status = res.status;
      err.details = j.details;
      if (res.status === 401) err.__auth = true;
      if (opts.method === undefined || opts.method === "GET") err.__fallback = true;
      throw err;
    }
    return j;
  } catch (e: any) {
    if (e?.status === 401) e.__auth = true;
    if (opts.method === undefined || opts.method === "GET") {
      (e as any).__fallback = true;
    }
    if (e?.message?.includes("Failed to fetch") || e?.message?.includes("NetworkError")) {
      (e as any).__fallback = true;
    }
    throw e;
  }
}

export const api = {
  // --- Auth -------------------------------------------------------------
  // The response carries the user but no token: the session lives in an
  // httpOnly cookie the browser manages.

  async login(username: string, password: string) {
    // Credentials are only ever checked by the server. There is deliberately no
    // local fallback account: a hardcoded one would be a public admin backdoor
    // for anyone who can reach the admin UI.
    const r = await request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    if (!r?.user) throw new Error("Login failed");
    return r;
  },

  async changePassword(currentPassword: string, newPassword: string) {
    return await request("/auth/change-password", {
      method: "POST",
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
      }),
    });
  },

  /**
   * Clears the session cookie server-side.
   *
   * The Express version had no such endpoint - the button deleted two
   * localStorage keys and left the JWT valid until it expired.
   */
  async logout() {
    await request("/auth/logout", { method: "POST" }).catch(() => {
      // Signing out locally must succeed even if the request does not; the
      // cookie is cleared by the response when it arrives either way.
    });
  },

  // --- generic CRUD -----------------------------------------------------

  async list(entity: string) {
    try {
      const r = await request(`/entities?entity=${entity}`);
      return r.data as any[];
    } catch (e: any) {
      if (e.__fallback) {
        if (entity === "whatsapp_subscribers") {
          return JSON.parse(localStorage.getItem("mbp_whatsapp_subscribers") || "[]");
        }
        return loadMock()[entity] || [];
      }
      throw e;
    }
  },

  async get(entity: string, id: any) {
    try {
      const r = await request(`/entities?entity=${entity}&id=${id}`);
      return r.data;
    } catch (e: any) {
      if (e.__fallback) {
        return (loadMock()[entity] || []).find((x: any) => String(x.id) === String(id));
      }
      throw e;
    }
  },

  async create(entity: string, payload: any) {
    try {
      return await request(`/entities?entity=${entity}`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
    } catch (e: any) {
      if (!e.__fallback) throw e;
      if (entity === "whatsapp_subscribers") {
        const subscribers = JSON.parse(localStorage.getItem("mbp_whatsapp_subscribers") || "[]");
        const id = Math.max(0, ...subscribers.map((item: any) => item.id || 0)) + 1;
        subscribers.push({ id, ...payload, created_at: new Date().toISOString() });
        localStorage.setItem("mbp_whatsapp_subscribers", JSON.stringify(subscribers));
        return { id };
      }
      const db = loadMock();
      const arr = db[entity] || [];
      const id = Math.max(0, ...arr.map((x: any) => x.id || 0)) + 1;
      arr.push({ id, ...payload });
      db[entity] = arr;
      saveMock(db);
      return { id };
    }
  },

  async update(entity: string, id: any, payload: any) {
    try {
      return await request(`/entities?entity=${entity}&id=${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
    } catch (e: any) {
      if (!e.__fallback) throw e;
      if (entity === "whatsapp_subscribers") {
        const subscribers = JSON.parse(localStorage.getItem("mbp_whatsapp_subscribers") || "[]");
        const idx = subscribers.findIndex((item: any) => String(item.id) === String(id));
        if (idx >= 0) subscribers[idx] = { ...subscribers[idx], ...payload };
        localStorage.setItem("mbp_whatsapp_subscribers", JSON.stringify(subscribers));
        return { ok: true };
      }
      const db = loadMock();
      const arr = db[entity] || [];
      const idx = arr.findIndex((x: any) => String(x.id) === String(id));
      if (idx >= 0) arr[idx] = { ...arr[idx], ...payload };
      saveMock(db);
      return { ok: true };
    }
  },

  async remove(entity: string, id: any) {
    try {
      return await request(`/entities?entity=${entity}&id=${id}`, { method: "DELETE" });
    } catch (e: any) {
      if (!e.__fallback) throw e;
      if (entity === "whatsapp_subscribers") {
        const subscribers = JSON.parse(localStorage.getItem("mbp_whatsapp_subscribers") || "[]");
        localStorage.setItem(
          "mbp_whatsapp_subscribers",
          JSON.stringify(subscribers.filter((item: any) => String(item.id) !== String(id))),
        );
        return { ok: true };
      }
      const db = loadMock();
      db[entity] = (db[entity] || []).filter((x: any) => String(x.id) !== String(id));
      saveMock(db);
      return { ok: true };
    }
  },

  async settings() {
    try {
      const r = await request(`/entities?entity=site_settings`);
      return r.data as Record<string, string>;
    } catch (e: any) {
      if (!e.__fallback) throw e;
      const rows = loadMock()["site_settings"] || [];
      if (!rows.length) {
        // No stored settings and no API: hand back the documented defaults
        // rather than an empty object, which every caller would render blank.
        return {
          site_phone: "+675 641 1234",
          site_email: "info@mbpeducation.gov.pg",
          site_hours: "Mon – Fri: 8:00am – 4:30pm",
          site_address: "Division of Education, Alotau, Milne Bay Province, PNG",
        };
      }
      const m: Record<string, string> = {};
      rows.forEach((r) => (m[r.skey] = r.svalue));
      return m;
    }
  },

  async updateSetting(key: string, value: string) {
    try {
      return await request(`/entities?entity=site_settings`, {
        method: "POST",
        body: JSON.stringify({ skey: key, svalue: value }),
      });
    } catch (e: any) {
      if (!e.__fallback) throw e;
      const db = loadMock();
      const arr = db["site_settings"] || [];
      const idx = arr.findIndex((x) => x.skey === key);
      if (idx >= 0) arr[idx].svalue = value;
      else arr.push({ skey: key, svalue: value });
      db["site_settings"] = arr;
      saveMock(db);
      return { ok: true };
    }
  },

  async bulkCreateSelectionStudents(rows: any[]) {
    try {
      return await request("/selections/students/bulk", {
        method: "POST",
        body: JSON.stringify({ rows }),
      });
    } catch (e: any) {
      if (!e.__fallback) throw e;
      const db = loadMock();
      const arr = db["selection_students"] || [];
      const firstId = Math.max(0, ...arr.map((item: any) => item.id || 0));
      rows.forEach((row, index) => arr.push({ id: firstId + index + 1, ...row }));
      db["selection_students"] = arr;
      saveMock(db);
      return { ok: true, count: rows.length, local: true };
    }
  },

  async subscribeWhatsApp(phone: string, source: string) {
    const normalizedPhone = phone.replace(/[^\d+]/g, "");
    if (!/^\+?\d{7,15}$/.test(normalizedPhone)) throw new Error("Enter a valid WhatsApp number");
    try {
      return await request("/whatsapp/subscribe", {
        method: "POST",
        body: JSON.stringify({ phone: normalizedPhone, source }),
      });
    } catch (e: any) {
      if (!e.__fallback) throw e;
      const key = "mbp_whatsapp_subscribers";
      const subscribers = JSON.parse(localStorage.getItem(key) || "[]");
      if (!subscribers.some((item: any) => item.phone === normalizedPhone)) {
        subscribers.push({ phone: normalizedPhone, source, created_at: new Date().toISOString() });
      }
      localStorage.setItem(key, JSON.stringify(subscribers));
      return { ok: true, local: true };
    }
  },

  async contact(payload: any) {
    // Only a missing/unreachable backend falls back to the local store. A real
    // rejection (validation, 500) must reach the visitor: silently filing their
    // message in their own browser and reporting success loses enquiries.
    try {
      return await request(`/contact`, { method: "POST", body: JSON.stringify(payload) });
    } catch (e: any) {
      if (!e.__fallback) throw e;
      const db = loadMock();
      const arr = db["contact_messages"] || [];
      const id = Math.max(0, ...arr.map((x: any) => x.id || 0)) + 1;
      arr.push({ id, ...payload, status: "new", created_at: new Date().toISOString() });
      db["contact_messages"] = arr;
      saveMock(db);
      return { ok: true };
    }
  },

  /**
   * Uploads a file and returns its public URL.
   *
   * The FormData body carries the session cookie, so the Authorization header
   * the old version assembled by hand is gone - the browser sets it.
   */
  async upload(file: File): Promise<string> {
    const toDataUrl = () =>
      new Promise<string>((res, rej) => {
        const reader = new FileReader();
        reader.onload = () => res(reader.result as string);
        reader.onerror = () => rej(new Error("Failed to read file"));
        reader.readAsDataURL(file);
      });

    seedOnce();

    const fd = new FormData();
    fd.append("file", file);

    try {
      const r = await fetch(`${BASE}/upload`, {
        method: "POST",
        credentials: "same-origin",
        body: fd,
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) {
        const err: any = new Error(j.error || `Upload failed ${r.status}`);
        err.status = r.status;
        if (r.status === 401) err.__auth = true;
        if (r.status === 404 || r.status === 502 || r.status === 503 || r.status === 504) {
          err.__fallback = true;
        }
        throw err;
      }
      if (j.url) return j.url as string;
      throw new Error("No url in response");
    } catch (e: any) {
      // A rejected session is not an offline condition - surface it instead of
      // quietly storing the file as a data URL in the record.
      if (e?.status === 401 || e?.__auth) throw e;
      if (!e?.__fallback && e?.name !== "TypeError") throw e;
      return await toDataUrl();
    }
  },

  async dashboard() {
    try {
      const r = await request(`/stats/dashboard`);
      return r.data;
    } catch (e: any) {
      if (e.__fallback) {
        const db = loadMock();
        return {
          news: (db.news || []).length,
          notices: (db.notices || []).length,
          events: (db.events || []).length,
          messages_new: (db.contact_messages || []).filter((x: any) => x.status === "new").length,
          messages_total: (db.contact_messages || []).length,
          schools: 312,
          districts: (db.districts || []).length,
          recent_messages: (db.contact_messages || []).slice(-5).reverse(),
        };
      }
      throw e;
    }
  },
};
