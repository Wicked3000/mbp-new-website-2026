// @vitest-environment jsdom
// The top contact bar used emoji for the phone and envelope. Emoji are rendered
// by the platform rather than the stylesheet, so they arrive in colour, at a
// different size to the text beside them, and inconsistently across Windows,
// macOS, Android and Linux. This asserts the bar is built from the shared SVG
// icons and that each glyph is hidden from assistive tech, since the text beside
// it already carries the meaning.
import { createRoot, type Root } from "react-dom/client";
import { act } from "react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import SiteHeader from "../SiteHeader";

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  act(() =>
    root.render(
      <MemoryRouter>
        <SiteHeader />
      </MemoryRouter>,
    ),
  );
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

const top = () => container.querySelector("div.bg-\\[\\#07192E\\]")!;

describe("top contact bar", () => {
  it("uses no emoji anywhere in the bar", () => {
    // The specific range that held 📞 and ✉️, plus the common pictographs, so a
    // reintroduction anywhere in the bar is caught.
    expect(top().textContent || "").not.toMatch(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u);
  });

  it("renders an svg for each contact detail", () => {
    const svgs = top().querySelectorAll("svg");
    expect(svgs.length).toBeGreaterThanOrEqual(3);
  });

  it("hides every glyph from assistive tech, since the text beside it says the same thing", () => {
    for (const svg of top().querySelectorAll("svg")) {
      expect(svg.getAttribute("aria-hidden")).toBe("true");
      expect(svg.getAttribute("focusable")).toBe("false");
    }
  });

  it("strokes the icons rather than filling them, matching the admin icon set", () => {
    for (const svg of top().querySelectorAll("svg")) {
      expect(svg.getAttribute("fill")).toBe("none");
      expect(svg.getAttribute("stroke")).toBe("currentColor");
      expect(svg.getAttribute("stroke-width")).toBe("1.8");
    }
  });

  it("makes the phone number and email clickable", () => {
    expect(top().querySelector('a[href^="tel:"]')?.textContent).toContain("+675 641 1234");
    expect(top().querySelector('a[href^="mailto:"]')?.textContent).toContain(
      "info@mbpeducation.gov.pg",
    );
  });

  it("keeps the same text it had before", () => {
    const text = top().textContent || "";
    expect(text).toContain("+675 641 1234");
    expect(text).toContain("info@mbpeducation.gov.pg");
    expect(text).toContain("8:00am");
    expect(text).toContain("NDoE Portal");
    expect(text).toContain("TSC Online");
  });

  it("gives each glyph an explicit size so it aligns with the text", () => {
    for (const svg of top().querySelectorAll("svg")) {
      expect(svg.getAttribute("width")).toBe("14");
      expect(svg.getAttribute("height")).toBe("14");
    }
  });
});
