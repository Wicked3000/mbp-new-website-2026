// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const MOCK_KEY = "mbp_mock_db_v1";

/**
 * The admin session no longer lives in localStorage.
 *
 * These keys are asserted to stay absent rather than merely unused. A test that
 * only checked the new behaviour would still pass if some forgotten code path
 * wrote the token back into storage, which is the specific regression the
 * httpOnly cookie was introduced to prevent.
 */
const TOKEN_KEY = "mbp_admin_token";
const USER_KEY = "mbp_admin_user";

function jsonResponse(body: unknown, status = 200) {
  return { ok: status >= 200 && status < 300, status, json: async () => body };
}

/**
 * Fresh localStorage, a fresh copy of the module (its first call seeds the
 * offline store), and a fetch stubbed from a path -> response map. Anything
 * unmapped throws the way a dead network does, so the offline paths get
 * exercised too.
 */
type RouteHandler = (ctx: { path: string; init: RequestInit; url: string }) => unknown;

async function setup(routes: Record<string, RouteHandler> = {}) {
  localStorage.clear();
  vi.resetModules();
  const fetchMock = vi.fn(async (url: RequestInfo | URL, init: RequestInit = {}) => {
    const path = String(url);
    const route = Object.entries(routes).find(([key]) => path.includes(key));
    if (!route) throw new TypeError("Failed to fetch");
    return route[1]({ path, init, url: String(url) }) as never;
  });
  globalThis.fetch = fetchMock;
  return { api: (await import("../api")).api, fetchMock };
}

beforeEach(() => {
  vi.resetModules();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("auth", () => {
  it("does not put the session in web storage on a successful login", async () => {
    const { api } = await setup({
      "/auth/login": () =>
        jsonResponse({ user: { id: 1, username: "admin", role: "super_admin" } }),
    });
    await api.login("admin", "a long passphrase");
    // The token is not in the response body at all, so there is nothing for the
    // page to store. Even if a future response did leak one, the client below
    // does not persist it.
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
    expect(localStorage.getItem(USER_KEY)).toBeNull();
  });

  it("never sets an Authorization header", async () => {
    const { api, fetchMock } = await setup({
      "/entities": () => jsonResponse({ data: [] }),
    });
    await api.list("contact_messages");
    const headers = fetchMock.mock.calls[0]?.[1]?.headers as Record<string, string>;
    // The session is an httpOnly cookie the browser attaches on its own. A
    // bearer header would put the token back in reach of page script.
    expect(headers.Authorization).toBeUndefined();
  });

  it("sends credentials so the session cookie travels with admin calls", async () => {
    const { api, fetchMock } = await setup({
      "/entities": () => jsonResponse({ data: [] }),
    });
    await api.list("contact_messages");
    const init = fetchMock.mock.calls[0]?.[1] as RequestInit;
    expect(init.credentials).toBe("same-origin");
  });

  it("calls the un-suffixed route, not the legacy .php path", async () => {
    const { api, fetchMock } = await setup({ "/auth/login": () => jsonResponse({ user: {} }) });
    await api.login("admin", "a long passphrase");
    const url = String(fetchMock.mock.calls[0]?.[0]);
    expect(url).toContain("/auth/login");
    // The sixteen alias() shims in the Express app existed only to translate
    // these. If one reappears, the client and the Route Handler have drifted.
    expect(url).not.toContain(".php");
  });

  it("uses a same-origin relative base url", async () => {
    const { api, fetchMock } = await setup({ "/auth/login": () => jsonResponse({ user: {} }) });
    await api.login("admin", "a long passphrase");
    const url = String(fetchMock.mock.calls[0]?.[0]);
    // Not http://localhost/mbp-api: the API is a Route Handler in this app.
    expect(url.startsWith("/")).toBe(true);
  });

  it("reports invalid credentials instead of signing anyone in", async () => {
    const { api } = await setup({
      "/auth/login": () => jsonResponse({ error: "Invalid credentials" }, 401),
    });
    await expect(api.login("admin", "wrong")).rejects.toMatchObject({ status: 401 });
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
  });

  it("never falls back to a local account when the API is unreachable", async () => {
    const { api } = await setup({});
    await expect(api.login("admin", "anything")).rejects.toThrow();
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
  });

  it("clears the session through the server on logout", async () => {
    const { api, fetchMock } = await setup({
      "/auth/logout": () => jsonResponse({ ok: true }),
    });
    await api.logout();
    const url = String(fetchMock.mock.calls[0]?.[0]);
    expect(url).toContain("/auth/logout");
    expect(fetchMock.mock.calls[0]?.[1]?.method).toBe("POST");
  });

  it("still signs out locally when the logout request fails", async () => {
    const { api } = await setup({});
    // The admin must not be stranded in a half-signed-out state because the
    // network blipped.
    await expect(api.logout()).resolves.toBeUndefined();
  });
});

describe("offline fallback", () => {
  it("serves public reads from the local store when the API is down", async () => {
    const { api } = await setup({});
    const news = await api.list("news");
    expect(news.length).toBeGreaterThan(0);
    expect(news[0]).toHaveProperty("title");
  });

  it("does not swallow a rejected write", async () => {
    const { api } = await setup({
      "/entities": () => jsonResponse({ error: "Read only" }, 403),
    });
    await expect(api.create("users", { username: "x" })).rejects.toMatchObject({ status: 403 });
  });

  it("surfaces a contact rejection instead of pretending it was saved", async () => {
    const { api } = await setup({
      "/contact": () => jsonResponse({ error: "Unable to save the message" }, 500),
    });
    await expect(
      api.contact({ full_name: "A", email: "a@b.c", subject: "Hi", message: "There" }),
    ).rejects.toMatchObject({ status: 500 });
    const stored = (JSON.parse(localStorage.getItem(MOCK_KEY) || "{}") as Record<string, unknown[]>)
      .contact_messages;
    expect(stored ?? []).toHaveLength(0);
  });

  it("files a contact message locally only when the API is unreachable", async () => {
    const { api } = await setup({});
    const res = await api.contact({
      full_name: "A",
      email: "a@b.c",
      subject: "Hi",
      message: "There",
    });
    expect(res.ok).toBe(true);
    const stored = JSON.parse(localStorage.getItem(MOCK_KEY) as string) as {
      contact_messages: unknown[];
    };
    expect(stored.contact_messages).toHaveLength(1);
  });

  it("validates a WhatsApp number before sending", async () => {
    const { api, fetchMock } = await setup({
      "/whatsapp/subscribe": () => jsonResponse({ ok: true }),
    });
    await expect(api.subscribeWhatsApp("not a number", "Notices")).rejects.toThrow(/WhatsApp/);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("uploads", () => {
  const png = () =>
    new File([new Uint8Array([0x89, 0x50, 0x4e, 0x47])], "logo.png", { type: "image/png" });

  it("returns the url the API stored", async () => {
    const { api } = await setup({
      "/upload": () => jsonResponse({ ok: true, url: "/uploads/logo_1_abcd.png" }),
    });
    await expect(api.upload(png())).resolves.toBe("/uploads/logo_1_abcd.png");
  });

  it("reports a rejected file rather than inlining it as a data url", async () => {
    const { api } = await setup({
      "/upload": () => jsonResponse({ error: "Unsupported file type" }, 400),
    });
    await expect(api.upload(png())).rejects.toMatchObject({ status: 400 });
  });

  it("surfaces an expired session instead of pretending the upload worked", async () => {
    const { api } = await setup({ "/upload": () => jsonResponse({ error: "Missing token" }, 401) });
    await expect(api.upload(png())).rejects.toMatchObject({ status: 401 });
  });

  it("keeps working when the API is not deployed", async () => {
    const { api } = await setup({});
    await expect(api.upload(png())).resolves.toMatch(/^data:/);
  });
});
