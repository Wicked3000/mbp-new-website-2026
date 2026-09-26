// Unified API client: tries PHP backend first, falls back to localStorage mock
const BASE = (import.meta as any).env?.VITE_API_BASE || "http://localhost/mbp-api";
import { SEEDS } from "./seedData";

function token() {
  return localStorage.getItem("mbp_admin_token") || "";
}

async function request(path: string, opts: RequestInit = {}) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((opts.headers as any) || {}),
  };
  const t = token();
  if (t) headers["Authorization"] = `Bearer ${t}`;
  try {
    const res = await fetch(`${BASE}${path}`, { ...opts, headers });
    if (res.status === 204) return null;
    const j = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg = j.details ? `${j.error}: ${j.details}` : j.error || `HTTP ${res.status}`;
      const err: any = new Error(msg);
      err.status = res.status;
      err.details = j.details;
      if (res.status === 401) err.__auth = true;
      // Reads may fall back to the offline store. Writes must not: silently
      // "saving" into localStorage after a 401 loses the edit and hides the fact
      // that the session is no longer valid.
      if (opts.method === undefined || opts.method === "GET") err.__fallback = true;
      throw err;
    }
    return j;
  } catch (e: any) {
    if (e?.status === 401) e.__auth = true;
    if (opts.method === undefined || opts.method === "GET") {
      (e as any).__fallback = true;
    }
    // network errors
    if (e?.message?.includes("Failed to fetch") || e?.message?.includes("NetworkError"))
      e.__fallback = true;
    throw e;
  }
}

// localStorage fallback store
const LS_KEY = "mbp_mock_db_v1";
type MockDB = Record<string, any[]>;
function loadMock(): MockDB {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || "{}");
  } catch {
    return {};
  }
}
function saveMock(db: MockDB) {
  localStorage.setItem(LS_KEY, JSON.stringify(db));
}
function ensureMock(entity: string, seed: any[]) {
  const db = loadMock();
  if (!db[entity]) {
    db[entity] = seed;
    saveMock(db);
  }
}

// Ensure seeds exist in LS
Object.keys(SEEDS).forEach((k) => ensureMock(k, SEEDS[k as keyof typeof SEEDS]));

export const api = {
  // Auth
  async login(username: string, password: string) {
    // Credentials are only ever checked by the server. There is deliberately
    // no local fallback account: a hardcoded one would be a public admin
    // backdoor for anyone who can reach the admin UI.
    const r = await request("/auth/login.php", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    if (r?.token) {
      localStorage.setItem("mbp_admin_token", r.token);
      localStorage.setItem("mbp_admin_user", JSON.stringify(r.user));
      return r;
    }
    throw new Error("Login failed");
  },
  async changePassword(currentPassword: string, newPassword: string) {
    const r = await request("/auth/change-password.php", {
      method: "POST",
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
      }),
    });
    if (r?.token) {
      // The server retires every earlier token, so store the replacement or the
      // admin is signed out on the next request.
      localStorage.setItem("mbp_admin_token", r.token);
      if (r.user) localStorage.setItem("mbp_admin_user", JSON.stringify(r.user));
    }
    return r;
  },
  logout() {
    localStorage.removeItem("mbp_admin_token");
    localStorage.removeItem("mbp_admin_user");
  },
  user() {
    try {
      return JSON.parse(localStorage.getItem("mbp_admin_user") || "null");
    } catch {
      return null;
    }
  },
  isAuthed() {
    return !!token();
  },

  // generic
  async list(entity: string) {
    try {
      const r = await request(`/entities.php?entity=${entity}`);
      return r.data as any[];
    } catch (e: any) {
      if (e.__fallback) {
        if (entity === "whatsapp_subscribers") {
          return JSON.parse(localStorage.getItem("mbp_whatsapp_subscribers") || "[]");
        }
        const db = loadMock();
        return db[entity] || [];
      }
      throw e;
    }
  },
  async get(entity: string, id: any) {
    try {
      const r = await request(`/entities.php?entity=${entity}&id=${id}`);
      return r.data;
    } catch (e: any) {
      if (e.__fallback) {
        const db = loadMock();
        return (db[entity] || []).find((x: any) => String(x.id) === String(id));
      }
      throw e;
    }
  },
  async create(entity: string, payload: any) {
    try {
      const r = await request(`/entities.php?entity=${entity}`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      return r;
    } catch (e: any) {
      if (e.__fallback) {
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
        const row = { id, ...payload };
        arr.push(row);
        db[entity] = arr;
        saveMock(db);
        return { id };
      }
      throw e;
    }
  },
  async update(entity: string, id: any, payload: any) {
    try {
      const r = await request(`/entities.php?entity=${entity}&id=${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      return r;
    } catch (e: any) {
      if (e.__fallback) {
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
      throw e;
    }
  },
  async remove(entity: string, id: any) {
    try {
      const r = await request(`/entities.php?entity=${entity}&id=${id}`, {
        method: "DELETE",
      });
      return r;
    } catch (e: any) {
      if (e.__fallback) {
        if (entity === "whatsapp_subscribers") {
          const subscribers = JSON.parse(localStorage.getItem("mbp_whatsapp_subscribers") || "[]");
          const filtered = subscribers.filter((item: any) => String(item.id) !== String(id));
          localStorage.setItem("mbp_whatsapp_subscribers", JSON.stringify(filtered));
          return { ok: true };
        }
        const db = loadMock();
        db[entity] = (db[entity] || []).filter((x: any) => String(x.id) !== String(id));
        saveMock(db);
        return { ok: true };
      }
      throw e;
    }
  },
  async settings() {
    try {
      const r = await request(`/entities.php?entity=site_settings`);
      return r.data as Record<string, string>;
    } catch (e: any) {
      if (e.__fallback) {
        const db = loadMock();
        // site_settings stored differently; return map
        const rows = (db["site_settings"] || []) as any[];
        const m: Record<string, string> = {};
        // if empty, seed defaults
        if (!rows.length) {
          const defaults: Record<string, string> = {
            site_phone: "+675 641 1234",
            site_email: "info@mbpeducation.gov.pg",
            site_hours: "Mon – Fri: 8:00am – 4:30pm",
            site_address: "Division of Education, Alotau, Milne Bay Province, PNG",
          };
          return defaults;
        }
        rows.forEach((r) => (m[r.skey] = r.svalue));
        return m;
      }
      throw e;
    }
  },
  async updateSetting(key: string, value: string) {
    try {
      const r = await request(`/entities.php?entity=site_settings`, {
        method: "POST",
        body: JSON.stringify({ skey: key, svalue: value }),
      });
      return r;
    } catch (e: any) {
      if (e.__fallback) {
        const db = loadMock();
        let arr = db["site_settings"] || [];
        const idx = arr.findIndex((x: any) => x.skey === key);
        if (idx >= 0) arr[idx].svalue = value;
        else arr.push({ skey: key, svalue: value });
        db["site_settings"] = arr;
        saveMock(db);
        return { ok: true };
      }
      throw e;
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
      if (!subscribers.some((item: any) => item.phone === normalizedPhone))
        subscribers.push({
          phone: normalizedPhone,
          source,
          created_at: new Date().toISOString(),
        });
      localStorage.setItem(key, JSON.stringify(subscribers));
      return { ok: true, local: true };
    }
  },
  async contact(payload: any) {
    // Only a missing/unreachable backend falls back to the local store. A real
    // rejection (validation, 500) must reach the visitor: silently filing their
    // message in their own browser and reporting success loses enquiries.
    try {
      return await request(`/contact.php`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
    } catch (e: any) {
      if (!e.__fallback) throw e;
      const db = loadMock();
      const arr = db["contact_messages"] || [];
      const id = Math.max(0, ...arr.map((x: any) => x.id || 0)) + 1;
      arr.push({
        id,
        ...payload,
        status: "new",
        created_at: new Date().toISOString(),
      });
      db["contact_messages"] = arr;
      saveMock(db);
      return { ok: true };
    }
  },
  async upload(file: File): Promise<string> {
    const toDataUrl = () =>
      new Promise<string>((res, rej) => {
        const reader = new FileReader();
        reader.onload = () => res(reader.result as string);
        reader.onerror = () => rej(new Error("Failed to read file"));
        reader.readAsDataURL(file);
      });
    const fd = new FormData();
    fd.append("file", file);
    const t = token();
    const headers: Record<string, string> = {};
    if (t) headers["Authorization"] = `Bearer ${t}`;
    const uploadUrl = BASE.endsWith("/api") ? `${BASE}/upload` : `${BASE}/upload.php`;
    try {
      const r = await fetch(uploadUrl, {
        method: "POST",
        headers,
        body: fd,
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) {
        const err: any = new Error(j.error || `Upload failed ${r.status}`);
        err.status = r.status;
        if (r.status === 401) err.__auth = true;
        // A gateway error means the API is not deployed behind this origin; a
        // 400 means the server rejected the file and the admin needs to know.
        if (r.status === 404 || r.status === 502 || r.status === 503 || r.status === 504)
          err.__fallback = true;
        throw err;
      }
      if (j.url) return j.url as string;
      throw new Error("No url in response");
    } catch (e: any) {
      // A rejected session is not an offline condition - surface it instead of
      // quietly storing the file as a data URL in the record.
      if (e?.status === 401 || e?.__auth) throw e;
      // offline or backend not deployed - fallback to data URL so device upload always works
      if (!e?.__fallback && e?.name !== "TypeError") throw e;
      return await toDataUrl();
    }
  },

  async dashboard() {
    try {
      const r = await request(`/stats/dashboard.php`);
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
