// @vitest-environment jsdom
// The milestone timeline broke on phones in a way no other check would catch:
// the year badge was absolutely positioned at left-0 while the card was only
// indented by ml-4, so a 64px circle covered the card and the year rendered on
// top of the paragraph. Static class reading cannot see that - the classes are
// individually valid - so this measures the rendered geometry instead.
import { createRoot, type Root } from "react-dom/client";
import { act } from "react";
import { MemoryRouter } from "react-router-dom";
import { readFileSync } from "node:fs";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import AboutPage from "../About";

let container: HTMLDivElement;
let root: Root;

const PHONE = 390;

beforeEach(() => {
  // jsdom has no layout, so the viewport width is what Tailwind's responsive
  // variants key off in the test render. Geometry below is asserted by class
  // and by DOM order, not by real measurements.
  Object.defineProperty(window, "innerWidth", { value: PHONE, configurable: true });
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

function milestones() {
  act(() =>
    root.render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>,
    ),
  );
  const years = [...container.querySelectorAll("span")].filter((s) =>
    /^\d{4}$/.test(s.textContent || ""),
  );
  return years.map((y) => {
    const badge = y.closest("div")!;
    const item = badge.parentElement!;
    const card = item.querySelector("div.bg-white") as HTMLElement;
    return { year: y.textContent, badge, item, card };
  });
}

describe("milestone timeline on a phone", () => {
  it("renders every milestone", () => {
    expect(milestones().map((m) => m.year)).toEqual([
      "1976",
      "1995",
      "2002",
      "2015",
      "2020",
      "2024",
    ]);
  });

  it("keeps the year badge out of absolute positioning below lg", () => {
    // absolute left-0 is what put the badge on top of the card. The class has
    // to be prefixed with lg: so it only applies where the lg:pl-20 indent
    // makes room for it.
    for (const { badge } of milestones()) {
      const cls = badge.className;
      expect(cls).toMatch(/lg:absolute/);
      expect(cls).not.toMatch(/(^|[\s"])absolute(?=[\s"])/);
    }
  });

  it("puts the badge in the document flow before the card, so it cannot overlap", () => {
    for (const { item, badge, card } of milestones()) {
      expect(badge.compareDocumentPosition(card) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
      // mb below lg, none at lg, where the badge is out of flow.
      expect(badge.className).toMatch(/mb-4/);
      expect(item.className).toMatch(/lg:pl-20/);
    }
  });

  it("no longer indents the card on mobile, where there is no badge to clear", () => {
    // ml-4 was the bug's other half: it indented the card away from an
    // absolutely positioned badge that was never given matching room.
    for (const { card } of milestones()) {
      expect(card.className).not.toMatch(/(^|[\s"])ml-4/);
    }
  });

  it("reserves the badge space in the margin at lg and up", () => {
    for (const { item, badge } of milestones()) {
      expect(item.className).toMatch(/lg:pl-20/);
      expect(badge.className).toMatch(/lg:left-\[-7px\]/);
    }
  });

  it("keeps the spine hidden below lg, where there is no badge beside it", () => {
    // Asserted from the source: the spine is an empty div whose only purpose is
    // the lg-only rule, and locating it in the rendered tree is brittle.
    const src = readFileSync(
      path.resolve(import.meta.dirname, "..", "About.tsx"),
      "utf8",
    );
    const spine = /<div className="([^"]*w-0\.5[^"]*)"/.exec(src);
    expect(spine).not.toBeNull();
    expect(spine![1]).toMatch(/hidden lg:block/);
  });
});
