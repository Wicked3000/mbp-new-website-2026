import { Link } from "react-router-dom";

import { useEffect, useState } from "react";

import { api } from "@/lib/api";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

type JsonRecord = Record<string, string | number | boolean | null>;

type Grade9Row = {
  id?: number | string;
  school: string;
  district: string;
  type: string;
  capacity: number;
  placed: number;
  stream: string;
  cutoff: number;
};

type Grade11Row = {
  id?: number | string;
  school: string;
  district: string;
  type: string;
  capacity: number;
  placed: number;
  cutoff: number;
};

const FALLBACK_GRADE9_DATA: Grade9Row[] = [
  {
    school: "Cameron Secondary School",
    district: "Alotau",
    type: "National High",
    capacity: 300,
    placed: 298,
    stream: "Science, Humanities, Business",
    cutoff: 185,
  },

  {
    school: "Alotau Secondary School",
    district: "Alotau",
    type: "Provincial High",
    capacity: 250,
    placed: 248,
    stream: "Science, Humanities, Business, Technical",
    cutoff: 165,
  },

  {
    school: "Bwesiruru Secondary",
    district: "Alotau",
    type: "Provincial High",
    capacity: 180,
    placed: 178,
    stream: "Science, Humanities, Business",
    cutoff: 145,
  },

  {
    school: "Hagita Secondary School",
    district: "Alotau",
    type: "Provincial High",
    capacity: 160,
    placed: 158,
    stream: "Humanities, Business, Technical",
    cutoff: 135,
  },

  {
    school: "Kiriwina Secondary School",
    district: "Kiriwina-Goodenough",
    type: "Provincial High",
    capacity: 120,
    placed: 118,
    stream: "Humanities, Business",
    cutoff: 125,
  },

  {
    school: "Losuia Secondary School",
    district: "Losuia",
    type: "Provincial High",
    capacity: 100,
    placed: 98,
    stream: "Science, Humanities",
    cutoff: 120,
  },

  {
    school: "Esa'ala Secondary School",
    district: "Esa'ala",
    type: "Provincial High",
    capacity: 100,
    placed: 96,
    stream: "Humanities, Business",
    cutoff: 115,
  },

  {
    school: "Rabaruana Secondary",
    district: "Rabaruana",
    type: "Provincial High",
    capacity: 140,
    placed: 138,
    stream: "Science, Humanities",
    cutoff: 130,
  },

  {
    school: "Samarai Secondary School",
    district: "Samarai-Murua",
    type: "Provincial High",
    capacity: 80,
    placed: 78,
    stream: "Humanities, Business",
    cutoff: 110,
  },

  {
    school: "Wanigela Secondary",
    district: "Wanigela",
    type: "Provincial High",
    capacity: 70,
    placed: 68,
    stream: "Humanities",
    cutoff: 105,
  },

  {
    school: "Agaivaro Secondary",
    district: "Agaivaro",
    type: "Provincial High",
    capacity: 90,
    placed: 88,
    stream: "Humanities, Business",
    cutoff: 115,
  },

  {
    school: "Dobu Secondary School",
    district: "Dobu",
    type: "Provincial High",
    capacity: 70,
    placed: 68,
    stream: "Humanities",
    cutoff: 100,
  },

  {
    school: "Duau Secondary School",
    district: "Duau",
    type: "Provincial High",
    capacity: 70,
    placed: 68,
    stream: "Humanities, Business",
    cutoff: 105,
  },

  {
    school: "Guasopa Secondary",
    district: "Guasopa",
    type: "Provincial High",
    capacity: 60,
    placed: 58,
    stream: "Humanities",
    cutoff: 95,
  },

  {
    school: "Huhu Secondary School",
    district: "Huhu",
    type: "Provincial High",
    capacity: 120,
    placed: 118,
    stream: "Science, Humanities",
    cutoff: 125,
  },

  {
    school: "Kokoda Secondary",
    district: "Kokoda",
    type: "Provincial High",
    capacity: 60,
    placed: 56,
    stream: "Humanities",
    cutoff: 90,
  },

  {
    school: "Maramatana Secondary",
    district: "Maramatana",
    type: "Provincial High",
    capacity: 50,
    placed: 48,
    stream: "Humanities",
    cutoff: 85,
  },

  {
    school: "Misi Secondary School",
    district: "Misi",
    type: "Provincial High",
    capacity: 70,
    placed: 68,
    stream: "Humanities, Business",
    cutoff: 100,
  },

  {
    school: "Sibonai Secondary",
    district: "Sibonai",
    type: "Provincial High",
    capacity: 50,
    placed: 48,
    stream: "Humanities",
    cutoff: 85,
  },

  {
    school: "West Ferguson Secondary",
    district: "West Ferguson",
    type: "Provincial High",
    capacity: 50,
    placed: 48,
    stream: "Humanities",
    cutoff: 80,
  },

  {
    school: "St. Charles Lwanga Secondary",
    district: "Alotau",
    type: "Permitted (Church)",
    capacity: 150,
    placed: 148,
    stream: "Science, Humanities, Business",
    cutoff: 155,
  },

  {
    school: "Holy Name Secondary",
    district: "Alotau",
    type: "Permitted (Church)",
    capacity: 120,
    placed: 118,
    stream: "Humanities, Business",
    cutoff: 140,
  },

  {
    school: "Misima Secondary",
    district: "Samarai-Murua",
    type: "Provincial High",
    capacity: 50,
    placed: 46,
    stream: "Humanities",
    cutoff: 80,
  },

  {
    school: "Rossel Island Secondary",
    district: "Samarai-Murua",
    type: "Provincial High",
    capacity: 40,
    placed: 38,
    stream: "Humanities",
    cutoff: 75,
  },
];

const FALLBACK_GRADE11_DATA = [
  {
    school: "Cameron Secondary School",
    district: "Alotau",
    type: "National High",
    streams_json: '{"Science":80,"Humanities":60,"Business":40}',
    placed_json: '{"Science":78,"Humanities":58,"Business":38}',
    cutoff_json: '{"Science":220,"Humanities":200,"Business":190}',
  },

  {
    school: "Alotau Secondary School",
    district: "Alotau",
    type: "Provincial High",
    streams_json: '{"Science":60,"Humanities":50,"Business":40,"Technical":30}',
    placed_json: '{"Science":58,"Humanities":48,"Business":38,"Technical":28}',
    cutoff_json: '{"Science":200,"Humanities":185,"Business":175,"Technical":165}',
  },

  {
    school: "Bwesiruru Secondary",
    district: "Alotau",
    type: "Provincial High",
    streams_json: '{"Science":40,"Humanities":40,"Business":30}',
    placed_json: '{"Science":38,"Humanities":38,"Business":28}',
    cutoff_json: '{"Science":185,"Humanities":170,"Business":160}',
  },

  {
    school: "Hagita Secondary School",
    district: "Alotau",
    type: "Provincial High",
    streams_json: '{"Humanities":50,"Business":40,"Technical":30}',
    placed_json: '{"Humanities":48,"Business":38,"Technical":28}',
    cutoff_json: '{"Humanities":165,"Business":155,"Technical":150}',
  },

  {
    school: "St. Charles Lwanga Secondary",
    district: "Alotau",
    type: "Permitted (Church)",
    streams_json: '{"Science":50,"Humanities":40,"Business":30}',
    placed_json: '{"Science":48,"Humanities":38,"Business":28}',
    cutoff_json: '{"Science":195,"Humanities":180,"Business":170}',
  },

  {
    school: "Holy Name Secondary",
    district: "Alotau",
    type: "Permitted (Church)",
    streams_json: '{"Humanities":40,"Business":30}',
    placed_json: '{"Humanities":38,"Business":28}',
    cutoff_json: '{"Humanities":170,"Business":160}',
  },

  {
    school: "Kiriwina Secondary School",
    district: "Kiriwina-Goodenough",
    type: "Provincial High",
    streams_json: '{"Humanities":30,"Business":20}',
    placed_json: '{"Humanities":28,"Business":18}',
    cutoff_json: '{"Humanities":155,"Business":145}',
  },

  {
    school: "Losuia Secondary School",
    district: "Losuia",
    type: "Provincial High",
    streams_json: '{"Science":25,"Humanities":25}',
    placed_json: '{"Science":23,"Humanities":23}',
    cutoff_json: '{"Science":175,"Humanities":160}',
  },

  {
    school: "Esa'ala Secondary School",
    district: "Esa'ala",
    type: "Provincial High",
    streams_json: '{"Humanities":30,"Business":20}',
    placed_json: '{"Humanities":28,"Business":18}',
    cutoff_json: '{"Humanities":150,"Business":140}',
  },

  {
    school: "Rabaruana Secondary",
    district: "Rabaruana",
    type: "Provincial High",
    streams_json: '{"Science":30,"Humanities":30}',
    placed_json: '{"Science":28,"Humanities":28}',
    cutoff_json: '{"Science":170,"Humanities":155}',
  },

  {
    school: "Samarai Secondary School",
    district: "Samarai-Murua",
    type: "Provincial High",
    streams_json: '{"Humanities":25,"Business":15}',
    placed_json: '{"Humanities":23,"Business":13}',
    cutoff_json: '{"Humanities":145,"Business":135}',
  },

  {
    school: "Huhu Secondary School",
    district: "Huhu",
    type: "Provincial High",
    streams_json: '{"Science":30,"Humanities":30}',
    placed_json: '{"Science":28,"Humanities":28}',
    cutoff_json: '{"Science":165,"Humanities":150}',
  },

  {
    school: "Wanigela Secondary",
    district: "Wanigela",
    type: "Provincial High",
    streams_json: '{"Humanities":20}',
    placed_json: '{"Humanities":18}',
    cutoff_json: '{"Humanities":140}',
  },

  {
    school: "Agaivaro Secondary",
    district: "Agaivaro",
    type: "Provincial High",
    streams_json: '{"Humanities":25,"Business":15}',
    placed_json: '{"Humanities":23,"Business":13}',
    cutoff_json: '{"Humanities":145,"Business":135}',
  },

  {
    school: "Dobu Secondary School",
    district: "Dobu",
    type: "Provincial High",
    streams_json: '{"Humanities":20}',
    placed_json: '{"Humanities":18}',
    cutoff_json: '{"Humanities":130}',
  },

  {
    school: "Duau Secondary School",
    district: "Duau",
    type: "Provincial High",
    streams_json: '{"Humanities":20,"Business":15}',
    placed_json: '{"Humanities":18,"Business":13}',
    cutoff_json: '{"Humanities":135,"Business":125}',
  },
];

function parseJsonRecord(value: unknown): JsonRecord {
  let parsed: unknown = value;

  if (typeof value === "string") {
    try {
      parsed = JSON.parse(value);
    } catch {
      return {};
    }
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};

  return Object.fromEntries(
    Object.entries(parsed as Record<string, unknown>).filter(
      ([, item]) => item === null || ["string", "number", "boolean"].includes(typeof item),
    ),
  ) as JsonRecord;
}

function normalizeJsonFields(row: Record<string, unknown>) {
  const normalized = { ...row };

  Object.keys(row).forEach((key) => {
    if (key.toLowerCase().endsWith("_json")) normalized[key] = parseJsonRecord(row[key]);
  });

  return normalized;
}

function textValue(value: unknown, fallback = "") {
  return typeof value === "string" || typeof value === "number" ? String(value) : fallback;
}

function numberValue(value: unknown, fallback = 0) {
  if (value == null || value === "") return fallback;
  const number = typeof value === "number" ? value : Number(value);

  return Number.isFinite(number) ? number : fallback;
}

function streamValue(value: unknown) {
  if (value && typeof value === "object" && !Array.isArray(value))
    return Object.keys(value as object).join(", ");

  return textValue(value, "Not provided");
}

function normalizeGrade9Rows(data: unknown): Grade9Row[] {
  if (!Array.isArray(data)) return [];

  return data.map((value) => {
    const raw =
      value && typeof value === "object"
        ? normalizeJsonFields(value as Record<string, unknown>)
        : {};

    return {
      id: raw.id as number | string | undefined,
      school: textValue(raw.school ?? raw.name, "Unnamed school"),
      district: textValue(raw.district, "Not provided"),
      type: textValue(raw.type, "Provincial High"),
      capacity: numberValue(raw.capacity),
      placed: numberValue(raw.placed),
      stream: streamValue(raw.stream ?? raw.stream_json),
      cutoff: numberValue(raw.cutoff),
    };
  });
}

function recordTotal(value: unknown): number {
  return Object.values(parseJsonRecord(value)).reduce<number>(
    (total, item) => total + numberValue(item),
    0,
  );
}

function normalizeGrade11Rows(data: unknown): Grade11Row[] {
  if (!Array.isArray(data)) return [];

  return data.map((value) => {
    const raw =
      value && typeof value === "object"
        ? normalizeJsonFields(value as Record<string, unknown>)
        : {};
    const streams = parseJsonRecord(raw.streams_json ?? raw.streams);
    const placed = parseJsonRecord(raw.placed_json ?? raw.placed);
    const cutoff = parseJsonRecord(raw.cutoff_json ?? raw.cutoff);

    return {
      id: raw.id as number | string | undefined,
      school: textValue(raw.school, "Unnamed school"),
      district: textValue(raw.district, "Not provided"),
      type: textValue(raw.type, "Provincial High"),
      capacity: numberValue(raw.capacity, recordTotal(streams)),
      placed: numberValue(raw.placed, recordTotal(placed)),
      cutoff: numberValue(raw.cutoff, recordTotal(cutoff)),
    };
  });
}

function PageHero() {
  return (
    <section className="relative h-[400px] sm:h-[480px] overflow-hidden bg-[#0B2545]">
      <img decoding="async"
        src="/assets/education_programs/map/milne_bay_map.jpg"
        alt="Students checking results"
        className="absolute inset-0 w-full h-full object-cover object-center opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0B2545]/90 via-[#0B2545]/70 to-[#163663]/40" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 h-full flex flex-col justify-center">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-[#C9A84C]/20 border border-[#C9A84C]/40 text-[#E2C47A] text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] inline-block" />
            2026 Selection Lists
          </div>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-5"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Grade 9 & 11 Selections
            <span className="block text-[#C9A84C]">2026 Academic Year</span>
          </h1>
          <p className="text-blue-100 text-lg leading-relaxed max-w-2xl">
            Official placement lists for students transitioning to Grade 9 (Secondary) and Grade 11
            (Upper Secondary) across Milne Bay Province schools.
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
            <Link
              to="#grade9"
              className="inline-flex items-center gap-2 bg-[#C9A84C] hover:bg-[#B8953E] text-[#0B2545] font-semibold px-6 py-3 rounded transition-colors"
            >
              Grade 9 Selection
            </Link>
            <Link
              to="#grade11"
              className="inline-flex items-center gap-2 border border-[#C9A84C] text-[#E2C47A] hover:bg-[#C9A84C]/10 hover:text-white font-semibold px-6 py-3 rounded transition-colors"
            >
              Grade 11 Selection
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function KeyInfoSection() {
  return (
    <section className="bg-[#F8F6F1] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {[
            {
              icon: "📅",
              title: "Release Date",
              value: "Early Jan 2026",
              desc: "After Grade 8 & 10 results",
            },
            {
              icon: "🏫",
              title: "Schools Covered",
              value: "24 Secondary",
              desc: "Provincial & National High",
            },
            {
              icon: "👥",
              title: "Students Placed",
              value: "6,500+",
              desc: "Grade 9 & 11 combined",
            },
            {
              icon: "📋",
              title: "Selection Basis",
              value: "Merit & Choice",
              desc: "Exam marks + preferences",
            },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-xl p-6 border border-gray-100">
              <div className="text-3xl mb-3">{item.icon}</div>
              <div
                className="text-2xl font-bold text-[#0B2545] mb-1"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {item.value}
              </div>
              <div className="text-[#C9A84C] text-sm font-semibold uppercase tracking-wider mb-1">
                {item.title}
              </div>
              <p className="text-gray-500 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Grade9Section() {
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
            type="text"
            placeholder="Search school or district..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
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

function Grade11Section() {
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
      <div className="max-w-7xl mx-auto">
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
            type="text"
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
      </div>
    </section>
  );
}

function ProcessSection() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-[#C9A84C] text-xs font-bold uppercase tracking-widest">
            Selection Process
          </span>
          <h2
            className="text-4xl font-bold text-[#0B2545] mt-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            How Selections Work
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: "01",
              title: "Exam Results",
              desc: "Grade 8 & 10 results released by Measurement Services Division (MSD). Students receive certificates with scores.",
            },
            {
              step: "02",
              title: "Online Selection",
              desc: "National Online Selection System (NOSS) opens. Students log in with credentials and rank school preferences (max 5).",
            },
            {
              step: "03",
              title: "Automated Matching",
              desc: "Algorithm matches students to schools based on: exam score (primary), preferences (ordered), school capacity, district quotas.",
            },
            {
              step: "04",
              title: "Lists Published",
              desc: "Provincial Education Advisor approves lists. Published on Dept website, at schools, and district offices. SMS notifications sent.",
            },
          ].map((s) => (
            <div key={s.step} className="bg-[#F8F6F1] rounded-xl p-6 border border-gray-100">
              <div
                className="w-14 h-14 rounded-full bg-[#C9A84C]/10 flex items-center justify-center mb-4 text-2xl font-bold text-[#C9A84C]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {s.step}
              </div>
              <h3
                className="text-lg font-bold text-[#0B2545] mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {s.title}
              </h3>
              <p className="text-gray-600 text-sm">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-blue-50 rounded-xl border border-blue-100">
          <h3
            className="text-xl font-bold text-[#0B2545] mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Important Dates 2026
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            {[
              { label: "Grade 8/10 Results Released", date: "Dec 2025" },
              { label: "NOSS Opens for Choices", date: "Early Jan 2026" },
              { label: "Selection Processing", date: "Mid Jan 2026" },
              { label: "Lists Published", date: "Late Jan 2026" },
            ].map((d) => (
              <div key={d.label} className="bg-white rounded-lg p-4 border border-blue-100">
                <div className="text-sm text-blue-600 font-medium">{d.date}</div>
                <div className="text-gray-700">{d.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const FAQS = [
    {
      q: "When will the 2026 Grade 9 and Grade 11 Selection Lists be released?",
      a: "Lists are typically published in late January 2026, after Grade 8 and Grade 10 results are released (December 2025) and the National Online Selection System (NOSS) processing is complete (mid-January).",
    },
    {
      q: "How do I check if my child has been selected?",
      a: "1) Visit the school noticeboard where lists are posted. 2) Check the Division of Education website (this page). 3) Check the NDoE website. 4) SMS notification sent to registered parent phone numbers.",
    },
    {
      q: "What if my child is not on the selection list?",
      a: "Options: 1) Appeal through the Provincial Selection Committee (2 weeks after publication). 2) Apply for FODE (distance education) - continuous enrolment. 3) Consider VET certificate programs. 4) Repeat Grade 8/10 to improve scores.",
    },
    {
      q: "How are students selected for Grade 9 and Grade 11?",
      a: "Automated matching via NOSS based on: (1) Exam score (highest first), (2) School preferences (1st choice priority), (3) School capacity limits, (4) District quotas for boarding schools. Same process for both grades.",
    },
    {
      q: "Can I change my child's school after selection?",
      a: "Transfers are possible but limited. Submit transfer request to Provincial Education Office within 2 weeks of term start. Approved only if: space available at requested school, valid reason (medical, relocation), both principals agree.",
    },
    {
      q: "What are the cutoff scores for each school?",
      a: "Cutoffs vary yearly based on applicant pool. 2026 cutoffs are shown in the tables above. Cameron Secondary (National High) typically highest (185+ for Gr 9, 220+ for Gr 11 Science). Rural schools lower (75–120).",
    },
    {
      q: "My child was selected for a boarding school. What next?",
      a: "School will send admission letter with: reporting date, fees (boarding component), required items (uniform, bedding, toiletries), medical form. Parents must confirm acceptance and pay deposit by deadline.",
    },
    {
      q: "Where can I get help with the selection process?",
      a: "Contact: Provincial Selection Helpdesk +675 641 1234 ext. 2 (Basic) or ext. 3 (Post Primary). Email: selections@mbpeducation.gov.pg. Visit your District Education Office for in-person assistance.",
    },
  ];

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-[#C9A84C] text-xs font-bold uppercase tracking-widest">
            Frequently Asked
          </span>
          <h2
            className="text-4xl font-bold text-[#0B2545] mt-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Common Questions
          </h2>
        </div>
        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <details
              key={i}
              className="group bg-[#F8F6F1] rounded-xl border border-gray-100 overflow-hidden"
            >
              <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                <h3 className="text-[#0B2545] font-semibold text-base pr-8">{faq.q}</h3>
                <span className="text-[#C9A84C] transition-transform group-open:rotate-180">▼</span>
              </summary>
              <div className="px-5 pb-5 pt-0 text-gray-600 leading-relaxed border-t border-gray-200">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function SelectionsPage() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif" }}>
      <SiteHeader />
      <PageHero />
      <KeyInfoSection />
      <Grade9Section />
      <Grade11Section />
      <ProcessSection />
      <FAQSection />
      <SiteFooter />
    </div>
  );
}
