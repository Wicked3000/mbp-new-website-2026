// The admin sidebar and the router are two independent lists of admin pages.
// When they drift, a sidebar link resolves to no route and the admin lands on
// the 404 page instead of the manager - silently, with no build error. That is
// exactly how /admin/home lost its manager during a merge.
//
// This check now reads the filesystem rather than a route table, because with
// the App Router the filesystem *is* the route table: there is no single file
// listing the routes, so there is nothing to parse and nothing to forget to
// update. A sidebar link with no matching page.tsx is a 404 at runtime, and
// `next build` does not catch it.
//
// The reverse direction still needs a rule, and it is the same rule as before:
// several managers (hero, news, notices, events, programs, stats, districts,
// leadership, quick links, partners) have no sidebar entry on purpose, because
// they are tabs inside the Home Page manager. So an unlinked page is only a bug
// when its component is not a *Manager.
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const read = (rel: string) => fs.readFileSync(path.resolve(import.meta.dirname, rel), "utf8");

const layout = read("../AdminLayout.tsx");

// The (dash) route group guards the authenticated admin pages. It contributes
// nothing to the URL, so it is stripped from the path when comparing.
const DASH_DIR = path.resolve(import.meta.dirname, "../../../app/admin/(dash)");

const sidebarLinks = [...layout.matchAll(/to:\s*"(\/admin[^"]*)"/g)].map((m) => m[1]);

/** Every page the router actually serves under /admin, as route segments. */
function routedPages(dir: string, prefix = ""): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (!entry.isDirectory()) return [];
    // Route groups are organisational only; they are not part of the URL.
    if (entry.name.startsWith("(") && entry.name.endsWith(")")) {
      return routedPages(path.join(dir, entry.name), prefix);
    }
    if (!fs.existsSync(path.join(dir, entry.name, "page.tsx"))) return [];
    return [prefix + entry.name];
  });
}

const childPages = routedPages(DASH_DIR);

describe("admin routes", () => {
  it("serves a page for every sidebar link", () => {
    expect(sidebarLinks.length).toBeGreaterThan(0);
    const orphans = sidebarLinks
      .map((to) => to.replace(/^\/admin\/?/, ""))
      .filter((segment) => segment && !childPages.includes(segment));
    expect(orphans, "sidebar links with no page.tsx - these 404 at runtime").toEqual([]);
  });

  it("has no page the sidebar cannot reach unless it is a grouped page manager", () => {
    const segments = new Set(
      sidebarLinks.map((to) => to.replace(/^\/admin\/?/, "")).filter(Boolean),
    );
    const unlinked = childPages.filter((p) => !segments.has(p));
    for (const p of unlinked) {
      const src = fs.readFileSync(path.join(DASH_DIR, p, "page.tsx"), "utf8");
      expect(
        src,
        `${p} is unreachable from the sidebar and is not one of the Home Page tab managers`,
      ).toMatch(/Manager/);
    }
  });

  it("renders each grouped page manager", () => {
    for (const segment of ["home", "basic-education", "post-primary", "vet", "fode"]) {
      const file = path.join(DASH_DIR, segment, "page.tsx");
      expect(fs.existsSync(file), `no page for /admin/${segment}`).toBe(true);
      expect(fs.readFileSync(file, "utf8")).toMatch(/Manager/);
    }
  });

  it("keeps the login page outside the authenticated group", () => {
    // The guard lives in app/admin/(dash)/layout.tsx. If the login page were
    // moved inside that group it would guard itself and nobody could ever sign
    // in - a failure that builds cleanly and is only discoverable by trying.
    const login = path.resolve(import.meta.dirname, "../../../app/admin/login/page.tsx");
    expect(fs.existsSync(login)).toBe(true);
    expect(fs.existsSync(path.join(DASH_DIR, "login"))).toBe(false);
  });
});
