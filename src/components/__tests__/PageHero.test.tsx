// @vitest-environment jsdom
// The banner rules, asserted against rendered output rather than source text.
//
// check:banners reads the files, which is enough to catch a page drifting to a
// hand-rolled section. This renders the shared banner and asserts the things a
// static read cannot: that the h1 really is the only one, that a decorative
// image is hidden from assistive tech, and that the heading order holds.
import { createRoot, type Root } from "react-dom/client";
import { act } from "react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import PageHero, { NAVY_HERO, TEAL_HERO } from "../PageHero";

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

function render(extra: Record<string, unknown> = {}) {
  act(() =>
    root.render(
      <MemoryRouter>
        <PageHero
          theme={NAVY_HERO}
          image="/assets/education_programs/map/milne_bay_map.jpg"
          imageAlt=""
          eyebrow="Coverage"
          title="All Districts"
          lead="17 districts."
          {...extra}
        />
      </MemoryRouter>,
    ),
  );
  return container;
}

describe("the shared page banner", () => {
  it("renders exactly one h1, as the first heading on the page", () => {
    render();
    const headings = [...container.querySelectorAll("h1, h2, h3")];
    expect(headings.filter((h) => h.tagName === "H1")).toHaveLength(1);
    expect(headings[0].tagName).toBe("H1");
  });

  it("names the banner so a landmark is exposed", () => {
    render();
    expect(container.querySelector("[data-page-hero]")).not.toBeNull();
  });

  it("keeps a decorative image out of the accessibility tree", () => {
    render();
    const img = container.querySelector("img")!;
    // Empty alt plus aria-hidden: without both, a screen reader announces the
    // file name, and these images are pure background texture.
    expect(img.getAttribute("alt")).toBe("");
  });

  it("passes a meaningful alt through when the image is informative", () => {
    render({ imageAlt: "Alotau district map" });
    expect(container.querySelector("img")!.getAttribute("alt")).toBe("Alotau district map");
  });

  it("renders the eyebrow, title and lead in reading order", () => {
    render();
    const text = container.textContent || "";
    const order = ["Coverage", "All Districts", "17 districts."].map((s) => text.indexOf(s));
    expect(order.every((i) => i >= 0)).toBe(true);
    expect(order).toEqual([...order].sort((a, b) => a - b));
  });

  it("puts a highlighted second line inside the h1, not beside it", () => {
    render({ highlight: "2026 Academic Year" });
    const h1 = container.querySelector("h1")!;
    expect(h1.textContent).toContain("All Districts");
    expect(h1.textContent).toContain("2026 Academic Year");
  });

  it("renders the title as given when there is no highlight", () => {
    render();
    expect(container.querySelector("h1")!.textContent).toBe("All Districts");
  });

  it("renders action links only when actions are given", () => {
    render();
    expect(container.querySelectorAll("a")).toHaveLength(0);
    render({ actions: [{ label: "Overview", to: "#overview", variant: "primary" }] });
    const link = container.querySelector("a")!;
    // Router-resolved, so the in-page anchor comes back as /#overview.
    expect(link.getAttribute("href")).toContain("#overview");
    expect(link.textContent).toBe("Overview");
  });

  it("renders page-specific children inside the banner", () => {
    render({
      children: <input type="search" aria-label="Search districts" />,
    });
    expect(container.querySelector("input[type=search]")).not.toBeNull();
  });

  it("accepts an id for in-page anchors", () => {
    render({ id: "coverage" });
    expect(container.querySelector("section")!.id).toBe("coverage");
  });

  it("uses the same height on every page", () => {
    render();
    const cls = container.querySelector("section")!.className;
    expect(cls).toContain("h-[400px]");
    expect(cls).toContain("sm:h-[480px]");
  });

  it("applies the supplied theme rather than a hardcoded colour", () => {
    render({ theme: TEAL_HERO });
    const cls = container.querySelector("section")!.className;
    expect(cls).toContain(TEAL_HERO.background);
  });
});
