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
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

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

const SLIDES = [
  {
    image: "/assets/slider/mbp-img1.jpg",
    imageAlt: "Students and community learning",
    eyebrow: "Milne Bay Province - Papua New Guinea",
    title: "About the Division",
    highlight: " of Education",
    lead: "Learn about our mission and leadership.",
  },
  {
    image: "/assets/slider/mbp-img2.jpg",
    imageAlt: "Province schools",
    eyebrow: "Our Mission",
    title: "Empowering Communities",
    lead: "Equitable education for every child.",
  },
  {
    image: "/assets/slider/mbp-img3.jpg",
    imageAlt: "Coastal education community",
    eyebrow: "Our Commitment",
    title: "Serving Every Community",
    lead: "From Samarai to the highlands of Alotau.",
  },
];

describe("a rotating page banner", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  const renderSlides = () =>
    render({ image: undefined, imageAlt: undefined, eyebrow: undefined, title: undefined, lead: undefined, slides: SLIDES });

  it("shows the first frame's words, not every frame's", () => {
    renderSlides();
    const text = container.textContent || "";
    expect(text).toContain("About the Division");
    // The other frames' words are not mounted. Rendering all three would put
    // three sets of headings in the banner and repeat the eyebrow three times.
    expect(text).not.toContain("Our Mission");
    expect(container.querySelectorAll("h1")).toHaveLength(1);
  });

  it("brings each frame's own words with its image", () => {
    renderSlides();
    // Every frame's photograph is mounted, so the next one is decoded before it
    // is shown and the crossfade has nothing to wait for.
    const images = [...container.querySelectorAll("img")];
    expect(images).toHaveLength(3);
    expect(images[0].getAttribute("src")).toBe(SLIDES[0].image);
    expect(images[2].getAttribute("src")).toBe(SLIDES[2].image);
  });

  it("moves to the next frame on the timer, changing the words too", () => {
    renderSlides();
    act(() => {
      vi.advanceTimersByTime(8_000);
    });
    const text = container.textContent || "";
    expect(text).toContain("Empowering Communities");
    expect(text).not.toContain("About the Division");
    // Still one heading, and still the first: the text swaps, it does not stack.
    expect(container.querySelectorAll("h1")).toHaveLength(1);
    expect(container.querySelector("h1")!.textContent).toContain("Empowering Communities");
  });

  it("has no arrows, leaving the dots as the only manual control", () => {
    renderSlides();
    const labels = [...container.querySelectorAll("button")].map(
      (b) => b.getAttribute("aria-label") || "",
    );
    // The banner advances on its own, so a pair of arrows either sit there
    // duplicating the timer or invite a click that only skips one frame.
    expect(labels.some((l) => l === "Next slide" || l === "Previous slide")).toBe(false);
    expect(labels.filter((l) => l.startsWith("Go to slide"))).toHaveLength(3);
  });

  it("jumps straight to a frame on a dot, rather than stepping through", () => {
    renderSlides();
    const third = [...container.querySelectorAll("button")].find(
      (b) => b.getAttribute("aria-label") === "Go to slide 3",
    )!;
    act(() => {
      third.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    // Straight to the third, not to the second on the way there.
    expect(container.querySelector("h1")!.textContent).toContain("Serving Every Community");
  });

  it("marks the current frame for assistive tech and hides the rest", () => {
    renderSlides();
    const groups = [...container.querySelectorAll("[aria-roledescription=slide]")];
    expect(groups).toHaveLength(3);
    expect(groups[0].getAttribute("aria-hidden")).toBe("false");
    expect(groups[1].getAttribute("aria-hidden")).toBe("true");
    act(() => {
      const second = [...container.querySelectorAll("button")].find(
        (b) => b.getAttribute("aria-label") === "Go to slide 2",
      )!;
      second.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(container.querySelectorAll("[aria-roledescription=slide]")[0].getAttribute("aria-hidden")).toBe(
      "true",
    );
  });

  it("does not rotate on its own once the visitor wants reduced motion", () => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    vi.spyOn(window, "matchMedia").mockImplementation((q: string) =>
      q.includes("reduced-motion")
        ? ({ ...mq, matches: true, addEventListener() {}, removeEventListener() {} } as MediaQueryList)
        : mq,
    );
    renderSlides();
    act(() => {
      vi.advanceTimersByTime(40_000);
    });
    expect(container.querySelector("h1")!.textContent).toContain("About the Division");
    vi.restoreAllMocks();
  });

  it("stops rotating while the pointer is over it", () => {
    renderSlides();
    const section = container.querySelector("section")!;
    act(() => {
      section.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
    });
    act(() => {
      vi.advanceTimersByTime(40_000);
    });
    expect(container.querySelector("h1")!.textContent).toContain("About the Division");
  });

  it("behaves as a fixed banner when given a single slide", () => {
    render({ slides: [SLIDES[0]] });
    // No controls, and no carousel role: one frame has nothing to rotate to.
    expect(container.querySelector("[aria-roledescription=carousel]")).toBeNull();
    expect(container.querySelectorAll("img")).toHaveLength(1);
    expect(container.querySelector("h1")!.textContent).toContain("About the Division");
  });
});
