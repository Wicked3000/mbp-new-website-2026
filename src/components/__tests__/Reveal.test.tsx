// @vitest-environment jsdom
// Uses react-dom directly rather than @testing-library/react, which is not a
// dependency of this project.
import { createRoot, type Root } from "react-dom/client";
import { act } from "react";
import fs from "node:fs";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

let container: HTMLDivElement;
let root: Root;

// Minimal IntersectionObserver stand-in. The reveal is driven purely by whether
// the element is reported as intersecting, so the tests drive that directly
// rather than faking scroll geometry.
let callbacks: IntersectionObserverCallback[] = [];
let observed: Element[] = [];
let liveObservers = 0;

class FakeObserver {
  constructor(cb: IntersectionObserverCallback) {
    callbacks.push(cb);
    liveObservers += 1;
  }
  observe(el: Element) {
    observed.push(el);
  }
  unobserve(el: Element) {
    observed = observed.filter((o) => o !== el);
  }
  disconnect() {
    liveObservers -= 1;
  }
  takeRecords() {
    return [];
  }
}

/** Report the given elements as having scrolled into view. */
function scrollIntoView(...els: Element[]) {
  const entries = els.map(
    (el) => ({ isIntersecting: true, target: el }) as IntersectionObserverEntry,
  );
  act(() => {
    for (const cb of callbacks) cb(entries, {} as IntersectionObserver);
  });
}

// Reveal holds a module-level observer shared by every instance on the page, so
// the module is re-imported per test. Without this the first test's observer
// would still be installed when the next one renders, and the second test would
// be measuring an observer it never created.
async function mount() {
  vi.resetModules();
  const { default: Reveal } = await import("../Reveal");
  return Reveal;
}

function stubMatchMedia(reduced: boolean) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn((q: string) => ({
      matches: reduced && q.includes("reduced-motion"),
      media: q,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
      onchange: null,
    })),
  );
}

const css = () => fs.readFileSync(path.resolve(import.meta.dirname, "../../index.css"), "utf8");

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  callbacks = [];
  observed = [];
  liveObservers = 0;
  vi.stubGlobal("IntersectionObserver", FakeObserver);
  stubMatchMedia(false);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  vi.unstubAllGlobals();
});

describe("Reveal", () => {
  it("leaves the content in the document so it is still readable and indexable", async () => {
    const Reveal = await mount();
    act(() => root.render(<Reveal>important copy</Reveal>));
    expect(container.textContent).toContain("important copy");
  });

  it("applies the reveal class and the caller's classes", async () => {
    const Reveal = await mount();
    act(() => root.render(<Reveal className="max-w-7xl">x</Reveal>));
    const el = container.firstElementChild!;
    expect(el.classList.contains("reveal")).toBe(true);
    expect(el.classList.contains("max-w-7xl")).toBe(true);
  });

  it("renders as the requested element and forwards other props to it", async () => {
    const Reveal = await mount();
    act(() => root.render(<Reveal as="section" id="mission">x</Reveal>));
    const el = container.firstElementChild!;
    expect(el.tagName).toBe("SECTION");
    expect(el.id).toBe("mission");
  });

  it("hides the element only after the observer has taken over, so the first paint is never blank", async () => {
    const Reveal = await mount();
    act(() => root.render(<Reveal>x</Reveal>));
    const el = container.firstElementChild!;
    // The observer runs in an effect, so by assertion time it is registered and
    // the element is queued to be hidden. What must never happen is the reverse:
    // a visible first paint followed by a hide, which reads as a flash.
    expect(el.getAttribute("data-revealed")).toBe("false");
    expect(observed).toContain(el);
  });

  it("reveals the element once it intersects", async () => {
    const Reveal = await mount();
    act(() => root.render(<Reveal>x</Reveal>));
    const el = container.firstElementChild!;
    scrollIntoView(el);
    expect(el.getAttribute("data-revealed")).toBe("true");
  });

  it("stops observing an element after revealing it", async () => {
    const Reveal = await mount();
    act(() => root.render(<Reveal>x</Reveal>));
    const el = container.firstElementChild!;
    scrollIntoView(el);
    expect(observed).not.toContain(el);
  });

  it("shares one observer across many elements", async () => {
    const Reveal = await mount();
    act(() =>
      root.render(
        <>
          <Reveal>a</Reveal>
          <Reveal>b</Reveal>
          <Reveal>c</Reveal>
        </>,
      ),
    );
    // One observer for the page, not one per section: a long page would otherwise
    // make the browser run intersection maths for every element it ever mounted.
    expect(liveObservers).toBe(1);
  });

  it("does not observe or hide anything when the visitor prefers reduced motion", async () => {
    stubMatchMedia(true);
    const Reveal = await mount();
    act(() => root.render(<Reveal>x</Reveal>));
    expect(container.firstElementChild?.getAttribute("data-revealed")).toBe("true");
    expect(observed).toHaveLength(0);
  });

  it("stays visible when the browser has no IntersectionObserver", async () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    const Reveal = await mount();
    act(() => root.render(<Reveal>x</Reveal>));
    expect(container.firstElementChild?.getAttribute("data-revealed")).toBe("true");
  });
});

describe("reduced-motion CSS", () => {
  // The failure this guards against is severe and silent: .reveal is
  // opacity: 0, so if the reduced-motion block removed the animation without
  // forcing opacity back to 1, every revealed section would stay invisible
  // forever and nothing would say why.
  it("forces revealed content visible under prefers-reduced-motion", () => {
    expect(css()).toMatch(
      /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.reveal[\s\S]*?\{[^}]*opacity:\s*1/,
    );
  });

  it("disables the page-enter animation under prefers-reduced-motion", () => {
    const reduced = css().slice(css().lastIndexOf("@media (prefers-reduced-motion: reduce)"));
    expect(reduced).toMatch(/\.page-enter[\s\S]*?animation:\s*none/);
  });
});
