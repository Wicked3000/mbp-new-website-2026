/**
 * Public site chrome.
 *
 * ## This layout is almost empty, and that is deliberate
 *
 * 19 of the 21 public pages import SiteHeader and SiteFooter themselves and
 * render their own <main id="main-content">. Hoisting those into this layout
 * would be the more idiomatic App Router structure, but it would mean editing
 * all 19 files to remove chrome that is currently correct - and two of them
 * (Privacy, Terms) get theirs from LegalLayout instead, so the result would be
 * inconsistent for a while and identical afterwards. That refactor is worth
 * doing on its own, not folded into a framework migration where a doubled
 * header is hard to tell apart from a styling regression.
 *
 * So this layout contributes only the skip link, which App.tsx used to render
 * conditionally on `!pathname.startsWith("/admin")`. A route group gives that
 * condition structurally: everything in `(site)` is public, everything under
 * `admin/` is not.
 *
 * Note that `(site)` is a route group - the parentheses keep it out of the URL,
 * so `app/(site)/about/page.tsx` serves /about exactly as before.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:inline-block focus:bg-[#0B2545] focus:text-white focus:px-5 focus:py-3 focus:rounded-lg focus:font-semibold focus:shadow-lg"
      >
        Skip to main content
      </a>
      {children}
    </>
  );
}
