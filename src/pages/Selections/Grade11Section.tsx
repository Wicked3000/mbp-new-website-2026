import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { api } from "@/lib/api";
import {
  FALLBACK_GRADE11_DATA,
  normalizeGrade11Rows,
  recordTotal,
  type Grade11Row,
} from "./selectionData";
import Reveal from "@/components/Reveal";

export function Grade11Section() {
  const [rows, setRows] = useState<Grade11Row[]>([]);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let active = true;

    api
      .list("selections_grade11")
      .then((data) => {
        if (active) setRows(normalizeGrade11Rows(data));
      })
      .catch(() => {
        if (active) setRows(normalizeGrade11Rows(FALLBACK_GRADE11_DATA));
      });

    return () => {
      active = false;
    };
  }, []);

  const filtered = [...rows]
    .sort((a, b) => a.school.localeCompare(b.school))
    .filter((d) => {
      const matchesSearch =
        d.school.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.district.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    });

  return (
    <section id="grade11" className="py-16 px-4 bg-[#F8F6F1]">
      <Reveal className="max-w-7xl mx-auto">
        <div className="mb-8">
          <span className="text-amber-500 text-xs font-bold uppercase tracking-widest">
            Grade 11 Selection 2026
          </span>
          <h2
            className="text-4xl font-bold text-[#0B2545] mt-2 mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Grade 10 → Grade 11 Placement
          </h2>
          <p className="text-gray-500">
            Students who sat the 2025 Grade 10 National Examination. Placement is published by
            school; stream allocation is assigned later.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="search"
            aria-label="Search school or district"
            placeholder="Search school or district..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="space-y-6">
          {filtered.length === 0 && (
            <div className="rounded-xl border border-gray-100 bg-white p-10 text-center text-gray-500">
              No schools match your search.
            </div>
          )}
          {filtered.map((s) => (
            <div
              key={s.id ?? s.school}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="bg-[#163663] text-white p-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h3
                      className="text-xl font-bold"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {s.school}
                    </h3>
                    <div className="flex items-center gap-3 mt-1 text-sm text-amber-200">
                      <span>{s.district}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          s.type === "National High"
                            ? "bg-blue-500"
                            : s.type === "Permitted (Church)"
                              ? "bg-purple-500"
                              : "bg-gray-500"
                        }`}
                      >
                        {s.type}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <div className="grid sm:grid-cols-3 gap-4">
                  {[
                    { label: "Capacity", value: s.capacity, color: "text-amber-700" },
                    { label: "Placed", value: s.placed, color: "text-green-700" },
                    { label: "Cutoff", value: s.cutoff, color: "text-blue-600" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="bg-amber-50 rounded-lg p-4 border border-amber-100"
                    >
                      <div className="text-xs font-semibold uppercase tracking-wider text-amber-700 mb-2">
                        {stat.label}
                      </div>
                      <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
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
      </Reveal>
    </section>
  );
}
