import { useState } from "react";
import { Link } from "react-router-dom";

export function CentresSection() {
  const CENTRES = [
    {
      name: "Alotau VET Centre",
      district: "Alotau",
      status: "Operational",
      programs: "Construction, Engineering, Automotive, Hospitality",
      capacity: "300",
      facilities: "Workshops, Computer Lab, Dormitory",
      icon: "🏢",
    },
    {
      name: "Samarai VET Centre",
      district: "Samarai-Murua",
      status: "Opening 2026",
      programs: "Maritime, Construction, Agriculture",
      capacity: "150",
      facilities: "Workshops, Jetty Access, Staff Housing",
      icon: "⚓",
    },
    {
      name: "Kiriwina Skills Centre",
      district: "Kiriwina-Goodenough",
      status: "Operational",
      programs: "Hospitality, Construction, ICT",
      capacity: "120",
      facilities: "Kitchen, Workshop, Solar Power",
      icon: "🏝️",
    },
    {
      name: "Esa'ala Training Centre",
      district: "Esa'ala",
      status: "Operational",
      programs: "Maritime, Agriculture, Hospitality",
      capacity: "100",
      facilities: "Workshop, Boat Access, Garden",
      icon: "🌊",
    },
    {
      name: "Rabaruana Technical School",
      district: "Rabaruana",
      status: "Operational",
      programs: "Engineering, Automotive, Construction",
      capacity: "200",
      facilities: "Modern Workshops, Library, Boarding",
      icon: "🔧",
    },
    {
      name: "Misima Skills Centre",
      district: "Samarai-Murua",
      status: "Planned",
      programs: "Maritime, Agriculture, ICT",
      capacity: "80",
      facilities: "Workshop, Satellite Internet",
      icon: "📡",
    },
  ];

  const [status, setStatus] = useState("");

  const [query, setQuery] = useState("");

  const normalizedQuery = query.trim().toLowerCase();

  const filteredCentres = CENTRES.filter(
    (c) =>
      (status === "" || c.status === status) &&
      `${c.name} ${c.district} ${c.programs}`.toLowerCase().includes(normalizedQuery),
  );

  return (
    <section id="centres" className="bg-[#F8F6F1] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <span className="text-teal-400 text-xs font-bold uppercase tracking-widest">
              Training Network
            </span>
            <h2
              className="text-4xl font-bold text-[#0B2545] mt-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              6 VET Centres Province-Wide
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              aria-label="Filter centres by status"
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-teal-500"
            >
              <option value="">All Status</option>
              <option>Operational</option>
              <option>Opening 2026</option>
              <option>Planned</option>
            </select>
            <input
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
          {filteredCentres.map((c) => (
            <div
              key={c.name}
              className="bg-white rounded-xl p-6 border border-gray-100 hover:border-teal-300 hover:shadow-lg transition-all"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="text-3xl shrink-0">{c.icon}</div>
                <div className="flex-1">
                  <h3
                    className="text-lg font-bold text-[#0B2545] mb-1"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {c.name}
                  </h3>
                  <span
                    className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      c.status === "Operational"
                        ? "bg-green-50 text-green-700"
                        : c.status === "Opening 2026"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-gray-50 text-gray-700"
                    }`}
                  >
                    {c.status}
                  </span>
                </div>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <strong>District:</strong> {c.district}
                </p>
                <p>
                  <strong>Programs:</strong> {c.programs}
                </p>
                <p>
                  <strong>Capacity:</strong> {c.capacity} trainees/year
                </p>
                <p>
                  <strong>Facilities:</strong> {c.facilities}
                </p>
              </div>
              <Link
                to="/contact"
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
      </div>
    </section>
  );
}
