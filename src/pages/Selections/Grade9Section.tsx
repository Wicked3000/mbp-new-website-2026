import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { api } from "@/lib/api";
import {
  FALLBACK_GRADE9_DATA,
  normalizeGrade9Rows,
  normalizeGrade11Rows,
  recordTotal,
  type Grade9Row,
  type Grade11Row,
} from "./selectionData";

export function Grade9Section() {
  const [rows, setRows] = useState<Grade9Row[]>([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [districtFilter, setDistrictFilter] = useState("all");

  useEffect(() => {
    let active = true;

    api
      .list("selections_grade9")
      .then((data) => {
        if (active) setRows(normalizeGrade9Rows(data));
      })
      .catch(() => {
        if (active) setRows(FALLBACK_GRADE9_DATA);
      });

    return () => {
      active = false;
    };
  }, []);

  const districts = [...new Set(rows.map((d) => d.district))].sort();

  const filtered = [...rows]
    .sort((a, b) => a.school.localeCompare(b.school))
    .filter((d) => {
      const matchesSearch =
        d.school.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.district.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDistrict = districtFilter === "all" || d.district === districtFilter;

      return matchesSearch && matchesDistrict;
    });

  return (
    <section id="grade9" className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <span className="text-blue-500 text-xs font-bold uppercase tracking-widest">
            Grade 9 Selection 2026
          </span>
          <h2
            className="text-4xl font-bold text-[#0B2545] mt-2 mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Grade 8 → Grade 9 Placement
          </h2>
          <p className="text-gray-500">
            Students who sat the 2025 Grade 8 National Examination and selected Milne Bay schools.
            Placement based on exam scores, school preferences, and available capacity.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="search"
            aria-label="Search school or district"
            placeholder="Search school or district..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            aria-label="Filter by district"
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="all">All Districts</option>
            {districts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#0B2545] text-white text-left">
                <th className="px-4 py-3 font-semibold">School</th>
                <th className="px-4 py-3 font-semibold">District</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Streams Offered</th>
                <th className="px-4 py-3 font-semibold text-center">Capacity</th>
                <th className="px-4 py-3 font-semibold text-center">Placed</th>
                <th className="px-4 py-3 font-semibold text-center">Vacant</th>
                <th className="px-4 py-3 font-semibold text-center">Cutoff</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-gray-500">
                    No schools match your search.
                  </td>
                </tr>
              )}
              {filtered.map((s, i) => (
                <tr
                  key={s.id ?? `${s.school}-${i}`}
                  className={`border-b ${i % 2 === 0 ? "bg-white" : "bg-[#F8F6F1]"}`}
                >
                  <td className="px-4 py-3 font-medium text-[#0B2545]">{s.school}</td>
                  <td className="px-4 py-3 text-gray-700">{s.district}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        s.type === "National High"
                          ? "bg-blue-100 text-blue-700"
                          : s.type === "Permitted (Church)"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {s.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700 max-w-xs truncate">{s.stream}</td>
                  <td className="px-4 py-3 text-center text-gray-700">{s.capacity}</td>
                  <td className="px-4 py-3 text-center text-green-700 font-medium">{s.placed}</td>
                  <td className="px-4 py-3 text-center text-gray-500">{s.capacity - s.placed}</td>
                  <td className="px-4 py-3 text-center font-semibold text-blue-600">{s.cutoff}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
          <span>
            Showing {filtered.length} of {rows.length} schools
          </span>
          <div className="flex gap-2">
            <Link to="/downloads" className="text-[#C9A84C] hover:text-[#B8953E] font-medium">
              Official Downloads →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
