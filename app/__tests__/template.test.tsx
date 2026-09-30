// @vitest-environment jsdom
// In-page anchor links must land on the section they name.
//
// The About page's "View Our Programs" points at /#programs and ProgramsSection
// carries id="programs" - so the href was right and the behaviour was not. A
// browser only honours a fragment on a fresh document load, never on a
// client-side navigation, and the app reset the scroll to the top on every route
// change. Every in-page anchor on the site did nothing: that button, the footer's
// "VET Centres Alotau" at /vet#centres, "FODE Enrolment" at /fode#centres.
//
// The behaviour under test now lives in app/(site)/template.tsx, which replaced
// the src/hooks/useScrollOnRouteChange hook. It is a component rather than a hook
// precisely because App Router has no useLocation to key a remount on: template.tsx
// is remounted by Next on every navigation, which is what makes the effect run
// again. The assertions are unchanged.
import { createRoot, type Root } from "react-dom/client";
import React, { act } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import SiteTemplate from "@app/(site)/template";

let container: HTMLDivElement;
let root: Root;
let scrollTo: ReturnType<typeof vi.fn>;
let scrollIntoView: ReturnType<typeof vi.fn>;
/** The elements scrollIntoView was called on, so the test can name one. */
let scrolled: Element[] = [];

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  // jsdom has no layout, so both scroll APIs are recorded rather than performed.
  scrollTo = vi.fn();
  scrolled = [];
  scrollIntoView = vi.fn(function (this: Element) {
    scrolled.push(this);
  });
  window.scrollTo = scrollTo as unknown as typeof window.scrollTo;
  Element.prototype.scrollIntoView = scrollIntoView as unknown as typeof Element.prototype.scrollIntoView;
  // The template reads the fragment from window.location, exactly as it must in
  // the browser: App Router exposes no hash equivalent to useLocation().
  window.location.hash = "";
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  vi.restoreAllMocks();
});

/**
 * A page carrying the anchors the real site uses.
 *
 * `delay` mounts the targets only after that many frames, which is the real
 * case: on a client-side navigation the destination has not rendered when the
 * effect runs, so a single getElementById finds nothing. A lookup that does not
 * retry silently lands the visitor at the top of the page instead.
 */
function Page({ delay = 0, ids = ["programs", "centres", "schools"] }: { delay?: number; ids?: string[] }) {
  const [ready, setReady] = React.useState(delay === 0);
  React.useEffect(() => {
    if (delay === 0) return;
    let n = 0;
    const tick = () => {
      if (++n >= delay) setReady(true);
      else requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [delay]);
  return (
    <div>
      {ready
        ? ids.map((id) => <div key={id} id={id} data-testid={id.replace(/\s/g, "-")} />)
        : null}
    </div>
  );
}

function renderAt(fragment: string, delay = 0) {
  window.location.hash = fragment;
  act(() =>
    root.render(
      <SiteTemplate>
        <Page delay={delay} />
      </SiteTemplate>,
    ),
  );
}

/** Lets the requestAnimationFrame retries run. */
async function settle() {
  for (let i = 0; i < 12; i++) {
    await act(async () => {
      await new Promise((r) => requestAnimationFrame(() => r(null)));
    });
  }
}

describe("in-page anchor navigation", () => {
  it("scrolls to the section the fragment names", async () => {
    renderAt("#programs");
    await settle();
    expect(scrollIntoView).toHaveBeenCalledTimes(1);
    // The right element, not merely some element.
    expect(scrolled[0]?.id).toBe("programs");
  });

  it("waits for a target that renders a few frames after the navigation", async () => {
    // This is the real client-side case: the destination is not mounted when
    // the effect runs. A single lookup finds nothing and the visitor lands at
    // the top of the page with no error anywhere.
    renderAt("#centres", 3);
    expect(scrolled).toHaveLength(0);
    await settle();
    expect(scrolled[0]?.id).toBe("centres");
  });

  it("does not reset to the top when a fragment is present", async () => {
    renderAt("#programs");
    await settle();
    expect(scrollTo).not.toHaveBeenCalledWith(0, 0);
  });

  it("resets to the top when there is no fragment", async () => {
    renderAt("");
    await settle();
    expect(scrollTo).toHaveBeenCalledWith(0, 0);
    expect(scrollIntoView).not.toHaveBeenCalled();
  });

  it("handles a fragment whose target is missing without scrolling anywhere", async () => {
    renderAt("#does-not-exist");
    await settle();
    // Neither scrolled: there is nowhere to go, and guessing would be worse
    // than doing nothing.
    expect(scrollIntoView).not.toHaveBeenCalled();
    expect(scrollTo).not.toHaveBeenCalled();
  });

  it("stops retrying rather than looping on a missing target", async () => {
    renderAt("#nope");
    await settle();
    // The retry gives up after about ten frames, so nothing is still pending.
    expect(scrollIntoView).not.toHaveBeenCalled();
  });

  it("honours a percent-encoded fragment", async () => {
    // A section id containing a space has to be written %20 in an href, so the
    // template has to decode before it looks the id up. Without the decode,
    // getElementById("school%20list") finds nothing and the visitor silently
    // lands at the top of the page.
    window.location.hash = "#school%20list";
    act(() =>
      root.render(
        <SiteTemplate>
          <Page ids={["school list"]} />
        </SiteTemplate>,
      ),
    );
    await settle();
    expect(scrolled).toHaveLength(1);
    expect(scrolled[0]?.id).toBe("school list");
  });
});

/*
 * The admin case is no longer tested here, and that is an improvement rather
 * than a gap. The old hook took an `isAdmin` boolean and returned early when it
 * was set - a flag every caller had to remember to pass correctly. The template
 * now lives in the `(site)` route group, so the admin tree is not merely
 * skipping the behaviour, it is structurally unable to inherit it: there is no
 * admin route under app/(site)/ for this component to appear in.
 */
