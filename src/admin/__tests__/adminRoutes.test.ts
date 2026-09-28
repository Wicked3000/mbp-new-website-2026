// The admin sidebar and the router are two independent lists of admin pages.
// When they drift, a sidebar link resolves to no route and the admin lands on
// the 404 page instead of the manager - silently, with no build error. That is
// exactly how /admin/home lost its manager during a merge.
//
// This parses both files rather than rendering them: the check needs to hold
// without a DOM, and the route table is plain JSX text.
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const read = (rel: string) => fs.readFileSync(path.resolve(import.meta.dirname, rel), "utf8");

const app = read("../../App.tsx");
const layout = read("../AdminLayout.tsx");

const sidebarLinks = [...layout.matchAll(/to:\s*"(\/admin[^"]*)"/g)].map((m) => m[1]);

// The admin routes are the children of the /admin route element, so read only
// that block: the public routes above it are absolute paths and are not part of
// this comparison.
const adminBlock = app.slice(app.indexOf('path="/admin"'));
const childRoutes = [
  ...adminBlock.matchAll(/<Route\s+(?:index|path="([^"]+)")\s+element=\{<([A-Za-z]+)\s*\/>/g),
].map((m) => ({ path: m[1] ?? "index", component: m[2] }));
const childPaths = new Set(childRoutes.map((r) => r.path));

describe("admin routes", () => {
  it("declares a route for every sidebar link", () => {
    expect(sidebarLinks.length).toBeGreaterThan(0);
    const orphans = sidebarLinks
      .map((to) => to.replace(/^\/admin\/?/, ""))
      .filter((segment) => segment && !childPaths.has(segment));
    expect(orphans).toEqual([]);
  });

  it("has no child route the sidebar cannot reach", () => {
    const segments = new Set(
      sidebarLinks.map((to) => to.replace(/^\/admin\/?/, "")).filter(Boolean),
    );
    // Several managers (hero, news, notices, events, programs, stats, districts,
    // leadership, quick links, partners) have no sidebar entry on purpose: they
    // are now tabs inside the Home Page manager. So a child route with no
    // sidebar link is expected, and only the reverse direction is a bug.
    const unlinked = childRoutes
      .map((r) => r.path)
      .filter((p) => p !== "*" && p !== "index" && !segments.has(p));
    for (const p of unlinked) {
      const route = childRoutes.find((r) => r.path === p)!;
      expect(
        route.component,
        `${p} is unreachable from the sidebar and is not one of the Home Page tab managers`,
      ).toMatch(/Manager$/);
    }
  });

  it("renders each grouped page manager", () => {
    for (const path of ["home", "basic-education", "post-primary", "vet", "fode"]) {
      const route = childRoutes.find((r) => r.path === path);
      expect(route?.component, `no route for /admin/${path}`).toMatch(/Manager$/);
    }
  });
});
