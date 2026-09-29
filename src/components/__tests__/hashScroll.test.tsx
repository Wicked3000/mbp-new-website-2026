// @vitest-environment jsdom
// In-page anchor links must land on the section they name.
//
// The About page's "View Our Programs" points at /#programs and ProgramsSection
// carries id="programs" - so the href was right and the behaviour was not. A
// browser only honours a fragment on a fresh document load, never on a
// client-side navigation, and the app reset the scroll to the top on every route
// change. Every in-page anchor on the site did nothing: that button, the footer's
// "VET Centres Alotau" at /vet#centres, "FODE Enrolment" at /fode#centres.
import { createRoot, type Root } from "react-dom/client";
import React, { act } from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useScrollOnRouteChange } from "@/hooks/useScrollOnRouteChange";

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
function Page({ fragment, delay = 0 }: { fragment?: string; delay?: number }) {
  useScrollOnRouteChange(false);
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
      {ready ? (
        <>
          <div id="programs" data-testid="programs" />
          <div id="centres" data-testid="centres" />
          <div id="schools" data-testid="schools" />
        </>
      ) : null}
      <p>{fragment ?? ""}</p>
    </div>
  );
}

function renderAt(path: string, delay = 0) {
  act(() =>
    root.render(
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="*" element={<Page fragment={path} delay={delay} />} />
        </Routes>
      </MemoryRouter>,
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
    renderAt("/#programs");
    await settle();
    expect(scrollIntoView).toHaveBeenCalledTimes(1);
    // The right element, not merely some element.
    expect(scrolled[0]?.id).toBe("programs");
  });

  it("waits for a target that renders a few frames after the navigation", async () => {
    // This is the real client-side case: the destination is not mounted when
    // the effect runs. A single lookup finds nothing and the visitor lands at
    // the top of the page with no error anywhere.
    renderAt("/#centres", 3);
    expect(scrolled).toHaveLength(0);
    await settle();
    expect(scrolled[0]?.id).toBe("centres");
  });

  it("does not reset to the top when a fragment is present", async () => {
    renderAt("/#programs");
    await settle();
    expect(scrollTo).not.toHaveBeenCalledWith(0, 0);
  });

  it("resets to the top when there is no fragment", async () => {
    renderAt("/");
    await settle();
    expect(scrollTo).toHaveBeenCalledWith(0, 0);
    expect(scrollIntoView).not.toHaveBeenCalled();
  });

  it("handles a fragment whose target is missing without scrolling anywhere", async () => {
    renderAt("/#does-not-exist");
    await settle();
    // Neither scrolled: there is nowhere to go, and guessing would be worse
    // than doing nothing.
    expect(scrollIntoView).not.toHaveBeenCalled();
    expect(scrollTo).not.toHaveBeenCalled();
  });

  it("stops retrying rather than looping on a missing target", async () => {
    renderAt("/#nope");
    await settle();
    // The retry gives up after about ten frames, so nothing is still pending.
    expect(scrollIntoView).not.toHaveBeenCalled();
  });

  it("leaves the admin alone, where scroll position is meaningful", async () => {
    act(() =>
      root.render(
        <MemoryRouter initialEntries={["/admin"]}>
          <Routes>
            <Route
              path="*"
              element={
                <div>
                  <AdminProbe />
                </div>
              }
            />
          </Routes>
        </MemoryRouter>,
      ),
    );
    await settle();
    expect(scrollTo).not.toHaveBeenCalledWith(0, 0);
    expect(scrollIntoView).not.toHaveBeenCalled();
  });
});

function AdminProbe() {
  useScrollOnRouteChange(true);
  return <div id="admin-table" />;
}
