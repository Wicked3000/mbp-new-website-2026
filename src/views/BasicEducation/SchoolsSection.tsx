"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useEntity } from "@/hooks/useDynamic";
import Reveal from "@/components/Reveal";

// Inlined from the old single-file page so this section stands alone.
const DISTRICTS_FALLBACK = [
  { name: "Alotau", capital: "Alotau / Rabaraba", schools: 42, type: "Urban", students: "6,800+", sort_order: 1 },
  { name: "Samarai-Murua", capital: "Misima", schools: 22, type: "Island", students: "1,900+", sort_order: 2 },
  { name: "Esa'ala", capital: "Esa'ala", schools: 15, type: "Island", students: "1,600+", sort_order: 3 },
  { name: "Kiriwina-Goodenough", capital: "Losuia", schools: 18, type: "Island", students: "2,100+", sort_order: 4 },
];

export function SchoolsSection() {
  // Admin-managed via /admin/districts, so additions and edits appear here
  // rather than needing a code change.
  const { data } = useEntity("districts", DISTRICTS_FALLBACK as any);

  const [district, setDistrict] = useState("");
  const [query, setQuery] = useState("");

  const districts = useMemo(
    () =>
      (data as any[])
        .slice()
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
    [data],
  );

  const normalizedQuery = query.trim().toLowerCase();

  const filteredDistricts = districts.filter(
    (d) =>
      (district === "" || d.name === district) &&
      `${d.name} ${d.type}`.toLowerCase().includes(normalizedQuery),
  );

  return (
    <section id="schools" className="bg-[#F8F6F1] py-16 px-4">
      <Reveal className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <span className="text-teal-500 text-xs font-bold uppercase tracking-widest">
              School Network
            </span>
            <h2
              className="text-4xl font-bold text-[#0B2545] mt-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Schools Across 4 Districts
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              id="basiceducation-schools-filter"
              value={district}
              onChange={(event) => setDistrict(event.target.value)}
              aria-label="Filter by district"
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-teal-500"
            >
              <option value="">All Districts</option>
              {districts.map((d) => (
                <option key={d.name} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
            <input
              id="basiceducation-schools-search"
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search schools..."
              aria-label="Search schools"
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-teal-500 min-w-[200px]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#0B2545] text-white text-left">
                <th className="px-4 py-3 font-semibold">District</th>
                <th className="px-4 py-3 font-semibold">Schools</th>
                <th className="px-4 py-3 font-semibold">Students</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredDistricts.map((d) => (
                <tr
                  key={d.name}
                  className="border-b border-gray-100 hover:bg-white transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-[#0B2545]">{d.name}</td>
                  <td className="px-4 py-3 text-gray-700">{d.schools}</td>
                  <td className="px-4 py-3 text-gray-700">{d.students}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-50 text-teal-700">
                      {d.type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {/* Now navigates to that district's school list instead of
                        re-filtering the district table it sits in. */}
                    <Link
                      href={`/districts/${d.id ?? d.name}`}
                      className="text-teal-600 hover:text-teal-800 font-medium text-sm"
                    >
                      View Schools →
                    </Link>
                  </td>
                </tr>
              ))}
              {filteredDistricts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-gray-500">
                    No schools match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => {
              setDistrict("");

              setQuery("");
            }}
            className="inline-flex items-center gap-2 border border-teal-500 text-teal-600 hover:bg-teal-50 font-semibold px-6 py-3 rounded transition-colors"
          >
            Full School Directory →
          </button>
        </div>
      </Reveal>
    </section>
  );
}
