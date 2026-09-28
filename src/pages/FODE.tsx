import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useEntity } from "@/hooks/useDynamic";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

function PageHero() {
  const FALLBACK = {
    eyebrow: "Program 04 - Flexible Open & Distance Education",
    title: "Flexible Open &",
    subtitle: " Distance Education (FODE)",
    description:
      "Quality secondary education for remote communities, working adults, and students needing flexible pathways - learning without boundaries across Milne Bay Province.",
    banner: "/assets/fode/fode-banner-img.jpg",
    alt: "FODE learning materials",
  };
  const { data } = useEntity("fode_hero", [FALLBACK]);
  const hero = { ...FALLBACK, ...(data?.[0] || {}) };
  return (
    <section className="relative h-[400px] sm:h-[480px] overflow-hidden bg-[#0B2545]">
      <img decoding="async"
        src={hero.banner}
        alt={hero.alt}
        className="absolute inset-0 w-full h-full object-cover object-[50%_100%] opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0B2545]/90 via-[#0B2545]/70 to-[#163663]/40" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 h-full flex flex-col justify-center">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-teal-400/20 border border-teal-400/40 text-teal-300 text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 inline-block" />
            {hero.eyebrow}
          </div>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-5"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {hero.title}
            <span className="block text-teal-400">{hero.subtitle}</span>
          </h1>
          <p className="text-teal-100 text-lg leading-relaxed max-w-2xl">
            {hero.description}
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
            <Link
              to="#overview"
              className="inline-flex items-center gap-2 bg-teal-400 hover:bg-teal-500 text-white font-semibold px-6 py-3 rounded transition-colors"
            >
              Overview
            </Link>
            <Link
              to="#centres"
              className="inline-flex items-center gap-2 border border-teal-400 text-teal-300 hover:bg-teal-400/10 hover:text-white font-semibold px-6 py-3 rounded transition-colors"
            >
              Find Centres
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function OverviewSection() {
  const OVERVIEW_FALLBACK = {
    eyebrow: "Program Overview",
    heading: "Education Without Boundaries",
    intro:
      "FODE provides the same national curriculum and examinations as conventional schools, delivered through flexible distance learning. The Division operates 12 study centres across all 4 districts, serving 3,500+ students annually.",
    body: "Students include Grade 10/12 upgraders, remote island learners, working adults, and those who missed conventional schooling. All courses lead to nationally recognized Grade 10 and Grade 12 certificates.",
    features_title: "Key Features",
  };
  const CARDS_FALLBACK = [
    { icon: "📚", title: "Same National Curriculum", desc: "Identical syllabus, textbooks, and examinations as classroom-based schools" },
    { icon: "⏰", title: "Flexible Scheduling", desc: "Study at your own pace; no fixed timetables - ideal for working students and parents" },
    { icon: "🏝️", title: "Remote Access", desc: "Study centres on islands and mainland; materials delivered by boat, plane, and digital platforms" },
    { icon: "🎓", title: "National Certification", desc: "Grade 10 & 12 certificates identical to conventional schools; accepted for tertiary entry" },
  ];
  const FEATURES_FALLBACK = [
    { feature: "Free tuition under Government FODE subsidy" },
    { feature: "12 study centres + 25+ correspondence sites" },
    { feature: "Print & digital materials (Moodle LMS, offline apps)" },
    { feature: "Tutor support via phone, WhatsApp, and centre visits" },
    { feature: "Same Grade 10/12 National Exams as conventional schools" },
    { feature: "Credit transfer to/from conventional and VET pathways" },
  ];
  const STATS_FALLBACK = [
    { value_text: "12", label: "Study Centres", color: "bg-[#0B2545]" },
    { value_text: "3,500+", label: "Active Students", color: "bg-[#163663]" },
    { value_text: "25+", label: "Correspondence Sites", color: "bg-teal-600" },
    { value_text: "92%", label: "Exam Pass Rate", color: "bg-teal-700" },
  ];

  const { data: overviewRows } = useEntity("fode_overview", [OVERVIEW_FALLBACK]);
  const { data: cards } = useEntity("fode_overview_cards", CARDS_FALLBACK);
  const { data: features } = useEntity("fode_overview_features", FEATURES_FALLBACK);
  const { data: stats } = useEntity("fode_overview_stats", STATS_FALLBACK);
  const overview = { ...OVERVIEW_FALLBACK, ...(overviewRows?.[0] || {}) };

  return (
    <section id="overview" className="bg-[#F8F6F1] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <span className="text-teal-400 text-xs font-bold uppercase tracking-widest">
              {overview.eyebrow}
            </span>
            <h2
              className="text-4xl font-bold text-[#0B2545] mt-2 mb-6 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {overview.heading}
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4 text-lg">{overview.intro}</p>
            <p className="text-gray-600 leading-relaxed mb-6">{overview.body}</p>
            <div className="space-y-4">
              {cards.map((item: any) => (
                <div
                  key={item.title}
                  className="flex gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-teal-200 hover:shadow-md transition-all"
                >
                  <div className="text-2xl shrink-0">{item.icon}</div>
                  <div>
                    <h3 className="text-[#0B2545] font-bold mb-1">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100">
              <img loading="lazy" decoding="async"
                src="/assets/fode/fode-img.jpg"
                alt="Study centre"
                className="w-full h-72 object-cover object-[50%_90%]"
              />
              <div className="p-6">
                <h3
                  className="text-xl font-bold text-[#0B2545] mb-3"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {overview.features_title}
                </h3>
                <ul className="space-y-3">
                  {features.map((row: any, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <span className="text-teal-400 shrink-0">✓</span>
                      <span className="text-gray-700">{row.feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {stats.map((s: any) => (
                <div key={s.label} className={`${s.color} rounded-xl p-5 text-white text-center`}>
                  <div
                    className="text-3xl font-bold"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {s.value_text}
                  </div>
                  <div className="text-teal-100 text-sm uppercase tracking-wider">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProgramsSection() {
  const PROGRAMS_FALLBACK = [
    { name: "Grade 10 Upgrade", level: "Grade 10", duration: "12–18 months", subjects: "English, Math, Science, Social Science, Personal Development, Business Studies", icon: "📖", color: "bg-blue-500", target: "Grade 8/9 leavers seeking Grade 10 cert" },
    { name: "Grade 12 Upgrade", level: "Grade 12", duration: "18–24 months", subjects: "English (A/L), Math (A/L), Science, Social Science, plus 2 electives per stream", icon: "🎓", color: "bg-purple-500", target: "Grade 10 holders seeking Grade 12 cert" },
    { name: "Matriculation Program", level: "Pre-University", duration: "12 months", subjects: "English, Math, Science, Humanities - university preparation stream", icon: "🏛️", color: "bg-indigo-500", target: "Grade 12 grads improving marks for uni" },
    { name: "Adult Literacy & Numeracy", level: "Foundation", duration: "6–12 months", subjects: "Basic literacy, numeracy, digital skills, life skills", icon: "📝", color: "bg-green-500", target: "Adults with limited formal education" },
    { name: "VET Pathway Courses", level: "Certificate", duration: "6–12 months", subjects: "Trade theory modules aligned with VET NC1 - practical at nearest centre", icon: "🔧", color: "bg-orange-500", target: "FODE students entering trades" },
    { name: "Teacher Upgrading", level: "Professional", duration: "12–18 months", subjects: "Curriculum, pedagogy, assessment - for untrained teachers", icon: "👨‍🏫", color: "bg-teal-500", target: "In-service teachers without certification" },
  ];
  const { data: programs } = useEntity("fode_programs", PROGRAMS_FALLBACK);
  const { data: headings } = useEntity("fode_section_headings", []);
  const heading =
    headings.find((h: any) => h.skey === "programs") || {
      eyebrow: "Study Programs",
      heading: "Flexible Learning Pathways",
      blurb: "Six program types serving diverse learners - from school leavers to working adults. All use the national curriculum with flexible delivery.",
    };

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-teal-400 text-xs font-bold uppercase tracking-widest">
            {heading.eyebrow}
          </span>
          <h2
            className="text-4xl font-bold text-[#0B2545] mt-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {heading.heading}
          </h2>
          {heading.blurb && (
            <p className="text-gray-500 mt-3 max-w-xl mx-auto text-base leading-relaxed">
              {heading.blurb}
            </p>
          )}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((p: any) => (
            <div
              key={p.name}
              className="bg-[#F8F6F1] rounded-xl p-6 border border-gray-100 hover:border-teal-300 hover:shadow-lg transition-all"
            >
              <div className={`${p.color} text-white rounded-lg p-2 inline-block mb-3`}>
                <span className="text-xl">{p.icon}</span>
              </div>
              <h3
                className="text-lg font-bold text-[#0B2545] mb-1"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {p.name}
              </h3>
              <div className="text-teal-600 text-xs font-semibold uppercase tracking-wider mb-2">
                {p.level} • {p.duration}
              </div>
              <p className="text-gray-600 text-sm mb-3">{p.subjects}</p>
              <div className="text-teal-600 text-xs font-medium">Target: {p.target}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const FODE_CENTRE = "Alotau FODE Centre";

// Student names are deliberately absent: selection_students is admin-only on
// the API, so no copy of it belongs in the public bundle. The section below
// loads rows from the authenticated API instead.

function CentresSection() {
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
      <div className="max-w-7xl mx-auto">
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

type FodeStudent = {
  school: string;
  position_no: number | string | null;
  primary_school: string;
  surname: string;
  first_name: string;
  gender: string;
};

function SelectionListsSection() {
  const { data: headings } = useEntity("fode_section_headings", []);
  // Student names come from the API, which restricts selection_students to
  // authenticated admins. There is deliberately no bundled copy.
  const [students, setStudents] = useState<FodeStudent[]>([]);

  useEffect(() => {
    let active = true;
    api
      .list("selection_students")
      .then((rows) => {
        if (!active) return;
        const fode = (Array.isArray(rows) ? rows : []).filter((row: any) =>
          /FODE/i.test(String(row.school || "")),
        );
        setStudents(fode);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const heading =
    headings.find((h: any) => h.skey === "selections") || {
      eyebrow: "2026 FODE Selection",
      heading: "FODE Student Enrolment Lists",
      blurb: "Official 2026 FODE student enrolment list for the main Alotau FODE Centre. Students enrolled in Grade 10/12 upgrade programs.",
    };

  return (
    <section id="fode-selections" className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <span className="text-teal-400 text-xs font-bold uppercase tracking-widest">
            {heading.eyebrow}
          </span>
          <h2
            className="text-4xl font-bold text-[#0B2545] mt-2 mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {heading.heading}
          </h2>
          <p className="text-gray-500">
            {heading.blurb ||
              "Official 2026 FODE student enrolment list for the main Alotau FODE Centre. Students enrolled in Grade 10/12 upgrade programs."}
          </p>
        </div>

        <div className="space-y-4">
          <details className="group bg-[#F8F6F1] rounded-xl border border-gray-100 overflow-hidden">
            <summary className="flex items-center justify-between p-4 cursor-pointer list-none">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center text-teal-600 font-bold text-lg">
                  🏢
                </span>
                <h4 className="font-semibold text-[#0B2545] pr-8">{FODE_CENTRE}</h4>
              </div>
              <span className="text-amber-500 transition-transform group-open:rotate-180">▼</span>
            </summary>
            <div className="px-4 pb-4 pt-0 border-t border-gray-200">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#0B2545] text-white text-left">
                      <th className="px-3 py-2 font-semibold w-12">NO.</th>
                      <th className="px-3 py-2 font-semibold">PRIMARY SCHOOL</th>
                      <th className="px-3 py-2 font-semibold">SURNAME</th>
                      <th className="px-3 py-2 font-semibold">FIRST NAME</th>
                      <th className="px-3 py-2 font-semibold w-20">GENDER</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student, i) => (
                      <tr key={i} className={`border-b ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                        <td className="px-3 py-2 text-center text-gray-700">
                          {student.position_no || "-"}
                        </td>
                        <td className="px-3 py-2 text-gray-700">{student.primary_school}</td>
                        <td className="px-3 py-2 font-medium text-[#0B2545]">{student.surname}</td>
                        <td className="px-3 py-2 text-gray-700">{student.first_name}</td>
                        <td className="px-3 py-2 text-center">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                              student.gender === "M"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-pink-100 text-pink-700"
                            }`}
                          >
                            {student.gender}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-3 text-right">
                <Link
                  to="/selections"
                  className="text-teal-600 hover:text-teal-800 text-sm font-medium"
                >
                  View Selection Lists →
                </Link>
              </div>
            </div>
          </details>
        </div>

        <div className="mt-10 p-6 bg-teal-50 rounded-xl border border-teal-100 text-center">
          <h3
            className="text-lg font-bold text-[#0B2545] mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            FODE Enrolment Information
          </h3>
          <p className="text-gray-600 mb-4">
            The Alotau FODE Centre is the main provincial centre. Additional correspondence sites
            across the 4 districts support remote learners.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/selections"
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-5 py-2.5 rounded transition-colors"
            >
              View FODE Selection Lists
            </Link>
            <Link
              to="#centres"
              className="inline-flex items-center gap-2 border border-teal-500 text-teal-600 hover:bg-teal-50 font-semibold px-5 py-2.5 rounded transition-colors"
            >
              View All Centres →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function DeliverySection() {
  const METHODS_FALLBACK = [
    { name: "Printed Course Materials", desc: "Full curriculum textbooks, workbooks, and assignment booklets delivered to centres and correspondence sites. Updated annually.", icon: "📦", availability: "All Centres" },
    { name: "Digital Learning Platform", desc: "Moodle LMS with interactive lessons, videos, quizzes, and progress tracking. Offline app for areas without internet.", icon: "💻", availability: "8 Centres + App" },
    { name: "Radio Broadcast Lessons", desc: "Weekly 30-min lessons on NBC Milne Bay & community radio. Covers all core subjects. Schedule distributed each term.", icon: "📻", availability: "Province-wide" },
    { name: "Tutorial Support Sessions", desc: "Face-to-face tutorials at centres (weekly/fortnightly). Tutor-marked assignments with feedback. Practical sessions for science.", icon: "👨‍🏫", availability: "All Centres" },
    { name: "WhatsApp Study Groups", desc: "Subject-specific groups with tutor moderation. Peer support, quick questions, assignment reminders. 85% student participation.", icon: "💬", availability: "Mobile Coverage Areas" },
    { name: "Mobile Centre Visits", desc: "Staff visit remote correspondence sites quarterly for enrolment, material distribution, exams, and counselling.", icon: "🚤", availability: "25+ Remote Sites" },
  ];
  const APP_FALLBACK = [
    { icon: "📱", heading: "FODE Mobile App (New 2026)", body: "Offline-first Android app with full course materials, video lessons, assignment submission, progress tracking, and tutor chat. Free download at centres or via APK.", bullet: "Works offline - syncs when online" },
    { icon: "📱", heading: "FODE Mobile App (New 2026)", body: "Offline-first Android app with full course materials, video lessons, assignment submission, progress tracking, and tutor chat. Free download at centres or via APK.", bullet: "Push notifications for deadlines & announcements" },
    { icon: "📱", heading: "FODE Mobile App (New 2026)", body: "Offline-first Android app with full course materials, video lessons, assignment submission, progress tracking, and tutor chat. Free download at centres or via APK.", bullet: "Assignment photo upload & voice notes" },
    { icon: "📱", heading: "FODE Mobile App (New 2026)", body: "Offline-first Android app with full course materials, video lessons, assignment submission, progress tracking, and tutor chat. Free download at centres or via APK.", bullet: "Progress dashboard & exam countdown" },
    { icon: "📱", heading: "FODE Mobile App (New 2026)", body: "Offline-first Android app with full course materials, video lessons, assignment submission, progress tracking, and tutor chat. Free download at centres or via APK.", bullet: "Low data mode for expensive connections" },
    { icon: "📱", heading: "FODE Mobile App (New 2026)", body: "Offline-first Android app with full course materials, video lessons, assignment submission, progress tracking, and tutor chat. Free download at centres or via APK.", bullet: "Tok Pisin & English interface" },
  ];
  const { data: methods } = useEntity("fode_delivery_methods", METHODS_FALLBACK);
  const { data: appRows } = useEntity("fode_app_callout", APP_FALLBACK);
  const { data: headings } = useEntity("fode_section_headings", []);
  const heading =
    headings.find((h: any) => h.skey === "delivery") || {
      eyebrow: "Delivery Methods",
      heading: "Multi-Modal Learning Delivery",
      blurb: "Students choose the mode that works for their location and circumstances. Most combine multiple methods for best results.",
    };
  const callout = appRows[0] || { icon: "📱", heading: "FODE Mobile App (New 2026)", body: "" };

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-teal-400 text-xs font-bold uppercase tracking-widest">
            {heading.eyebrow}
          </span>
          <h2
            className="text-4xl font-bold text-[#0B2545] mt-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {heading.heading}
          </h2>
          {heading.blurb && (
            <p className="text-gray-500 mt-3 max-w-xl mx-auto text-base leading-relaxed">
              {heading.blurb}
            </p>
          )}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {methods.map((m: any) => (
            <div
              key={m.name}
              className="bg-[#F8F6F1] rounded-xl p-6 border border-gray-100 hover:border-teal-200 hover:shadow-lg transition-all"
            >
              <div className="text-3xl mb-3">{m.icon}</div>
              <h3
                className="text-lg font-bold text-[#0B2545] mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {m.name}
              </h3>
              <p className="text-gray-600 text-sm mb-3">{m.desc}</p>
              <div className="text-teal-600 text-xs font-medium">Available: {m.availability}</div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-teal-50 rounded-xl border border-teal-100">
          <div className="flex items-start gap-4">
            <div className="text-3xl shrink-0">{callout.icon}</div>
            <div>
              <h3
                className="text-xl font-bold text-[#0B2545] mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {callout.heading}
              </h3>
              <p className="text-gray-600 mb-4">{callout.body}</p>
              <ul className="space-y-2 text-gray-700 text-sm grid sm:grid-cols-2">
                {appRows.map((row: any, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-teal-500">•</span> {row.bullet}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function EnrolmentSection() {
  const STEPS_FALLBACK = [
    { step: "01", title: "Choose Your Program", desc: "Grade 10 Upgrade, Grade 12 Upgrade, Matriculation, Adult Literacy, VET Pathway, or Teacher Upgrading. Counsellors available at all centres." },
    { step: "02", title: "Gather Documents", desc: "Birth certificate/ID, previous certificates (if any), passport photos, medical form. Grade 8/10 certs for upgrade programs." },
    { step: "03", title: "Visit Nearest Centre", desc: "12 study centres + 25 correspondence sites. Staff assist with forms, course selection, and material collection. Remote: apply via WhatsApp/phone." },
    { step: "04", title: "Receive Materials", desc: "Full course package: textbooks, workbooks, assignment booklets, study guide, exam timetable. Digital access via app/LMS activated." },
    { step: "05", title: "Start Learning", desc: "Flexible start - begin any week. Tutor assigned. Study plan created. Submit assignments monthly. Attend tutorials as schedule allows." },
  ];
  const DATES_FALLBACK = [
    { label: "Major Intake 1 Opens", date_text: "15 January 2026" },
    { label: "Major Intake 1 Closes", date_text: "31 March 2026" },
    { label: "Grade 10 Exams (FODE)", date_text: "12–16 October 2026" },
    { label: "Grade 12 Exams (FODE)", date_text: "19–23 October 2026" },
    { label: "Major Intake 2 Opens", date_text: "1 July 2026" },
    { label: "Major Intake 2 Closes", date_text: "30 September 2026" },
    { label: "Results Released", date_text: "December 2026" },
    { label: "Continuous Enrolment", date_text: "Year-round (foundation programs)" },
  ];
  const { data: steps } = useEntity("fode_enrolment_steps", STEPS_FALLBACK);
  const { data: dates } = useEntity("fode_key_dates", DATES_FALLBACK);
  const { data: headings } = useEntity("fode_section_headings", []);
  const heading =
    headings.find((h: any) => h.skey === "enrolment") || {
      eyebrow: "How to Enrol",
      heading: "Join Anytime, Study Anywhere",
      blurb: "FODE has continuous enrolment with two main intakes. No age limit. No previous school required for foundation programs.",
    };

  return (
    <section className="bg-[#F8F6F1] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <span className="text-teal-400 text-xs font-bold uppercase tracking-widest">
              {heading.eyebrow}
            </span>
            <h2
              className="text-4xl font-bold text-[#0B2545] mt-2 mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {heading.heading}
            </h2>
            {heading.blurb && <p className="text-gray-600 leading-relaxed mb-8">{heading.blurb}</p>}
            <div className="space-y-6">
              {steps.map((s: any) => (
                <div key={s.step} className="flex gap-4">
                  <div
                    className="w-12 h-12 rounded-full bg-teal-100 text-teal-700 font-bold flex items-center justify-center shrink-0 text-xl"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {s.step}
                  </div>
                  <div>
                    <h3 className="text-[#0B2545] font-semibold">{s.title}</h3>
                    <p className="text-gray-600 text-sm">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <h3
              className="text-2xl font-bold text-[#0B2545] mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              2026 Key Dates
            </h3>
            <div className="space-y-4 mb-6">
              {dates.map((d: any) => (
                <div
                  key={d.label}
                  className="flex items-center justify-between py-3 border-b border-gray-100"
                >
                  <span className="text-gray-700">{d.label}</span>
                  <span className="font-semibold text-teal-700">{d.date_text}</span>
                </div>
              ))}
            </div>
            <Link
              to="/contact"
              className="block w-full text-center bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded transition-colors"
            >
              Start an Enquiry →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function SupportSection() {
  const SUPPORT_FALLBACK = [
    { icon: "👨‍🏫", title: "Dedicated Tutors", desc: "Subject-specialist tutors at each centre; phone/WhatsApp/email support; monthly progress calls" },
    { icon: "📚", title: "Learning Resources", desc: "Full textbook sets, video lessons, past exam papers, marking guides, study planners" },
    { icon: "💰", title: "Financial Support", desc: "Government FODE subsidy (free tuition), travel allowances for exams, device loan scheme" },
    { icon: "🧭", title: "Career & Pathway Guidance", desc: "Grade 12 tertiary applications, VET articulation, resume building, interview prep" },
    { icon: "🤝", title: "Peer Support Networks", desc: "WhatsApp study groups, centre study buddies, alumni mentoring, graduation events" },
    { icon: "🌏", title: "Inclusive Access", desc: "Materials in large print/audio, sign language tutors, disability support officers at main centres" },
  ];
  const CONTACT_FALLBACK = {
    heading: "FODE Helpdesk",
    body: "Enrolment, materials, exams, tutor issues, technical support, pathway advice.",
    phone_label: "Provincial FODE Coordinator",
    phone_value: "+675 641 1234 (ext. 5)",
    email_label: "Email",
    email_value: "fode@mbpeducation.gov.pg",
    whatsapp_label: "WhatsApp Support",
    whatsapp_value: "+675 7XXX XXXX",
    office_label: "Main Centre",
    office_value: "Alotau FODE Centre, Milne Bay",
    button_label: "Contact FODE Team",
    button_href: "/contact",
  };
  const { data: support } = useEntity("fode_support", SUPPORT_FALLBACK);
  const { data: contactRows } = useEntity("fode_support_contact", [CONTACT_FALLBACK]);
  const { data: headings } = useEntity("fode_section_headings", []);
  const contact = { ...CONTACT_FALLBACK, ...(contactRows?.[0] || {}) };
  const heading =
    headings.find((h: any) => h.skey === "support") || {
      eyebrow: "Student Support",
      heading: "Every Learner Supported",
      blurb: "Comprehensive support ensuring distance learners succeed - from enrolment to graduation and beyond.",
    };

  return (
    <section className="bg-[#0B2545] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <span className="text-teal-400 text-xs font-bold uppercase tracking-widest">
              {heading.eyebrow}
            </span>
            <h2
              className="text-4xl font-bold text-white mt-2 mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {heading.heading}
            </h2>
            {heading.blurb && (
              <p className="text-teal-100 leading-relaxed mb-8">{heading.blurb}</p>
            )}
            <div className="space-y-4">
              {support.map((item: any) => (
                <div
                  key={item.title}
                  className="flex gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-teal-400/50 hover:bg-white/10 transition-all"
                >
                  <span className="text-2xl shrink-0">{item.icon}</span>
                  <div>
                    <h3 className="text-white font-semibold">{item.title}</h3>
                    <p className="text-teal-100 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
            <h3
              className="text-2xl font-bold text-white mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {contact.heading}
            </h3>
            <p className="text-teal-100 mb-6">{contact.body}</p>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-white">
                <span className="text-teal-400 text-xl">📞</span>
                <div>
                  <div className="text-sm text-teal-100">{contact.phone_label}</div>
                  <div className="font-semibold">{contact.phone_value}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-white">
                <span className="text-teal-400 text-xl">✉️</span>
                <div>
                  <div className="text-sm text-teal-100">{contact.email_label}</div>
                  <div className="font-semibold">{contact.email_value}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-white">
                <span className="text-teal-400 text-xl">📱</span>
                <div>
                  <div className="text-sm text-teal-100">{contact.whatsapp_label}</div>
                  <div className="font-semibold">{contact.whatsapp_value}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-white">
                <span className="text-teal-400 text-xl">📍</span>
                <div>
                  <div className="text-sm text-teal-100">{contact.office_label}</div>
                  <div className="font-semibold">{contact.office_value}</div>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-white/10">
              <Link
                to={contact.button_href}
                className="inline-flex items-center gap-2 bg-teal-400 hover:bg-teal-500 text-white font-semibold px-6 py-3 rounded transition-colors"
              >
                {contact.button_label} →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InitiativesSection() {
  const INITIATIVES_FALLBACK = [
    { title: "FODE Mobile App Launch", desc: "Offline-first Android app with full curriculum, video lessons, assignment upload, and tutor chat. 2,000+ downloads target for 2026.", icon: "📱", status: "Launched", color: "bg-teal-500" },
    { title: "Satellite Internet for Island Centres", desc: "Starlink terminals at 6 remote island centres (Kiriwina, Losuia, Esa'ala, Samarai, Misima, Rossel). High-speed access for LMS & video calls.", icon: "🛰️", status: "Rolling Out", color: "bg-blue-500" },
    { title: "Radio Education Expansion", desc: "Daily 1-hour slots on NBC Milne Bay. New studio at Alotau Centre. Programs in English & Tok Pisin. Reaches 95% of province.", icon: "📻", status: "Active", color: "bg-amber-500" },
    { title: "Women's Learning Circles", desc: "Safe study spaces for women with childcare. Female tutors. Flexible timing. 40% female enrolment increase since 2024.", icon: "👩‍🎓", status: "Active", color: "bg-pink-500" },
    { title: "Digital Literacy Integration", desc: "Basic ICT module now compulsory in all programs. Computer labs upgraded at all centres. ICDL certification pathway available.", icon: "💻", status: "New", color: "bg-indigo-500" },
    { title: "Tracer Study & Alumni Network", desc: "Annual graduate tracking (employment, further study). Alumni mentorship program. FODE graduates database for provincial workforce planning.", icon: "📊", status: "Active", color: "bg-purple-500" },
  ];
  const { data: initiatives } = useEntity("fode_initiatives", INITIATIVES_FALLBACK);
  const { data: headings } = useEntity("fode_section_headings", []);
  const heading =
    headings.find((h: any) => h.skey === "initiatives") || {
      eyebrow: "Key Initiatives",
      heading: "Innovating Distance Learning",
      blurb: "Strategic programs using technology and community engagement to reach every learner in Milne Bay.",
    };

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-teal-400 text-xs font-bold uppercase tracking-widest">
            {heading.eyebrow}
          </span>
          <h2
            className="text-4xl font-bold text-[#0B2545] mt-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {heading.heading}
          </h2>
          {heading.blurb && (
            <p className="text-gray-500 mt-3 max-w-xl mx-auto text-base leading-relaxed">
              {heading.blurb}
            </p>
          )}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {initiatives.map((i: any) => (
            <div
              key={i.title}
              className="bg-[#F8F6F1] rounded-xl p-6 border border-gray-100 hover:border-teal-200 hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`${i.color} text-white rounded-lg p-2 shrink-0`}>
                  <span className="text-xl">{i.icon}</span>
                </div>
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 bg-white/80 rounded">
                  {i.status}
                </span>
              </div>
              <h3
                className="text-lg font-bold text-[#0B2545] mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {i.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">{i.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DownloadsSection() {
  const DOWNLOADS_FALLBACK = [
    { name: "FODE Prospectus 2026", type: "PDF", size_text: "3.8 MB", category: "Guide" },
    { name: "Course Guides (All Subjects)", type: "PDF", size_text: "15.2 MB", category: "Curriculum" },
    { name: "Enrolment Application Form", type: "PDF", size_text: "580 KB", category: "Forms" },
    { name: "Assignment Submission Guidelines", type: "PDF", size_text: "1.2 MB", category: "Assessment" },
    { name: "Exam Timetable & Centre List 2026", type: "PDF", size_text: "890 KB", category: "Examinations" },
    { name: "Mobile App User Guide", type: "PDF", size_text: "2.4 MB", category: "Digital" },
    { name: "Tutor Handbook & Marking Standards", type: "PDF", size_text: "2.1 MB", category: "Staff" },
    { name: "Graduate Outcomes Report 2024", type: "PDF", size_text: "1.9 MB", category: "Reports" },
  ];
  const { data: downloads } = useEntity("downloads", []);
  const scoped = downloads.filter((d: any) => d.program === "fode");
  const docs = scoped.length ? scoped : DOWNLOADS_FALLBACK;
  const { data: headings } = useEntity("fode_section_headings", []);
  const heading =
    headings.find((h: any) => h.skey === "downloads") || {
      eyebrow: "Resources",
      heading: "Documents & Downloads",
    };

  return (
    <section className="py-16 px-4 bg-[#F8F6F1]">
      <div className="max-w-7xl mx-auto">
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
          <Link
            to="/contact"
            className="text-teal-600 hover:text-teal-800 font-semibold text-sm flex items-center gap-1"
          >
            Request Documents →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {docs.map((doc: any) => (
            <Link
              key={doc.name}
              to="/downloads"
              className="bg-white rounded-xl p-5 border border-gray-100 hover:border-teal-300 hover:shadow-lg transition-all flex items-start gap-4"
            >
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${
                  doc.type === "PDF" ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
                }`}
              >
                <span className="text-xl">{doc.type === "PDF" ? "📄" : "📝"}</span>
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-semibold uppercase tracking-wider text-teal-600">
                  {doc.category}
                </span>
                <h3 className="text-[#0B2545] font-semibold text-sm mt-1 truncate">{doc.name}</h3>
                <div className="text-gray-500 text-xs mt-1">{doc.size_text}</div>
              </div>
              <span className="text-teal-500 shrink-0">→</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const FAQS_FALLBACK = [
    { q: "Is a FODE certificate the same as a regular school certificate?", a: "Yes. FODE students sit the identical Grade 10 and Grade 12 National Examinations as conventional schools. Certificates are issued by the same authority (Measurement Services Division) with no distinction." },
    { q: "Can I study FODE while working full-time?", a: "Absolutely. FODE is designed for flexible, self-paced learning. Many students work full-time. You submit assignments monthly and attend tutorials when your schedule allows. No fixed class times." },
    { q: "How do I get course materials if I live on a remote island?", a: "Materials are shipped to your nearest centre or correspondence site by boat/plane. Digital materials sync via the mobile app when you have internet. Radio lessons broadcast weekly. Tutors visit remote sites quarterly." },
    { q: "What if I fail an assignment or exam?", a: "Assignments can be resubmitted after tutor feedback. Failed exams can be re-sat at the next exam sitting (June or October). No limit on attempts. Tutor support provided for improvement." },
    { q: "Can I transfer from FODE to a regular school?", a: "Yes. Credit transfer is available. Provide your FODE transcripts and certificates. The Division coordinates transfers with the receiving school. Many students do Grade 10 via FODE then enter Grade 11 conventionally." },
    { q: "How much does FODE cost?", a: "Tuition is free under Government FODE subsidy. Students pay only for: exam fees (K50–K100), optional printing, and travel to exam centres. Device loan scheme available for eligible students." },
  ];
  const { data: faqs } = useEntity("fode_faq", FAQS_FALLBACK);
  const { data: headings } = useEntity("fode_section_headings", []);
  const heading =
    headings.find((h: any) => h.skey === "faq") || {
      eyebrow: "Frequently Asked",
      heading: "Common Questions",
    };

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
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
        <div className="space-y-4">
          {faqs.map((faq: any, i: number) => (
            <details
              key={i}
              className="group bg-[#F8F6F1] rounded-xl border border-gray-100 overflow-hidden"
            >
              <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                <h3 className="text-[#0B2545] font-semibold text-base pr-8">{faq.q}</h3>
                <span className="text-teal-400 transition-transform group-open:rotate-180">▼</span>
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

export default function FODEPage() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif" }}>
      <SiteHeader />
      <PageHero />
      <OverviewSection />
      <ProgramsSection />
      <CentresSection />
      <SelectionListsSection />
      <DeliverySection />
      <EnrolmentSection />
      <SupportSection />
      <InitiativesSection />
      <DownloadsSection />
      <FAQSection />
      <SiteFooter />
    </div>
  );
}
