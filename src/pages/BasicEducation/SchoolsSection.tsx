import { useState } from "react";

export function SchoolsSection() {
  const DISTRICTS = [
    { name: "Alotau", schools: 42, students: "6,800+", type: "Urban / Rural" },
    {
      name: "Kiriwina-Goodenough",
      schools: 18,
      students: "2,100+",
      type: "Island",
    },
    {
      name: "Samarai-Murua",
      schools: 22,
      students: "1,900+",
      type: "Remote Islands",
    },
    {
      name: "Esa'ala",
      schools: 15,
      students: "1,600+",
      type: "Island / Coastal",
    },
    {
      name: "Rabaruana",
      schools: 28,
      students: "3,200+",
      type: "Mainland Rural",
    },
    {
      name: "Wanigela",
      schools: 12,
      students: "1,100+",
      type: "Remote Mainland",
    },
    { name: "Agaivaro", schools: 19, students: "2,000+", type: "Rural" },
    { name: "Dobu", schools: 16, students: "1,800+", type: "Island" },
    { name: "Duau", schools: 14, students: "1,400+", type: "Rural" },
    { name: "Guasopa", schools: 11, students: "1,000+", type: "Remote" },
    { name: "Huhu", schools: 21, students: "2,300+", type: "Rural" },
    { name: "Kokoda", schools: 13, students: "1,200+", type: "Remote" },
    { name: "Losuia", schools: 17, students: "1,700+", type: "Island" },
    { name: "Maramatana", schools: 10, students: "900+", type: "Remote" },
    { name: "Misi", schools: 12, students: "1,100+", type: "Rural" },
    { name: "Sibonai", schools: 11, students: "950+", type: "Remote" },
    { name: "West Ferguson", schools: 11, students: "1,050+", type: "Remote" },
  ];

  const [district, setDistrict] = useState("");

  const [query, setQuery] = useState("");

  const normalizedQuery = query.trim().toLowerCase();

  const filteredDistricts = DISTRICTS.filter(
    (d) =>
      (district === "" || d.name === district) &&
      `${d.name} ${d.type}`.toLowerCase().includes(normalizedQuery),
  );

  return (
    <section id="schools" className="bg-[#F8F6F1] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <span className="text-teal-500 text-xs font-bold uppercase tracking-widest">
              School Network
            </span>
            <h2
              className="text-4xl font-bold text-[#0B2545] mt-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Schools Across 17 Districts
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={district}
              onChange={(event) => setDistrict(event.target.value)}
              aria-label="Filter by district"
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-teal-500"
            >
              <option value="">All Districts</option>
              {DISTRICTS.map((d) => (
                <option key={d.name} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
            <input
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
                    <button
                      type="button"
                      onClick={() => {
                        setDistrict(d.name);

                        setQuery("");
                      }}
                      className="text-teal-600 hover:text-teal-800 font-medium text-sm"
                    >
                      View Schools →
                    </button>
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
      </div>
    </section>
  );
}
