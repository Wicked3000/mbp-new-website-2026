"use client";

import { useState } from "react";
import Link from "next/link";
import { useEntity } from "@/hooks/useDynamic";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";

export function CentresSection() {
  const CENTRES_FALLBACK = [
    { name: "Alotau FODE Centre", district: "Alotau", centre_type: "Main Centre", students: "850+", facilities: "Admin, Library, Computer Lab, Tutorial Rooms", coordinator: "Ms. Grace Kila", icon: "🏢" },
    { name: "Kiriwina FODE Centre", district: "Kiriwina-Goodenough", centre_type: "Island Centre", students: "320+", facilities: "Solar Power, Satellite Internet, Tutorial Room", coordinator: "Mr. John Bula", icon: "🏝️" },
    { name: "Losuia FODE Centre", district: "Losuia", centre_type: "Island Centre", students: "280+", facilities: "Library, Computer Lab, Staff Housing", coordinator: "Ms. Mary Tovue", icon: "🌊" },
    { name: "Esa'ala FODE Centre", district: "Esa'ala", centre_type: "Island Centre", students: "240+", facilities: "Tutorial Room, Solar, Boat Access", coordinator: "Mr. Peter Waso", icon: "⚓" },
    { name: "Samarai FODE Centre", district: "Samarai-Murua", centre_type: "Island Centre", students: "190+", facilities: "Library, Tutorial Room, Internet", coordinator: "Ms. Helen Gwali", icon: "🏝️" },
    { name: "Rabaruana FODE Centre", district: "Rabaruana", centre_type: "Mainland Centre", students: "410+", facilities: "Admin, Library, Lab, Dormitory", coordinator: "Mr. David Gari", icon: "🏫" },
    { name: "Wanigela FODE Centre", district: "Wanigela", centre_type: "Remote Centre", students: "160+", facilities: "Tutorial Room, Solar, Radio Link", coordinator: "Ms. Susan Kora", icon: "📡" },
    { name: "Agaivaro FODE Centre", district: "Agaivaro", centre_type: "Rural Centre", students: "220+", facilities: "Library, Computer Access, Tutorial Room", coordinator: "Mr. Thomas Vali", icon: "🌿" },
    { name: "Dobu FODE Centre", district: "Dobu", centre_type: "Island Centre", students: "180+", facilities: "Tutorial Room, Solar Power", coordinator: "Ms. Jenny Moi", icon: "🏝️" },
    { name: "Huhu FODE Centre", district: "Huhu", centre_type: "Rural Centre", students: "280+", facilities: "Library, Tutorial Room, Internet", coordinator: "Mr. Paul Boga", icon: "🏫" },
    { name: "Misima FODE Centre", district: "Samarai-Murua", centre_type: "Remote Island", students: "150+", facilities: "Tutorial Room, Satellite Link", coordinator: "Ms. Rose Kewa", icon: "📡" },
    { name: "Rossel Island FODE", district: "Samarai-Murua", centre_type: "Remote Island", students: "90+", facilities: "Basic Tutorial Room, Radio", coordinator: "Mr. Henry Uva", icon: "📻" },
  ];
  const { data: centreRows } = useEntity("fode_centres", CENTRES_FALLBACK);
  const { data: headings } = useEntity("fode_section_headings", []);
  const heading =
    headings.find((h: any) => h.skey === "centres") || {
      eyebrow: "Study Network",
      heading: "12 Study Centres Across the Province",
    };
  // The table column is centre_type so the entity layer stays simple; the cards
  // and the filter both speak in terms of "type".
  const centres = centreRows.map((c: any) => ({ ...c, type: c.centre_type || c.type }));

  const [centreType, setCentreType] = useState("");

  const [query, setQuery] = useState("");

  const normalizedQuery = query.trim().toLowerCase();

  const filteredCentres = centres.filter(
    (c: any) =>
      (centreType === "" || c.type === centreType) &&
      `${c.name} ${c.district} ${c.facilities} ${c.coordinator}`
        .toLowerCase()
        .includes(normalizedQuery),
  );

  return (
    <section id="centres" className="bg-[#F8F6F1] py-16 px-4">
      <Reveal className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <span className="text-teal-400 text-xs font-bold uppercase tracking-widest">
              {heading.eyebrow}
            </span>
            <h2
              className="text-4xl font-bold text-[#0B2545] mt-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {heading.heading}
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              id="fode-centres-filter"
              value={centreType}
              onChange={(event) => setCentreType(event.target.value)}
              aria-label="Filter centres by type"
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-teal-500"
            >
              <option value="">All Types</option>
              <option>Main Centre</option>
              <option>Island Centre</option>
              <option>Mainland Centre</option>
              <option>Remote Centre</option>
              <option>Rural Centre</option>
              <option>Remote Island</option>
            </select>
            <input
              id="fode-centres-search"
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search centres..."
              aria-label="Search centres"
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-teal-500 min-w-[200px]"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCentres.map((c: any) => (
            <div
              key={c.name}
              className="bg-white rounded-xl p-6 border border-gray-100 hover:border-teal-300 hover:shadow-lg transition-all"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="text-3xl shrink-0"><Icon name={c.icon} size={24} /></div>
                <div className="flex-1">
                  <h3
                    className="text-lg font-bold text-[#0B2545] mb-1"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {c.name}
                  </h3>
                  <span
                    className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      c.type === "Main Centre"
                        ? "bg-blue-50 text-blue-700"
                        : c.type.includes("Island")
                          ? "bg-teal-50 text-teal-700"
                          : "bg-gray-50 text-gray-700"
                    }`}
                  >
                    {c.type}
                  </span>
                </div>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <strong>District:</strong> {c.district}
                </p>
                <p>
                  <strong>Students:</strong> {c.students}
                </p>
                <p>
                  <strong>Facilities:</strong> {c.facilities}
                </p>
                <p>
                  <strong>Coordinator:</strong> {c.coordinator}
                </p>
              </div>
              <Link
                href="/contact"
                className="inline-block mt-4 text-teal-600 hover:text-teal-800 font-medium text-sm"
              >
                Contact Centre →
              </Link>
            </div>
          ))}
          {filteredCentres.length === 0 && (
            <div className="sm:col-span-2 lg:col-span-3 bg-white rounded-xl p-10 text-center text-gray-500">
              No centres match your filters.
            </div>
          )}
        </div>
      </Reveal>
    </section>
  );
}
