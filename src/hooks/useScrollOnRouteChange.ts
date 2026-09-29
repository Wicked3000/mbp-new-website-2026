import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Sends the viewport to the right place when the route changes.
 *
 * A new route starts at the top of the document, unless the link carried a
 * fragment. Without the reset, a visitor who clicks a footer link from halfway
 * down a long page lands on the new page still scrolled to the same offset,
 * which on a short page looks like a blank screen.
 *
 * The fragment case used to be broken. Every in-page anchor on the site - the
 * About page's "View Our Programs" pointing at /#programs, the footer's "VET
 * Centres Alotau" at /vet#centres, "FODE Enrolment" at /fode#centres - scrolled
 * to the top of the destination instead. A browser only honours a fragment on a
 * fresh document load and never on a client-side navigation, so the href looked
 * right and went nowhere.
 *
 * The target is looked for over several frames rather than once: on a
 * client-side navigation the new page has not rendered when the effect runs, so
 * a single getElementById finds nothing and the visitor lands at the top again
 * without any visible error. Reduced motion keeps the jump instant, matching the
 * reset.
 */
export function useScrollOnRouteChange(isAdmin = false) {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // The admin is a data-dense editing surface where the position is
    // meaningful - an admin scrolled to a row in a table should stay there.
    if (isAdmin) return;

    const id = decodeURIComponent(hash.replace(/^#/, ""));
    if (!id) {
      window.scrollTo(0, 0);
      return;
    }

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
  }, [pathname, hash, isAdmin]);
}
