// @vitest-environment jsdom
// The strongest check available without a browser: render the sections that hold
// admin-stored icon values and assert that no emoji reaches the DOM.
//
// The emoji are still in the bundle - they have to be, as the lookup keys in
// emojiMap and as the stored content itself. What matters is that nothing is
// rendered as one, so this renders real sections and reads the DOM.
import { createRoot, type Root } from "react-dom/client";
import { act } from "react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { SupportSection } from "@/pages/FODE/SupportSection";
import { ProgramsSection } from "@/pages/VET/ProgramsSection";
import { OverviewSection } from "@/pages/PostPrimary/OverviewSection";
import { KeyInfoSection } from "@/pages/Selections/KeyInfoSection";
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
  act(() =>
    root.render(
      <MemoryRouter>{node}</MemoryRouter>,
    ),
  );
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
