"use client";

import { useEffect } from "react";

/**
 * The public-site template: entry animation plus scroll positioning.
 *
 * ## Why this file exists
 *
 * The Vite app got both behaviours from one trick in src/App.tsx:
 *
 *   const { pathname } = useLocation();
 *   <div key={pathname} className="page-enter">
 *
 * The `key` forced React to throw away the whole subtree and rebuild it on every
 * navigation, which had two effects: the `page-enter` animation replayed each
 * time, and the scroll-reset effect inside it re-ran from scratch.
 *
 * App Router has no `useLocation`, so there is no `pathname` to key on. The
 * idiomatic equivalent is a `template.tsx`, which Next remounts on navigation
 * for exactly this reason. Placing it in the `(site)` group rather than at the
 * app root preserves the original's deliberate asymmetry: the admin area gets
 * no entry animation, because a data-dense editing surface gains nothing from a
 * fade and animating tables makes them harder to scan.
 *
 * ## Opacity only, and why that matters here
 *
 * The animation is opacity-only on purpose. This wrapper is an ancestor of
 * everything a public page renders, including position: fixed chrome. A
 * transformed ancestor becomes the containing block for fixed descendants, so
 * animating a transform here would silently unpin the social row and the
 * back-to-top button and make them scroll with the page. The same reasoning is
 * recorded next to the keyframes in globals.css, and src/__tests__/motion.test.ts
 * fails the build if a transform appears.
 */
export default function SiteTemplate({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // A new route starts at the top of the document, unless the link carried a
    // fragment. Without the reset, a visitor who clicks a footer link from
    // halfway down a long page lands on the new page still scrolled to the same
    // offset, which on a short page looks like a blank screen.
    //
    // The hash is read from window.location rather than a hook: App Router
    // exposes no hash equivalent to useLocation(), and by the time this effect
    // runs the browser has already put the fragment in the URL.
    const hash = window.location.hash;
    const id = decodeURIComponent(hash.replace(/^#/, ""));

    if (!id) {
      window.scrollTo(0, 0);
      return;
    }

    // A browser honours a fragment on a fresh document load but never on a
    // client-side navigation, so the href looked right and went nowhere. This
    // is the fix, ported from src/hooks/useScrollOnRouteChange.ts, which this
    // file replaces. The behaviour is covered by app/__tests__/template.test.tsx.
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    let frames = 0;
    let cancelled = false;

    const find = () => {
      if (cancelled) return;
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({
          behavior: reduced ? "auto" : "smooth",
          block: "start",
        });
        return;
      }
      // Still not rendered. Give up after about ten frames rather than spinning
      // forever on a fragment that genuinely does not exist.
      if (frames++ < 10) requestAnimationFrame(find);
    };
    find();

    return () => {
      cancelled = true;
    };
  }, []);

  return <div className="page-enter">{children}</div>;
}
