// @vitest-environment jsdom
// The figures strip must look the same on the home page and the About page.
//
// They were two separate implementations and had already drifted. The About
// page's was a six-column grid; when that page was pointed at the stats table it
// began rendering four items into it, so two columns sat empty and the numbers
// looked pushed to the left. Nothing detected it, because both rendered valid
// markup with the right words in them.
import { createRoot, type Root } from "react-dom/client";
import { act } from "react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { StatsRow } from "@/components/StatsRow";
import { StatsSection } from "@/home/StatsSection";
import AboutPage from "@/views/About";

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

const FOUR = [
  { value: "312", label: "Schools", sub: "Province-wide" },
  { value: "48,200+", label: "Students", sub: "Enrolled 2026" },
  { value: "2,140", label: "Teachers", sub: "Qualified staff" },
  { value: "4", label: "Districts", sub: "Covered" },
];

/** The grid the figures sit in, whichever component rendered it. */
function grid() {
  return container.querySelector("[data-stats-row]") as HTMLElement | null;
}

function render(node: React.ReactNode) {
  // No router wrapper: next/link renders without a router context.
  act(() => root.render(node));
  return grid();
}

describe("the figures strip", () => {
  it("centres the text", () => {
    expect(render(<StatsRow items={FOUR} />)?.className).toContain("text-center");
  });

  it("sizes the grid to the number of figures, so no column is left empty", () => {
    // Four figures in a six-column grid is what pushed the About page's numbers
    // off to the left: two of the six tracks had nothing in them.
    expect(render(<StatsRow items={FOUR} />)?.className).toContain("lg:grid-cols-4");
    const six = [
      ...FOUR,
      { value: "25+", label: "Years", sub: "Of Service" },
      { value: "4", label: "Programs", sub: "Education Streams" },
    ];
    expect(six).toHaveLength(6);
    expect(render(<StatsRow items={six} />)?.className).toContain("lg:grid-cols-6");
  });

  it("renders one cell per figure", () => {
    const g = render(<StatsRow items={FOUR} />)!;
    expect(g.children).toHaveLength(FOUR.length);
  });

  it("shows the figures with their label and caption", () => {
    const text = render(<StatsRow items={FOUR} />)!.textContent || "";
    for (const s of FOUR) {
      expect(text).toContain(s.value);
      expect(text).toContain(s.label);
      expect(text).toContain(s.sub);
    }
  });

  it("divides the cells the way the home page does", () => {
    expect(render(<StatsRow items={FOUR} />)?.className).toContain("lg:divide-x");
  });

  it("the home page and the About page render the same strip", () => {
    const home = render(<StatsSection />)!;
    const homeClasses = home.className;

    // Remount for the other page so the assertion compares fresh output.
    act(() => root.unmount());
    root = createRoot(container);
    const about = render(<AboutPage />)!;

    expect(about.className).toBe(homeClasses);
  });

  it("both pages show the same figures", () => {
    const homeText = render(<StatsSection />)!.textContent || "";
    act(() => root.unmount());
    root = createRoot(container);
    const aboutText = render(<AboutPage />)!.textContent || "";

    for (const s of FOUR) {
      expect(homeText).toContain(s.value);
      expect(aboutText).toContain(s.value);
    }
  });
});
