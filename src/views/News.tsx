"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { useEntity } from "@/hooks/useDynamic";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PageHero, { NAVY_HERO } from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";

const FALLBACK_NEWS = [
  {
    id: 1,
    tag: "Announcement",
    tag_color: "bg-[#0D9488]",
    news_date: "September 18, 2026",
    title: "Grade 8 and Grade 10 Examination Timetable Released",
    excerpt:
      "The Division of Education has officially released the 2026 examination timetable for all Grade 8 and Grade 10 students across Milne Bay Province.",
    img: "https://images.unsplash.com/photo-1627423896085-e3e694d88e40?w=600&h=380&fit=crop&auto=format",
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
    img: "https://images.unsplash.com/photo-1632215861513-130b66fe97f4?w=600&h=380&fit=crop&auto=format",
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
    img: "https://images.unsplash.com/photo-1632932693914-89b90ae3d16d?w=600&h=380&fit=crop&auto=format",
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
    img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=380&fit=crop&auto=format",
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
    img: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&h=380&fit=crop&auto=format",
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
    img: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&h=380&fit=crop&auto=format",
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
    img: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&h=380&fit=crop&auto=format",
    href: "https://worldbank.org",
    external: true,
  },
];

export default function NewsPage() {
  const [tab, setTab] = useState<"latest" | "previous" | "external">("latest");
  const [q, setQ] = useState("");
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

  return (
    <div
      className="min-h-screen bg-[#F8F6F1]"
      style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif" }}
    >
      <SiteHeader />

      <main id="main-content">
        <PageHero
          theme={NAVY_HERO}
          image="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1600&h=600&fit=crop&auto=format"
          imageAlt=""
          imageOpacity={30}
          imagePosition="object-[50%_35%]"
          eyebrow="Latest Updates • Milne Bay Education"
          title={
            <>
              News &amp; <span className="text-[#14B8A6]">Announcements</span>
            </>
          }
          lead="All news from the Division: latest, previous, and trusted external education news from PNG partners."
          actions={[{ label: "Contact Division", to: "/contact", variant: "primary" }]}
        >
          <div className="mt-6 flex-1 max-w-md relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true">
              <Icon name="search" size={20} />
            </span>
            <input
              id="news-search"
              type="search"
              aria-label="Search news"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search news..."
              className="w-full pl-9 pr-4 py-3 rounded-full bg-white text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#0D9488]/30"
            />
          </div>
        </PageHero>

        <section className="max-w-7xl mx-auto px-4 py-6">
          <Reveal className="flex flex-wrap gap-2 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm w-fit">
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
          </Reveal>
        </section>

        <section className="max-w-7xl mx-auto px-4 pb-16">
          {tab === "latest" && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLatest.length === 0 && (
                <div className="col-span-full text-center py-16 bg-white rounded-2xl border border-gray-100 text-gray-500">
                  No latest news found.
                </div>
              )}
              {filteredLatest.map((n: any) => (
                <Link
                  key={n.id}
                  href={`/news/${n.id}`}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all group"
                >
                  <div className="relative h-48 overflow-hidden bg-[#0B2545]">
                    <img
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
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 text-gray-500">
                  No previous news. Check Latest or External.
                </div>
              )}
              {filteredPrevious.map((n: any) => (
                <Link
                  key={n.id}
                  href={`/news/${n.id}`}
                  className="flex flex-col sm:flex-row gap-4 bg-white rounded-2xl p-4 border border-gray-100 hover:shadow-md hover:border-[#0D9488]/20 transition-all group"
                >
                  <img
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
              {filteredExternal.map((n: any) => (
                <a
                  key={n.id}
                  href={n.href}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
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
      </main>

      <SiteFooter />
    </div>
  );
}
