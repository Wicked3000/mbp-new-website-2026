// The home hero fills the screen, so the first view is hero and nothing else.
//
// A regression here is invisible to every other check: the section still renders,
// still has its h1, still passes check:banners and check:motion. It would simply
// stop being a full-height banner, which is exactly the kind of change that gets
// noticed by a visitor rather than by CI.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const root = path.resolve(import.meta.dirname, "..", "..");
const hero = fs.readFileSync(path.join(root, "home", "HeroSection.tsx"), "utf8");
const header = fs.readFileSync(path.join(root, "components", "SiteHeader.tsx"), "utf8");

/** The className on the root <section> of the hero. */
function heroSectionClass() {
  const m = /<section[\s\S]*?data-page-hero=""\s*[\s\S]*?className="([^"]+)"/.exec(hero);
  if (!m) throw new Error("no data-page-hero section found in HeroSection.tsx");
  return m[1];
}

describe("home hero", () => {
  it("fills the viewport", () => {
    expect(heroSectionClass()).toMatch(/min-h-\[calc\(100\w{1,2}h-/);
  });

  // vh ignores the mobile browser chrome, so the bottom of the hero ends up
  // under the address bar. The svh declaration that follows must exist or the
  // smaller-viewport-unit line is dead weight.
  it("prefers small viewport height so mobile chrome does not cover the hero", () => {
    const cls = heroSectionClass();
    const vh = cls.indexOf("min-h-[calc(100vh-");
    const svh = cls.indexOf("min-h-[calc(100svh-");
    expect(vh).toBeGreaterThanOrEqual(0);
    expect(svh).toBeGreaterThan(vh);
  });

  it("centres its content rather than pinning it to the top", () => {
    expect(heroSectionClass()).toMatch(/flex items-center/);
  });

  // min-h rather than h: a long headline on a short window has to be able to
  // grow the section. A fixed height would clip the text and hide the buttons.
  it("can grow past the viewport rather than clipping its content", () => {
    // A fixed height, or a max-height, would clip a long headline on a short
    // window and hide the buttons. min-h only sets a floor.
    const cls = heroSectionClass();
    // "min-h-[" contains "h-[", so the negative assertion has to exclude the
    // min- prefix rather than look for a bare h-[.
    expect(cls).not.toMatch(/(^|[\s"])(h-\[|max-h-)/);
  });

  it("subtracts the header, so the hero is not taller than the space it has", () => {
    const m = /min-h-\[calc\(100svh-([\d.]+)rem\)\]/.exec(heroSectionClass());
    expect(m).not.toBeNull();
    expect(Number(m![1])).toBeGreaterThan(0);
  });

  it("leaves room below the content for the slide dots", () => {
    // The dots sit at the section's bottom edge; without the padding the last
    // element of the centred content would land on top of them.
    expect(hero).toMatch(/px-4[^"]*pt-\d+[^"]*pb-2[04]/);
    expect(hero).toMatch(/absolute bottom-6 left-1\/2/);
  });

  it("stays full-bleed: no width constraint on the section itself", () => {
    // The content column is max-w-7xl, but that is a child. A constraint here
    // would leave the background not reaching the page edges.
    expect(heroSectionClass()).not.toMatch(/max-w-/);
    expect(heroSectionClass()).not.toMatch(/(^|[\s"])(w-\[|w-(?!full))/);
  });

  it("is still the one h1 on the home page", () => {
    expect((hero.match(/<h1[\s>]/g) || []).length).toBe(1);
  });

  it("keeps the header sticky, which is what the offset assumes", () => {
    expect(header).toMatch(/sticky top-0/);
  });
});
