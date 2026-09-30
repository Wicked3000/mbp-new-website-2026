"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useEntity } from "@/hooks/useDynamic";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PageHero, { NAVY_HERO } from "@/components/PageHero";
import { DISTRICT_FALLBACK, SCHOOL_FALLBACK, hasCoords, mapsUrl } from "@/data/fallbacks";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";

/**
 * `id` arrives as a prop from app/(site)/districts/[id]/page.tsx.
 *
 * It was `useParams()` before. App Router has no params hook: the dynamic
 * segment arrives as an async `params` prop on the page, and the page passes it
 * down. That indirection is the price of file-system routing, and it is worth
 * paying deliberately rather than reaching for a client-side hook - a Server
 * Component could not call `useParams` at all.
 */
export default function DistrictDetailPage({ id }: { id: string }) {
  const { data: districtData } = useEntity("districts", DISTRICT_FALLBACK as any);
  const { data: schoolData } = useEntity("schools", SCHOOL_FALLBACK as any);
  const [level, setLevel] = useState("All");
  const [q, setQ] = useState("");

  const district = useMemo(() => {
    const list = districtData as any[];
    return (
      list.find((d) => String(d.id) === String(id)) ??
      list.find((d) => d.name?.toLowerCase() === String(id ?? "").toLowerCase())
    );
  }, [districtData, id]);

  const schools = useMemo(() => {
    const list = schoolData as any[];
    // The foreign key wins whenever it is set, and the name is only consulted
    // for rows that predate it. Matching on both at once would list a school
    // under two districts: the admin edits the district by name, so a school
    // moved to another district keeps its old district_id and would satisfy
    // the FK for the old district and the name for the new one.
    const mine = list.filter((s) =>
      s.district_id != null && s.district_id !== ""
        ? String(s.district_id) === String(district?.id)
        : (s.district || "").toLowerCase() === (district?.name || "").toLowerCase(),
    );
    const term = q.trim().toLowerCase();
    return mine
      .filter(
        (s) =>
          (level === "All" || (s.level || "") === level) &&
          (!term ||
            `${s.name} ${s.type} ${s.level} ${s.head_teacher} ${s.location}`
              .toLowerCase()
              .includes(term)),
      )
      .sort((a, b) => String(a.name).localeCompare(String(b.name)));
  }, [schoolData, district, level, q]);

  const levels = useMemo(() => {
    const set = new Set<string>();
    (schoolData as any[]).forEach((s) => s.level && set.add(s.level));
    return ["All", ...Array.from(set).sort()];
  }, [schoolData]);

  if (!district) {
    return (
      <div className="min-h-screen bg-[#F8F6F1]" style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif" }}>
        <SiteHeader />
        <section className="max-w-3xl mx-auto px-4 py-24 text-center">
          <h1
            className="text-3xl sm:text-4xl font-bold text-[#0B2545] mb-3"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            District not found
          </h1>
          <p className="text-gray-600 mb-8">
            We could not find that district. It may have been renamed or removed.
          </p>
          <Link
            href="/#coverage"
            className="inline-flex bg-[#0B2545] text-white font-bold px-6 py-3 rounded-full"
          >
            Back to Coverage
          </Link>
        </section>
        <SiteFooter />
      </div>
    );
  }

  const listed = schools.length;
  const totalEnrolled = schools.reduce((sum, s) => sum + (Number(s.enrolled) || 0), 0);

  return (
    <div className="min-h-screen bg-[#F8F6F1]" style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif" }}>
      <SiteHeader />

      <PageHero
        theme={NAVY_HERO}
        image={district.img || "/assets/education_programs/map/milne_bay_map.jpg"}
        imageAlt={district.img ? `${district.name} district` : ""}
        imageOpacity={district.img ? 35 : 20}
        eyebrow={`${district.type} District`}
        title={district.name}
        lead={`${district.schools} schools${district.students ? ` • ${district.students} students` : ""}${listed > 0 ? ` • ${listed} listed below` : ""}`}
      >
          <dl className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl">
            {[
              { k: "District capital", v: district.capital || "—" },
              { k: "Schools", v: district.schools },
              { k: "Students", v: district.students || "—" },
              { k: "Listed here", v: listed },
            ].map((s) => (
              <div key={s.k} className="rounded-xl bg-white/10 border border-white/15 px-4 py-3">
                <dt className="text-[10px] font-bold uppercase tracking-widest text-teal-200/80">
                  {s.k}
                </dt>
                <dd className="text-xl font-bold text-white mt-0.5">{s.v}</dd>
              </div>
            ))}
          </dl>
      </PageHero>

      {/* Filters */}
      <section className="bg-white border-b border-gray-100">
        <Reveal className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><Icon name="search" size={20} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" /></span>
            <input
              id="district-detail-search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search schools, head teacher, township…"
              aria-label="Search schools in this district"
              className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl bg-[#F8F6F1] border border-gray-200 outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20"
            />
          </div>
          <select
            id="district-detail-filter"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            aria-label="Filter by level"
            className="px-4 py-2.5 text-sm rounded-xl bg-[#F8F6F1] border border-gray-200 outline-none focus:border-[#0D9488]"
          >
            {levels.map((l) => (
              <option key={l} value={l}>
                {l === "All" ? "All levels" : l}
              </option>
            ))}
          </select>
        </Reveal>
      </section>

      {/* School list */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        {listed === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <p className="text-[#0B2545] font-bold">No schools to show</p>
            <p className="text-gray-500 text-sm mt-2 max-w-md mx-auto">
              {q || level !== "All"
                ? "No schools match your search. Try clearing the filters."
                : "Schools for this district have not been added yet. They will appear here once the Division publishes them."}
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {schools.map((s) => {
              const enrolled = Number(s.enrolled) || 0;
              const capacity = Number(s.capacity) || 0;
              const male = Number(s.male) || 0;
              const female = Number(s.female) || 0;
              const teachers = Number(s.teachers) || 0;
              const staff = Number(s.staff) || 0;
              // Only render the breakdown once something has been entered, so
              // untouched schools do not show a wall of zeroes.
              const hasFigures = male + female + teachers + staff > 0;
              const coords = hasCoords(s);
              const pct = capacity ? Math.min(100, Math.round((enrolled / capacity) * 100)) : null;
              return (
                <article
                  key={s.id}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all"
                >
                  {s.img ? (
                    <img
                      src={s.img}
                      alt={s.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-36 object-cover"
                    />
                  ) : (
                    <div className="w-full h-36 bg-[#0B2545] grid place-items-center">
                      {/* White on the navy panel. The icon had inherited the
                          panel's own background classes, which put a dark
                          glyph on a dark field. */}
                      <Icon name="school" size={32} className="text-white/40" />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {s.type && (
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-[#0B2545] text-white px-2 py-1 rounded-full">
                          {s.type}
                        </span>
                      )}
                      {s.level && (
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-[#F8F6F1] text-gray-600 border border-gray-200 px-2 py-1 rounded-full">
                          {s.level}
                        </span>
                      )}
                    </div>
                    <h2
                      className="text-base font-bold text-[#0B2545] leading-snug"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {s.name}
                    </h2>

                    {/* Student roll and staffing breakdown. Only shown once the
                        Division has entered the figures. */}
                    {hasFigures && (
                      <dl className="mt-4 grid grid-cols-2 gap-2">
                        {[
                          { k: "Total students", v: enrolled },
                          { k: "Male", v: male },
                          { k: "Female", v: female },
                          { k: "Teachers", v: teachers },
                          { k: "Non-teaching staff", v: staff },
                        ].map((f) => (
                          <div
                            key={f.k}
                            className="rounded-lg bg-[#F8F6F1] border border-gray-100 px-3 py-2"
                          >
                            <dt className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                              {f.k}
                            </dt>
                            <dd className="text-base font-bold text-[#0B2545]">
                              {f.v || "—"}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    )}

                    {/* Flag a roll-up that does not reconcile, so a data-entry
                        slip is visible rather than silently wrong. */}
                    {hasFigures && male + female > 0 && male + female !== enrolled && (
                      <p className="mt-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                        Male and female total {male + female}, which does not match the roll of{" "}
                        {enrolled}. Please check the figures.
                      </p>
                    )}

                    {pct !== null && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>
                            {enrolled} / {capacity} places filled
                          </span>
                          <span className="font-bold text-[#0B2545]">{pct}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-[#0D9488]"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <dl className="mt-4 space-y-1.5 text-sm">
                      {s.head_teacher && (
                        <div className="flex gap-2">
                          <dt className="text-gray-400 w-24 shrink-0">Head teacher</dt>
                          <dd className="text-gray-700">{s.head_teacher}</dd>
                        </div>
                      )}
                      {s.location && (
                        <div className="flex gap-2">
                          <dt className="text-gray-400 w-24 shrink-0">Location</dt>
                          <dd className="text-gray-700">{s.location}</dd>
                        </div>
                      )}
                      {s.contact && (
                        <div className="flex gap-2">
                          <dt className="text-gray-400 w-24 shrink-0">Contact</dt>
                          <dd className="text-gray-700 break-words">{s.contact}</dd>
                        </div>
                      )}
                    </dl>

                    {/* Google Maps link, built from the coordinates entered in
                        /admin/schools. */}
                    {coords && (
                      <a
                        href={mapsUrl(s)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#0D9488] hover:text-[#0B2545] transition-colors"
                      >
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        Open in Google Maps
                        <span className="text-xs">({s.lat}, {s.lng})</span>
                      </a>
                    )}

                    {s.notes && (
                      <p className="mt-3 text-sm text-gray-600 border-t border-gray-100 pt-3">
                        {s.notes}
                      </p>
                    )}

                    {/* Through to this school's own page, which carries the full
                        breakdown including teachers, staff and the map link. */}
                    <Link
                      href={`/schools/${s.id}`}
                      className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-[#0D9488] hover:text-[#0B2545] transition-colors"
                    >
                      School details
                      <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <div className="mt-10 rounded-2xl bg-[#0B2545] text-white p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="font-bold">Need information about a school?</div>
            <div className="text-blue-200 text-sm">
              Contact the District Education Office or the Provincial helpdesk on +675 641 1234.
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <Link
              href="/#coverage"
              className="bg-white/10 text-white font-bold px-5 py-2.5 rounded-full hover:bg-white hover:text-[#0B2545] transition-colors text-sm"
            >
              All districts
            </Link>
            <Link
              href="/contact"
              className="bg-[#C9A84C] text-[#0B2545] font-bold px-5 py-2.5 rounded-full hover:bg-[#d4b45e] transition-colors text-sm"
            >
              Contact Division
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
