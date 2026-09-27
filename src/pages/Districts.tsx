import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useEntity } from "@/hooks/useDynamic";
import { DISTRICT_FALLBACK } from "@/data/fallbacks";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function DistrictsPage() {
  const { data } = useEntity("districts", DISTRICT_FALLBACK as any);
  const [q, setQ] = useState("");
  const [type, setType] = useState("All");

  const districts = useMemo(
    () =>
      (data as any[])
        .slice()
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
    [data],
  );

  const types = useMemo(() => {
    const set = new Set<string>();
    districts.forEach((d) => d.type && set.add(d.type));
    return ["All", ...Array.from(set).sort()];
  }, [districts]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return districts.filter(
      (d) =>
        (type === "All" || d.type === type) &&
        (!term ||
          `${d.name} ${d.type} ${d.students}`.toLowerCase().includes(term)),
    );
  }, [districts, q, type]);

  const totalSchools = districts.reduce((s, d) => s + (Number(d.schools) || 0), 0);

  return (
    <div
      className="min-h-screen bg-[#F8F6F1]"
      style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif" }}
    >
      <SiteHeader />

      <section className="relative overflow-hidden bg-[#0B2545]">
        <img
          src="/assets/education_programs/map/milne_bay_map.jpg"
          alt=""
          aria-hidden="true"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07192E]/92 via-[#0B2545]/80 to-[#0B2545]/50" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-14 sm:py-20">
          <nav aria-label="Breadcrumb" className="mb-5">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#C9A84C] hover:text-white transition-colors"
            >
              ← Home
            </Link>
          </nav>
          <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-[#E2C47A] text-[11px] font-bold uppercase tracking-[0.14em] px-3 py-1.5 rounded-full mb-4">
            Coverage
          </span>
          <h1
            className="text-4xl sm:text-5xl font-bold text-white leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            All Districts
          </h1>
          <p className="text-blue-100 mt-3 max-w-2xl">
            {districts.length} districts across Milne Bay Province, from mainland highlands to
            remote atolls. Choose a district to see its schools.
          </p>

          <dl className="mt-8 grid grid-cols-3 gap-3 max-w-md">
            {[
              { k: "Districts", v: districts.length },
              { k: "Schools", v: totalSchools },
              { k: "Showing", v: filtered.length },
            ].map((s) => (
              <div key={s.k} className="rounded-xl bg-white/10 border border-white/15 px-4 py-3">
                <dt className="text-[10px] font-bold uppercase tracking-widest text-teal-200/80">
                  {s.k}
                </dt>
                <dd className="text-xl font-bold text-white mt-0.5">{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">⌕</span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search districts…"
              aria-label="Search districts"
              className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl bg-[#F8F6F1] border border-gray-200 outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20"
            />
          </div>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            aria-label="Filter by district type"
            className="px-4 py-2.5 text-sm rounded-xl bg-[#F8F6F1] border border-gray-200 outline-none focus:border-[#0D9488]"
          >
            {types.map((t) => (
              <option key={t} value={t}>
                {t === "All" ? "All types" : t}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-10">
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <p className="text-[#0B2545] font-bold">No districts match</p>
            <p className="text-gray-500 text-sm mt-2">Try a different search or clear the filter.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((d) => (
              <Link
                key={d.name}
                to={`/districts/${d.id ?? d.name}`}
                className="group rounded-2xl border border-gray-100 bg-white overflow-hidden hover:shadow-xl hover:-translate-y-1 hover:border-[#0D9488]/30 transition-all"
              >
                <div className="relative h-24 overflow-hidden bg-[#0B2545]">
                  {d.img ? (
                    <img
                      src={d.img}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 opacity-25">
                      <img
                        src="/assets/education_programs/map/milne_bay_map.jpg"
                        alt=""
                        aria-hidden="true"
                        decoding="async"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07192E]/75 to-transparent" />
                  <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider bg-white/90 text-[#0B2545] px-2 py-1 rounded-full">
                    {d.type}
                  </span>
                </div>
                <div className="p-4">
                  <h2
                    className="font-bold text-[#0B2545] group-hover:text-[#0D9488] transition-colors leading-tight"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {d.name}
                  </h2>
                  {d.capital && (
                    <div className="text-xs text-gray-500 mt-1">
                      District capital:{" "}
                      <span className="font-semibold text-[#0B2545]">{d.capital}</span>
                    </div>
                  )}
                  <div className="text-sm text-gray-500 mt-1.5">
                    {d.schools} schools{d.students ? ` • ${d.students} students` : ""}
                  </div>
                  <div className="mt-3 text-xs font-bold text-[#0B2545] group-hover:text-[#0D9488] flex items-center gap-1">
                    View schools
                    <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-10 rounded-2xl bg-[#0B2545] text-white p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="font-bold">Need help locating a school?</div>
            <div className="text-blue-200 text-sm">
              Search by district, level or name with contact details and enrolment figures.
            </div>
          </div>
          <Link
            to="/contact"
            className="bg-[#C9A84C] text-[#0B2545] font-bold px-5 py-2.5 rounded-full hover:bg-[#d4b45e] transition-colors text-sm shrink-0"
          >
            Contact the Division
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
