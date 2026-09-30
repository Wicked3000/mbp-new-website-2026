// @vitest-environment jsdom
// The strongest check available without a browser: render the sections that hold
// admin-stored icon values and assert that no emoji reaches the DOM.
//
// The emoji are still in the bundle - they have to be, as the lookup keys in
// emojiMap and as the stored content itself. What matters is that nothing is
// rendered as one, so this renders real sections and reads the DOM.
import { createRoot, type Root } from "react-dom/client";
import { act } from "react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { SupportSection } from "@/views/FODE/SupportSection";
import { SupportSection as VETSupport } from "@/views/VET/SupportSection";
import { ProgramsSection } from "@/views/VET/ProgramsSection";
import { OverviewSection } from "@/views/PostPrimary/OverviewSection";
import { KeyInfoSection } from "@/views/Selections/KeyInfoSection";
import { DistrictsSection } from "@/home/DistrictsSection";

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

const PICTO = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{26FF}\u{2B00}-\u{2BFF}]/u;

function renderSection(node: React.ReactNode) {
  // No router wrapper. React Router's <Link> refused to render without a
  // MemoryRouter above it; next/link emits a plain <a> and needs no context.
  act(() => root.render(node));
  return container;
}

describe("sections that hold stored icon values", () => {
  const SECTIONS: [string, () => React.ReactNode][] = [
    ["FODE support", () => <SupportSection />],
    ["VET programmes", () => <ProgramsSection />],
    ["Post Primary overview", () => <OverviewSection />],
    ["Selections key info", () => <KeyInfoSection />],
    ["home districts", () => <DistrictsSection />],
  ];

  for (const [name, node] of SECTIONS) {
    it(`${name} renders no emoji into the document`, () => {
      const c = renderSection(node());
      const found = (c.textContent || "").match(new RegExp(PICTO.source, "gu")) || [];
      expect(found, `${name} rendered: ${found.join(" ")}`).toEqual([]);
    });
  }

  it("draws the stored icons as svgs", () => {
    const c = renderSection(<SupportSection />);
    // The fallback data gives this section five icon values; if they were
    // rendered as text the section would show emoji instead of glyphs.
    expect(c.querySelectorAll("svg").length).toBeGreaterThanOrEqual(5);
  });
});

describe("icon legibility on dark surfaces", () => {
  // An SVG takes its colour from currentColor. On a dark panel with no colour
  // of its own, that is the dark body text, so the glyph renders effectively
  // black on near-black and simply vanishes. This is the failure the support
  // sections had.
  const SECTIONS: [string, () => React.ReactNode][] = [
    ["FODE support", () => <SupportSection />],
    ["VET support", () => <VETSupport />],
  ];

  for (const [name, node] of SECTIONS) {
    it(`${name} gives every icon a colour`, () => {
      const c = renderSection(node());
      const svgs = [...c.querySelectorAll("svg")];
      expect(svgs.length).toBeGreaterThan(0);
      for (const svg of svgs) {
        // Either the icon sets a colour, or the element it sits in does.
        // Font-size classes also begin "text-", so they have to be excluded or
        // they pass this check on their own - which is how the bug it is
        // meant to catch slipped through the first time.
        const own = svg.getAttribute("class") || "";
        const inherited = svg.parentElement?.getAttribute("class") || "";
        const classes = `${own} ${inherited}`.split(/\s+/);
        const coloured = classes.find(
          (t) => t.startsWith("text-") && !/^text-(xs|sm|base|lg|xl|\d+xl)$/.test(t),
        );
        expect(coloured, "an icon on a dark panel with no colour").toBeDefined();
      }
    });
  }
});
