import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "@/lib/api";
import { SEARCH_GROUPS, searchRows, type SearchHit } from "@/lib/searchIndex";
import { SEARCH_SUGGESTIONS } from "@/components/siteNav";
import PageHero, { NAVY_HERO } from "@/components/PageHero";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Icon from "@/components/Icon";

/**
 * Site search.
 *
 * The header's Search button used to navigate to /selections and discard what
 * had been typed, and the only other results were eight hand-written page names.
 * Nothing on the site could be found by searching for it. This searches the
 * content instead: news, notices, events, programmes, districts, schools,
 * downloads, selection lists, centres and the enrolment steps.
 *
 * It runs in the browser over the public entities rather than through a server
 * endpoint, because the deployed site reads from PHP - a new endpoint would
 * have to exist in both that and the Node server before it worked anywhere. The
 * entities are small tables and this page is only visited deliberately.
 */
export default function SearchPage() {
  const [params] = useSearchParams();
  const query = (params.get("q") || "").trim();

  const [rowsByEntity, setRowsByEntity] = useState<Record<string, any[]>>({});

  useEffect(() => {
    let alive = true;
    // One failure must not blank the page: an entity that cannot be read is left
    // empty and the others still return results.
    Promise.all(
      SEARCH_GROUPS.map((g) =>
        api
          .list(g.entity)
          .then((rows) => [g.entity, Array.isArray(rows) ? rows : []] as const)
          .catch(() => [g.entity, [] as any[]] as const),
      ),
    ).then((pairs) => {
      if (alive) setRowsByEntity(Object.fromEntries(pairs));
    });
    return () => {
      alive = false;
    };
  }, []);

  const groups = useMemo(
    () =>
      SEARCH_GROUPS.map((group) => ({
        label: group.label,
        hits: searchRows(group, rowsByEntity[group.entity] ?? [], query),
      })).filter((g) => g.hits.length > 0),
    [rowsByEntity, query],
  );

  const total = groups.reduce((n, g) => n + g.hits.length, 0);

  /*
   * The named pages, matched on their keywords. Content rows alone do not cover
   * these: the selection lists are rows of school, district and stream, none of
   * which contain the word "selection", so a search for "selection lists"
   * returned downloads and enrolment steps but never the page itself.
   */
  const pageHits = useMemo<SearchHit[]>(() => {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) return [];
    return SEARCH_SUGGESTIONS.filter((s) =>
      [s.label, ...(s.keywords ?? [])].some((w) => w.toLowerCase().includes(words[0])),
    )
      .filter((s) => words.every((w) => [s.label, ...(s.keywords ?? [])].some((x) => x.toLowerCase().includes(w))))
      .map((s) => ({ group: "Pages", title: s.label, snippet: "", url: s.to }));
  }, [query]);

  const resultTotal = total + pageHits.length;

  return (
    <div className="min-h-screen bg-[#F8F6F1]" style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif" }}>
      <SiteHeader />
      <PageHero
        theme={NAVY_HERO}
        image="/assets/education_programs/map/milne_bay_map.jpg"
        imageAlt=""
        imageOpacity={20}
        eyebrow="Search"
        title="Search the site"
        lead="News, notices, calendar events, programmes, districts, schools, downloads and selection lists."
      />

      <main id="main-content" className="max-w-4xl mx-auto px-4 py-10 sm:py-14">
        <form role="search" action="/search" method="get" className="mb-10">
          <label htmlFor="search-page-field" className="sr-only">
            Search the site
          </label>
          <div className="flex rounded-2xl overflow-hidden bg-white border border-gray-200 focus-within:border-[#0D9488] focus-within:ring-2 focus-within:ring-[#0D9488]/20 transition-all">
            <span className="self-center pl-4 text-gray-400" aria-hidden="true">
              <Icon name="search" size={20} />
            </span>
            <input
              id="search-page-field"
              name="q"
              type="search"
              defaultValue={query}
              placeholder="Search term dates, schools, forms..."
              className="flex-1 px-3 py-4 text-base text-gray-800 bg-transparent outline-none placeholder:text-gray-400"
            />
            <button
              type="submit"
              className="px-6 sm:px-8 font-bold text-white bg-[#0B2545] hover:bg-[#163663] transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        {!query ? (
          <p className="text-gray-600">Type a word or two above to search the whole site.</p>
        ) : resultTotal === 0 ? (
          <div>
            <h1
              className="text-2xl font-bold text-[#0B2545] mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              No results for &ldquo;{query}&rdquo;
            </h1>
            <p className="text-gray-600">
              Check the spelling, or try a broader word &mdash; a district name, a school, a subject, or
              the kind of form you need.
            </p>
          </div>
        ) : (
          <div>
            <h1
              className="text-2xl font-bold text-[#0B2545] mb-8"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {total} result{total === 1 ? "" : "s"} for &ldquo;{query}&rdquo;
            </h1>
            {pageHits.length > 0 ? (
              <section className="mb-9">
                <h2 className="text-xs font-bold uppercase tracking-widest text-[#0D9488] mb-3">
                  Pages
                </h2>
                <ul className="space-y-2">
                  {pageHits.map((hit, i) => (
                    <li key={`page-${i}`}>
                      <Link
                        to={hit.url}
                        className="block rounded-xl border border-gray-100 bg-white px-5 py-4 hover:border-[#0D9488]/40 transition-colors"
                      >
                        <div className="font-semibold text-[#0B2545]">{hit.title}</div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
            {groups.map((group) => (
              <section key={group.label} className="mb-9">
                <h2 className="text-xs font-bold uppercase tracking-widest text-[#0D9488] mb-3">
                  {group.label}
                </h2>
                <ul className="space-y-2">
                  {(group.hits as SearchHit[]).map((hit, i) => (
                    <li key={`${group.label}-${i}`}>
                      <Link
                        to={hit.url}
                        className="block rounded-xl border border-gray-100 bg-white px-5 py-4 hover:border-[#0D9488]/40 transition-colors"
                      >
                        <div className="font-semibold text-[#0B2545]">{hit.title}</div>
                        {hit.snippet ? (
                          <div className="text-sm text-gray-600 mt-1">{hit.snippet}</div>
                        ) : null}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
