import { Link, useSearchParams } from "react-router-dom";
import { useState, useMemo } from "react";
import { useEntity } from "@/hooks/useDynamic";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const FALLBACK_NEWS = [
  {
    id: 1,
    tag: "Announcement",
    tag_color: "bg-[#0D9488]",
    news_date: "September 18, 2026",
    title: "Grade 8 and Grade 10 Examination Timetable Released",
    excerpt:
      "The Division of Education has officially released the 2026 examination timetable for all Grade 8 and Grade 10 students across Milne Bay Province.",
    img: "/assets/education_programs/basic/banner.jpg",
    is_published: 1,
  },
  {
    id: 2,
    tag: "Programs",
    tag_color: "bg-[#C9A84C] text-[#0B2545]",
    news_date: "September 10, 2026",
    title: "New VET Training Centres to Open in Alotau and Samarai",
    excerpt:
      "Two new Vocational Education and Training centres are set to open in Term 4, expanding skills-based learning opportunities for youth across the province.",
    img: "/assets/education_programs/vet/banner.jpg",
    is_published: 1,
  },
  {
    id: 3,
    tag: "Notice",
    tag_color: "bg-[#0B2545]",
    news_date: "August 29, 2026",
    title: "School Subsidy Payment Schedule for Term 4 Now Available",
    excerpt:
      "Head teachers and school boards are advised to collect the Term 4 subsidy payment schedules from the Division office by 5 October 2026.",
    img: "/assets/slider/mbp-img1.jpg",
    is_published: 1,
  },
];

const EXTERNAL_NEWS = [
  {
    id: "ext1",
    tag: "NDoE",
    tag_color: "bg-[#0B2545]",
    news_date: "September 20, 2026",
    title: "National Department of Education Launches New Standards-Based Curriculum Resources",
    excerpt:
      "NDoE has released updated SBC teaching guides for Grades 3-8, now available for download via the Curriculum Division portal.",
    img: "/assets/slider/mbp-img2.jpg",
    href: "https://education.gov.pg",
    external: true,
  },
  {
    id: "ext2",
    tag: "TSC",
    tag_color: "bg-[#163663]",
    news_date: "September 15, 2026",
    title: "Teaching Service Commission Opens 2027 Teacher Registration",
    excerpt:
      "All teachers must renew registration by 30 November 2026. TSC Online portal now handles e-registration and payroll queries.",
    img: "/assets/education_programs/fode/banner.jpg",
    href: "https://tsc.gov.pg",
    external: true,
  },
  {
    id: "ext3",
    tag: "UNICEF",
    tag_color: "bg-[#0D9488]",
    news_date: "September 8, 2026",
    title: "UNICEF PNG Supports WASH Improvements in Milne Bay Schools",
    excerpt:
      "50 schools in Milne Bay will receive new water and sanitation facilities under the Australia-PNG Partnership, improving attendance and health.",
    img: "/assets/education_programs/map/milne_bay_map.jpg",
    href: "https://unicef.org/png",
    external: true,
  },
  {
    id: "ext4",
    tag: "World Bank",
    tag_color: "bg-[#C9A84C] text-[#0B2545]",
    news_date: "August 30, 2026",
    title: "World Bank Funds New Elementary Classrooms in Remote Islands",
    excerpt:
      "K18M investment will build 40 classrooms across Samarai-Murua and Kiriwina-Goodenough, targeting vernacular early learning.",
    img: "/assets/slider/mbp-img3.jpg",
    href: "https://worldbank.org",
    external: true,
  },
];

type Tab = "latest" | "previous" | "external";

const TAB_LABELS: Record<Tab, string> = {
  latest: "Latest News",
  previous: "Previous News",
  external: "External Education News",
};

function NoResults({
  query,
  tab,
  counts,
  onSwitch,
}: {
  query: string;
  tab: Tab;
  counts: Record<Tab, number>;
  onSwitch: (t: Tab) => void;
}) {
  const elsewhere = (Object.keys(TAB_LABELS) as Tab[]).filter(
    (t) => t !== tab && counts[t] > 0,
  );
  return (
    <div className="col-span-full text-center py-16 bg-white rounded-2xl border border-gray-100 text-gray-500">
      <p className="text-[#0B2545] font-bold">
        {query ? <>No matches for &ldquo;{query}&rdquo; in {TAB_LABELS[tab]}.</> : null}
      </p>
      {query && elsewhere.length > 0 ? (
        <>
          <p className="mt-2 text-sm">
            {elsewhere.length === 1 ? "There is a match in" : "There are matches in"}{" "}
            {elsewhere.map((t, i) => (
              <span key={t}>
                {i > 0 ? (elsewhere.length === 2 ? " and " : ", ") : ""}
                <button
                  onClick={() => onSwitch(t)}
                  className="font-bold text-[#0D9488] hover:underline"
                >
                  {TAB_LABELS[t]}
                </button>
              </span>
            ))}
            .
          </p>
        </>
      ) : (
        <p className="mt-2 text-sm">Try a different search term, or clear the search field.</p>
      )}
    </div>
  );
}

export default function NewsPage() {
  const [tab, setTab] = useState<Tab>("latest");
  // Driven by the URL so header search results are shareable and survive reload.
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const setQ = (value: string) => {
    setSearchParams(value ? { q: value } : {}, { replace: true });
  };
  const { data } = useEntity("news", FALLBACK_NEWS as any);
  const all = useMemo(() => {
    const list = (data as any[]).filter((n: any) => n.is_published !== 0);
    return list
      .map((n: any, i: number) => ({ ...n, id: n.id ?? i + 1 }))
      .sort((a: any, b: any) => new Date(b.news_date).getTime() - new Date(a.news_date).getTime());
  }, [data]);

  const latest = all.filter((n: any) => !n.is_previous);
  const previous = all.filter((n: any) => n.is_previous);
  const filteredLatest = latest.filter(
    (n: any) => !q || `${n.title} ${n.excerpt} ${n.tag}`.toLowerCase().includes(q.toLowerCase()),
  );
  const filteredPrevious = previous.filter(
    (n: any) => !q || `${n.title} ${n.excerpt}`.toLowerCase().includes(q.toLowerCase()),
  );
  const filteredExternal = EXTERNAL_NEWS.filter(
    (n) => !q || `${n.title} ${n.excerpt}`.toLowerCase().includes(q.toLowerCase()),
  );
  const matchCounts = {
    latest: filteredLatest.length,
    previous: filteredPrevious.length,
    external: filteredExternal.length,
  };

  return (
    <div
      className="min-h-screen bg-[#F8F6F1]"
      style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif" }}
    >
      <SiteHeader />

      <section className="relative h-[320px] sm:h-[380px] overflow-hidden bg-[#0B2545]">
        <img decoding="async"
          src="/assets/slider/mbp-img2.jpg"
          alt="News"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B2545]/90 via-[#0B2545]/70 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 h-full flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-[#C9A84C] text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
            Latest Updates • Milne Bay Education
          </div>
          <h1
            className="text-4xl sm:text-5xl font-bold text-white leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            News & <span className="text-[#14B8A6]">Announcements</span>
          </h1>
          <p className="text-blue-100 mt-3 max-w-2xl">
            All news from the Division: latest, previous, and trusted external education news from
            PNG partners.
          </p>
          <div className="mt-6 flex gap-3">
            <div className="flex-1 max-w-md relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">⌕</span>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search news..."
                className="w-full pl-9 pr-4 py-3 rounded-full bg-white text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#0D9488]/30"
              />
            </div>
            <Link
              to="/contact"
              className="hidden sm:inline-flex bg-[#C9A84C] text-[#0B2545] font-bold px-6 py-3 rounded-full text-sm"
            >
              Contact Division
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-2 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm w-fit">
          {[
            { k: "latest", label: "Latest News", count: filteredLatest.length },
            { k: "previous", label: "Previous News", count: previous.length },
            {
              k: "external",
              label: "External Education News",
              count: EXTERNAL_NEWS.length,
            },
          ].map((t: any) => (
            <button
              key={t.k}
              onClick={() => setTab(t.k)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-colors ${
                tab === t.k ? "bg-[#0B2545] text-white shadow" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {t.label}{" "}
              <span
                className={`ml-1 text-xs px-2 py-0.5 rounded-full ${
                  tab === t.k ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
                }`}
              >
                {t.count}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-16">
        {tab === "latest" && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLatest.length === 0 && (
              <NoResults query={q} tab="latest" counts={matchCounts} onSwitch={setTab} />
            )}
            {filteredLatest.map((n: any) => (
              <Link
                key={n.id}
                to={`/news/${n.id}`}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all group"
              >
                <div className="relative h-48 overflow-hidden bg-[#0B2545]">
                  <img loading="lazy" decoding="async"
                    src={n.img}
                    alt={n.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <span
                    className={`${n.tag_color || "bg-[#0D9488]"} absolute top-3 left-3 text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow`}
                  >
                    {n.tag}
                  </span>
                </div>
                <div className="p-5">
                  <div className="text-xs text-gray-400">{n.news_date} • 2 min read</div>
                  <h3
                    className="text-base font-bold text-[#0B2545] mt-1 line-clamp-2 group-hover:text-[#0D9488]"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {n.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-3">{n.excerpt}</p>
                  <span className="inline-flex items-center gap-1.5 mt-4 text-sm font-bold text-[#C9A84C] group-hover:text-[#0B2545]">
                    Read More <span>→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {tab === "previous" && (
          <div className="space-y-4">
            {filteredPrevious.length === 0 && (
              <NoResults query={q} tab="previous" counts={matchCounts} onSwitch={setTab} />
            )}
            {filteredPrevious.map((n: any) => (
              <Link
                key={n.id}
                to={`/news/${n.id}`}
                className="flex flex-col sm:flex-row gap-4 bg-white rounded-2xl p-4 border border-gray-100 hover:shadow-md hover:border-[#0D9488]/20 transition-all group"
              >
                <img loading="lazy" decoding="async"
                  src={n.img}
                  alt={n.title}
                  className="w-full sm:w-40 h-28 object-cover rounded-xl shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`${n.tag_color} text-white text-xs font-bold px-2.5 py-1 rounded-full`}
                    >
                      {n.tag}
                    </span>
                    <span className="text-xs text-gray-400">{n.news_date}</span>
                  </div>
                  <h3
                    className="font-bold text-[#0B2545] mt-1 group-hover:text-[#0D9488]"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {n.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mt-1">{n.excerpt}</p>
                  <span className="text-xs font-bold text-[#0D9488] mt-2 inline-flex">
                    Read More →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {tab === "external" && (
          <div className="grid sm:grid-cols-2 gap-6">
            {filteredExternal.length === 0 && (
              <NoResults query={q} tab="external" counts={matchCounts} onSwitch={setTab} />
            )}
            {filteredExternal.map((n: any) => (
              <a
                key={n.id}
                href={n.href}
                target="_blank"
                rel="noreferrer"
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img loading="lazy" decoding="async"
                    src={n.img}
                    alt={n.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <span
                    className={`${n.tag_color} absolute top-3 left-3 text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow`}
                  >
                    {n.tag} • External
                  </span>
                  <span className="absolute bottom-3 right-3 bg-white text-[#0B2545] text-xs font-bold px-3 py-1.5 rounded-full shadow">
                    ↗ Open
                  </span>
                </div>
                <div className="p-5">
                  <div className="text-xs text-gray-400">{n.news_date} • External</div>
                  <h3
                    className="text-base font-bold text-[#0B2545] mt-1 line-clamp-2 group-hover:text-[#0D9488]"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {n.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-3">{n.excerpt}</p>
                  <span className="inline-flex items-center gap-1.5 mt-4 text-sm font-bold text-[#0D9488]">
                    Visit Source <span>↗</span>
                  </span>
                </div>
              </a>
            ))}
            <div className="sm:col-span-2 bg-amber-50 border border-amber-200 rounded-2xl p-5 text-sm text-gray-700">
              <span className="font-bold text-[#0B2545]">About external news:</span> Curated from
              NDoE, TSC, UNICEF PNG and World Bank. Opens in new tab. For official Milne Bay news,
              use Latest/Previous tabs.
            </div>
          </div>
        )}
      </section>

      <SiteFooter />
    </div>
  );
}
