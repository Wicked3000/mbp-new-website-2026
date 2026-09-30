import { Suspense } from "react";
import Search from "@/views/Search";

/**
 * /search
 *
 * The Suspense boundary is required, not decorative. `useSearchParams` opts the
 * component out of server rendering, and Next refuses to prerender the page
 * without one:
 *
 *   useSearchParams() should be wrapped in a suspense boundary at page "/search"
 *
 * The alternative - `export const dynamic = "force-dynamic"` on this page - was
 * rejected on purpose. That would opt the whole page out of static generation
 * when the search results are, by construction, per-visitor and fetched in the
 * browser anyway: Search loads its rows client-side from the public entities
 * (see the comment in src/views/Search.tsx). A boundary lets the shell, header
 * and hero prerender as static HTML and only the results area bails out, which
 * is both faster to first paint and a smaller behavioural change from the SPA.
 */
export default function Page() {
  return (
    <Suspense fallback={null}>
      <Search />
    </Suspense>
  );
}
