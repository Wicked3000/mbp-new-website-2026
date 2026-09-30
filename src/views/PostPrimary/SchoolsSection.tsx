"use client";

import { useState } from "react";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";

export function SchoolsSection() {
  const SCHOOLS = [
    {
      name: "Cameron Secondary School",
      district: "Alotau",
      type: "National High",
      streams: "Science, Humanities, Business",
      boarding: true,
      students: "1,200+",
    },
    {
      name: "Alotau Secondary School",
      district: "Alotau",
      type: "Provincial High",
      streams: "Science, Humanities, Business, Technical",
      boarding: true,
      students: "980+",
    },
    {
      name: "Bwesiruru Secondary",
      district: "Alotau",
      type: "Provincial High",
      streams: "Science, Humanities, Business",
      boarding: false,
      students: "650+",
    },
    {
      name: "Hagita Secondary School",
      district: "Alotau",
      type: "Provincial High",
      streams: "Humanities, Business, Technical",
      boarding: false,
      students: "540+",
    },
    {
      name: "Kiriwina Secondary School",
      district: "Kiriwina-Goodenough",
      type: "Provincial High",
      streams: "Humanities, Business",
      boarding: true,
      students: "420+",
    },
    {
      name: "Losuia Secondary School",
      district: "Losuia",
      type: "Provincial High",
      streams: "Science, Humanities",
      boarding: true,
      students: "380+",
    },
    {
      name: "Esa'ala Secondary School",
      district: "Esa'ala",
      type: "Provincial High",
      streams: "Humanities, Business",
      boarding: true,
      students: "350+",
    },
    {
      name: "Rabaruana Secondary",
      district: "Rabaruana",
      type: "Provincial High",
      streams: "Science, Humanities",
      boarding: false,
      students: "480+",
    },
    {
      name: "Samarai Secondary School",
      district: "Samarai-Murua",
      type: "Provincial High",
      streams: "Humanities, Business",
      boarding: true,
      students: "310+",
    },
    {
      name: "Wanigela Secondary",
      district: "Wanigela",
      type: "Provincial High",
      streams: "Humanities",
      boarding: false,
      students: "280+",
    },
    {
      name: "Agaivaro Secondary",
      district: "Agaivaro",
      type: "Provincial High",
      streams: "Humanities, Business",
      boarding: false,
      students: "340+",
    },
    {
      name: "Dobu Secondary School",
      district: "Dobu",
      type: "Provincial High",
      streams: "Humanities",
      boarding: true,
      students: "290+",
    },
    {
      name: "Duau Secondary School",
      district: "Duau",
      type: "Provincial High",
      streams: "Humanities, Business",
      boarding: false,
      students: "270+",
    },
    {
      name: "Guasopa Secondary",
      district: "Guasopa",
      type: "Provincial High",
      streams: "Humanities",
      boarding: true,
      students: "240+",
    },
    {
      name: "Huhu Secondary School",
      district: "Huhu",
      type: "Provincial High",
      streams: "Science, Humanities",
      boarding: false,
      students: "410+",
    },
    {
      name: "Kokoda Secondary",
      district: "Kokoda",
      type: "Provincial High",
      streams: "Humanities",
      boarding: false,
      students: "230+",
    },
    {
      name: "Maramatana Secondary",
      district: "Maramatana",
      type: "Provincial High",
      streams: "Humanities",
      boarding: false,
      students: "210+",
    },
    {
      name: "Misi Secondary School",
      district: "Misi",
      type: "Provincial High",
      streams: "Humanities, Business",
      boarding: false,
      students: "260+",
    },
    {
      name: "Sibonai Secondary",
      district: "Sibonai",
      type: "Provincial High",
      streams: "Humanities",
      boarding: false,
      students: "190+",
    },
    {
      name: "West Ferguson Sec",
      district: "West Ferguson",
      type: "Provincial High",
      streams: "Humanities",
      boarding: false,
      students: "220+",
    },
    {
      name: "St. Charles Lwanga",
      district: "Alotau",
      type: "Permitted (Church)",
      streams: "Science, Humanities, Business",
      boarding: true,
      students: "560+",
    },
    {
      name: "Holy Name Secondary",
      district: "Alotau",
      type: "Permitted (Church)",
      streams: "Humanities, Business",
      boarding: true,
      students: "430+",
    },
    {
      name: "Misima Secondary",
      district: "Samarai-Murua",
      type: "Provincial High",
      streams: "Humanities",
      boarding: false,
      students: "180+",
    },
    {
      name: "Rossel Island Sec",
      district: "Samarai-Murua",
      type: "Provincial High",
      streams: "Humanities",
      boarding: false,
      students: "150+",
    },
  ];

  const [schoolType, setSchoolType] = useState("");

  const [query, setQuery] = useState("");

  const normalizedQuery = query.trim().toLowerCase();

  const filteredSchools = SCHOOLS.filter(
    (s) =>
      (schoolType === "" || s.type === schoolType) &&
      `${s.name} ${s.district} ${s.type} ${s.streams}`.toLowerCase().includes(normalizedQuery),
  );

  return (
    <section id="schools" className="bg-[#F8F6F1] py-16 px-4">
      <Reveal className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <span className="text-amber-500 text-xs font-bold uppercase tracking-widest">
              School Network
            </span>
            <h2
              className="text-4xl font-bold text-[#0B2545] mt-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              24 Secondary & High Schools
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              id="postprimary-schools-filter"
              value={schoolType}
              onChange={(event) => setSchoolType(event.target.value)}
              aria-label="Filter by school type"
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-amber-500"
            >
              <option value="">All Types</option>
              <option>National High</option>
              <option>Provincial High</option>
              <option>Permitted (Church)</option>
            </select>
            <input
              id="postprimary-schools-search"
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search schools..."
              aria-label="Search schools"
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-amber-500 min-w-[200px]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#163663] text-white text-left">
                <th className="px-4 py-3 font-semibold">School</th>
                <th className="px-4 py-3 font-semibold">District</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Streams</th>
                <th className="px-4 py-3 font-semibold">Boarding</th>
                <th className="px-4 py-3 font-semibold">Students</th>
                <th className="px-4 py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredSchools.map((s) => (
                <tr
                  key={s.name}
                  className="border-b border-gray-100 hover:bg-white transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-[#0B2545]">{s.name}</td>
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
                  <td className="px-4 py-3 text-gray-700 max-w-xs truncate">{s.streams}</td>
                  <td className="px-4 py-3">
                    {s.boarding ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
                        <Icon name="check" size={13} className="mr-1" /> Boarding
                      </span>
                    ) : (
                      <span className="text-gray-400 text-sm">Day only</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{s.students}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => setQuery(s.name)}
                      className="text-amber-600 hover:text-amber-800 font-medium text-sm"
                    >
                      Focus →
                    </button>
                  </td>
                </tr>
              ))}
              {filteredSchools.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-gray-500">
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
              setSchoolType("");
              setQuery("");
            }}
            className="inline-flex items-center gap-2 border border-amber-500 text-amber-600 hover:bg-amber-50 font-semibold px-6 py-3 rounded transition-colors"
          >
            Full Directory →
          </button>
        </div>
      </Reveal>
    </section>
  );
}
