// @vitest-environment jsdom
// The home page mission button.
//
// Its label is stored content, not a literal, so the component can show the
// database's value or the code fallback depending on whether the API answered.
// That is how "Our Programs" survived here while other copy was corrected: the
// two sources had to be changed separately, and nothing compared them.
import { createRoot, type Root } from "react-dom/client";
import { act } from "react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { AboutMissionSection } from "@/home/AboutMissionSection";
import { SEEDS } from "@/lib/seedData";

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
      <AboutMissionSection />,
    ),
  );
  return container;
}

describe("the home page mission button", () => {
  it("reads 'Find out more'", () => {
    const link = [...render().querySelectorAll("a")].find((a) =>
      /out more/i.test(a.textContent || ""),
    );
    expect(link, "no 'Find out more' link in the mission section").toBeDefined();
  });

  it("no longer reads 'Our Programs'", () => {
    expect(render().textContent).not.toContain("Our Programs");
  });

  it("carries no trailing arrow, which the old label had hardcoded", () => {
    const link = [...render().querySelectorAll("a")].find((a) =>
      /out more/i.test(a.textContent || ""),
    )!;
    // The arrow was a separate hardcoded span beside the stored label, so it
    // survived every change to the label itself.
    expect(link.textContent?.trim()).toBe("Find out more");
  });

  it("still points at the About page", () => {
    const link = [...render().querySelectorAll("a")].find((a) =>
      /out more/i.test(a.textContent || ""),
    )!;
    expect(link.getAttribute("href")).toBe("/about");
  });

  it("agrees with the stored seed, so a fresh import shows the same label", () => {
    const row = (SEEDS.home_mission as any[])[0];
    expect(row.button_label).toBe("Find out more");
    expect(row.button_href).toBe("/about");
  });
});
