import NotFoundPage from "@/views/NotFound";

/**
 * The global 404.
 *
 * Served for any URL that matches no route, which is what `<Route path="*">` did
 * in App.tsx:135. NotFoundPage brings its own SiteHeader, SiteFooter and
 * <main id="main-content">, so it is self-contained and needs no chrome from a
 * parent layout.
 *
 * The page-enter class is applied here rather than inherited from
 * `(site)/template.tsx`, because an unmatched top-level URL is rendered by the
 * root layout and never enters the `(site)` group. Without it this one page
 * would be the only route on the site that does not animate in - the original
 * wrapped it along with everything else.
 */
export default function NotFound() {
  return (
    <div className="page-enter">
      <NotFoundPage />
    </div>
  );
}
