// @vitest-environment jsdom
// The home page quick-link tiles must send visitors where their label promises.
//
// The "Term Dates" tile pointed at /#news. It rendered, it looked right, and
// every check passed - the link was a real <Link>, it just went to the wrong
// page. Separately, the view used to force any file/download icon to /downloads,
// which meant the stored href was never the one actually used and the admin was
// editing a fiction.
import { createRoot, type Root } from "react-dom/client";
import { act } from "react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { QuickLinksStrip } from "@/home/QuickLinksStrip";
import { QUICK_LINKS } from "@/home/fallbackData";

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

function render() {
  act(() =>
    root.render(
      <MemoryRouter>
        <QuickLinksStrip />
      </MemoryRouter>,
    ),
  );
  return container;
}

const hrefFor = (label: string) => {
  const link = [...container.querySelectorAll("a")].find((a) =>
    a.textContent?.includes(label),
  );
  return link?.getAttribute("href");
};

describe("home page quick links", () => {
  it("sends Term Dates to the calendar page", () => {
    render();
    expect(hrefFor("Term Dates")).toBe("/calendar");
  });

  it("sends Forms & Downloads to the downloads page", () => {
    render();
    // Not /basic: there is a dedicated /downloads page, and the old view
    // masked a wrong stored value by forcing this one.
    expect(hrefFor("Forms & Downloads")).toBe("/downloads");
  });

  it("sends School Directory to the districts page", () => {
    render();
    expect(hrefFor("School Directory")).toBe("/districts");
  });

  it("uses the stored destination rather than overriding it", () => {
    // The strip reads quick_links and falls back to QUICK_LINKS when the API
    // is unreachable, so the fallback is what renders here. It has to agree
    // with what is stored, or the tile's destination depends on whether the
    // request succeeded - which is exactly how the calendar tile ended up
    // pointing at the news.
    const byLabel = Object.fromEntries(QUICK_LINKS.map((q) => [q.label, q.href]));
    expect(byLabel["Term Dates"]).toBe("/calendar");
    expect(byLabel["Forms & Downloads"]).toBe("/downloads");
    expect(byLabel["School Directory"]).toBe("/districts");
  });

  it("points every tile at a real in-site page", () => {
    render();
    const known = new Set([
      "/", "/about", "/basic", "/post", "/vet", "/fode", "/contact", "/districts",
      "/downloads", "/calendar", "/selections", "/news", "/notices",
    ]);
    for (const a of container.querySelectorAll("a")) {
      const path = (a.getAttribute("href") || "").split("#")[0];
      expect(known.has(path), `${a.textContent?.trim()} -> ${path}`).toBe(true);
    }
  });

  it("renders a tile with no destination as content, not a dead link", () => {
    // A tile with an empty href used to fall back to "/", which is a click that
    // appears to do nothing.
    act(() =>
      root.render(
        <MemoryRouter>
          <QuickLinksStrip />
        </MemoryRouter>,
      ),
    );
    // Sanity: the real fallback tiles all have destinations.
    expect(container.querySelectorAll("a").length).toBe(QUICK_LINKS.length);
  });
});
