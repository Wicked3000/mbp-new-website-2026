import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { useEntity } from "@/hooks/useDynamic";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

function PageHero() {
  const FALLBACK = {
    eyebrow: "Program 02 - Post Primary",
    title: "Post Primary",
    subtitle: "Grades 9 – 12",
    description:
      "Secondary education pathways preparing students for tertiary admission, technical training, and employment across Milne Bay's 24 secondary and national high schools.",
    banner: "/assets/education_programs/post/banner.jpg",
    alt: "Secondary school students",
  };
  const { data } = useEntity("post_hero", [FALLBACK]);
  const hero = { ...FALLBACK, ...(data?.[0] || {}) };
  return (
    <section className="relative h-[400px] sm:h-[480px] overflow-hidden bg-[#163663]">
      <img decoding="async"
        src={hero.banner}
        alt={hero.alt}
        className="absolute inset-0 w-full h-full object-cover object-center opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#163663]/90 via-[#163663]/70 to-[#0B2545]/40" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 h-full flex flex-col justify-center">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
            {hero.eyebrow}
          </div>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-5"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {hero.title}
            <span className="block text-amber-400">{hero.subtitle}</span>
          </h1>
          <p className="text-amber-100 text-lg leading-relaxed max-w-2xl">
            {hero.description}
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
            <Link
              to="#overview"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-[#0B2545] font-semibold px-6 py-3 rounded transition-colors"
            >
              Overview
            </Link>
            <Link
              to="#schools"
              className="inline-flex items-center gap-2 border border-amber-400 text-amber-300 hover:bg-amber-400/10 hover:text-white font-semibold px-6 py-3 rounded transition-colors"
            >
              Find Schools
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
    heading: "Pathways to Future Success",
    intro:
      "Post Primary Education in Milne Bay covers Grades 9–12, providing critical pathways for students transitioning from basic education. The Division oversees 24 secondary and national high schools serving 13,000+ students.",
    body: "Students can choose from academic streams leading to university, technical pathways into VET, or flexible learning through FODE. Our schools span urban centers and remote districts, with boarding facilities at key locations.",
    features_title: "Key Features",
  };
  const CARDS_FALLBACK = [
    {
      icon: "🎓",
      title: "Lower Secondary (Grades 9–10)",
      desc: "Broad curriculum with core subjects plus electives; Grade 10 National Examination for certification",
    },
    {
      icon: "🏫",
      title: "Upper Secondary (Grades 11–12)",
      desc: "Specialised streams: Science, Humanities, Business, Technical; Grade 12 Exam for tertiary entry",
    },
    {
      icon: "🔬",
      title: "STEM Focus Schools",
      desc: "Enhanced science & mathematics at Cameron & Alotau Secondary for university pathways",
    },
    {
      icon: "🛠️",
      title: "Technical Secondary",
      desc: "Trade-focused curriculum at selected schools with VET articulation pathways",
    },
  ];
  const FEATURES_FALLBACK = [
    { feature: "Free tuition under Government TFF policy (Grades 9–12)" },
    { feature: "National curriculum with provincial contextualization" },
    { feature: "Grade 10 & 12 National Examinations" },
    { feature: "School-based assessment contributing to final grades" },
    { feature: "Career guidance & tertiary application support" },
    { feature: "Boarding facilities at 8 provincial high schools" },
  ];
  const STATS_FALLBACK = [
    { value_text: "24", label: "Schools", color: "bg-[#163663]" },
    { value_text: "13,200+", label: "Students", color: "bg-[#0B2545]" },
    { value_text: "420", label: "Teachers", color: "bg-amber-600" },
    { value_text: "8", label: "Boarding Schools", color: "bg-amber-700" },
  ];

  const { data: overviewRows } = useEntity("post_overview", [OVERVIEW_FALLBACK]);
  const { data: cards } = useEntity("post_overview_cards", CARDS_FALLBACK);
  const { data: features } = useEntity("post_overview_features", FEATURES_FALLBACK);
  const { data: stats } = useEntity("post_overview_stats", STATS_FALLBACK);
  const overview = { ...OVERVIEW_FALLBACK, ...(overviewRows?.[0] || {}) };

  return (
    <section id="overview" className="bg-[#F8F6F1] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <span className="text-amber-500 text-xs font-bold uppercase tracking-widest">
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
                  className="flex gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-amber-200 hover:shadow-md transition-all"
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
                src="/assets/education_programs/post/banner.jpg"
                alt="Science lab"
                className="w-full h-64 object-cover"
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
                      <span className="text-amber-400 shrink-0">✓</span>
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
                  <div className="text-amber-100 text-sm uppercase tracking-wider">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CurriculumSection() {
  const STREAMS_FALLBACK = [
    {
      name: "Science Stream",
      grades: "11–12",
      subjects: "Physics, Chemistry, Biology, Adv. Math, English, ICT",
      icon: "🔬",
      color: "bg-blue-500",
    },
    {
      name: "Humanities Stream",
      grades: "11–12",
      subjects: "History, Geography, Economics, Legal Studies, English, Language",
      icon: "📜",
      color: "bg-green-500",
    },
    {
      name: "Business Stream",
      grades: "11–12",
      subjects: "Accounting, Business Studies, Economics, Math, English, ICT",
      icon: "💼",
      color: "bg-purple-500",
    },
    {
      name: "Technical Stream",
      grades: "11–12",
      subjects: "Tech Drawing, Applied Tech, Math, English, Physics, VET modules",
      icon: "⚙️",
      color: "bg-orange-500",
    },
    {
      name: "Core Subjects (Gr 9–10)",
      grades: "9–10",
      subjects: "English, Math, Science, Social Science, Personal Dev, Making a Living",
      icon: "📚",
      color: "bg-teal-500",
    },
    {
      name: "Electives (Gr 9–10)",
      grades: "9–10",
      subjects: "Agriculture, Home Economics, Design Tech, ICT, Visual Arts, Music",
      icon: "🎨",
      color: "bg-pink-500",
    },
    {
      name: "Flexible Learning (FODE)",
      grades: "9–12",
      subjects: "All streams via distance mode; same curriculum & examinations",
      icon: "💻",
      color: "bg-indigo-500",
    },
    {
      name: "Career Education",
      grades: "9–12",
      subjects: "Career planning, tertiary applications, work experience, life skills",
      icon: "🎯",
      color: "bg-cyan-500",
    },
  ];
  const ASSESSMENT_FALLBACK = [
    { icon: "📋", heading: "Assessment & Certification", bullet: "Grade 10 National Exam: English, Math, Science, Social Science, Personal Development" },
    { icon: "📋", heading: "Assessment & Certification", bullet: "Grade 12 National Exam: Stream-specific subjects (5–6 papers per stream)" },
    { icon: "📋", heading: "Assessment & Certification", bullet: "School-based assessment (30%) + National exam (70%) = Final grade" },
    { icon: "📋", heading: "Assessment & Certification", bullet: "Certificates: Grade 10 Certificate, Higher School Certificate (Grade 12)" },
    { icon: "📋", heading: "Assessment & Certification", bullet: "Tertiary entry via Grade 12 results + STAT-P for universities" },
  ];
  const { data: streams } = useEntity("post_streams", STREAMS_FALLBACK);
  const { data: assessment } = useEntity("post_assessment", ASSESSMENT_FALLBACK);
  const { data: headings } = useEntity("post_section_headings", []);
  const heading =
    headings.find((h: any) => h.skey === "curriculum") || {
      eyebrow: "Curriculum & Streams",
      heading: "Diverse Learning Pathways",
      blurb: "Students choose streams at Grade 11 based on Grade 10 results, interests, and career goals. All streams meet national certification requirements.",
    };
  // The callout rendered its icon and heading once, above the bullet list, so
  // they are taken from the first row rather than repeated per bullet.
  const assessmentHead = assessment[0] || { icon: "📋", heading: "Assessment & Certification" };

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-amber-500 text-xs font-bold uppercase tracking-widest">
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {streams.map((s: any) => (
            <div
              key={s.name}
              className="bg-[#F8F6F1] rounded-xl p-6 border border-gray-100 hover:border-amber-300 hover:shadow-lg transition-all"
            >
              <div className={`${s.color} text-white rounded-lg p-2 inline-block mb-3`}>
                <span className="text-xl">{s.icon}</span>
              </div>
              <div
                className="text-[#0B2545] font-bold mb-1"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {s.name}
              </div>
              <div className="text-amber-600 text-xs font-semibold uppercase tracking-wider mb-2">
                Grades {s.grades}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{s.subjects}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-amber-50 rounded-xl border border-amber-100">
          <div className="flex items-start gap-4">
            <div className="text-3xl shrink-0">{assessmentHead.icon}</div>
            <div>
              <h3
                className="text-xl font-bold text-[#0B2545] mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {assessmentHead.heading}
              </h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                {assessment.map((row: any, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-500">•</span> {row.bullet}
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

// Selection lists hold minors' names, so there is deliberately no bundled
// copy: the rows come from the selection_students table, which the API
// restricts to authenticated admins. The section renders an empty state
// until an admin adds students through /admin/selections.

type SelectionStudent = {
  id?: number;
  grade_level: number | string;
  school: string;
  position_no?: number | string | null;
  primary_school?: string;
  surname?: string;
  first_name?: string;
  gender?: string;
  student_name?: string;
  slf_no?: string;
  transferred_from?: string;
};

const FALLBACK_SELECTION_STUDENTS: SelectionStudent[] = [];

function SchoolsSection() {
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
      <div className="max-w-7xl mx-auto">
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
                        ✓ Boarding
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
      </div>
    </section>
  );
}

function SelectionListsSection() {
  const [students, setStudents] = useState<SelectionStudent[]>(FALLBACK_SELECTION_STUDENTS);

  useEffect(() => {
    let active = true;
    api
      .list("selection_students")
      .then((rows) => {
        if (!active || !rows.length) return;
        setStudents((current) => {
          const managedGrade9 = rows.filter(
            (row: SelectionStudent) => Number(row.grade_level) === 9,
          );
          const managedGrade11 = rows.filter(
            (row: SelectionStudent) => Number(row.grade_level) === 11,
          );
          return [
            ...(managedGrade9.length
              ? managedGrade9
              : current.filter((row) => Number(row.grade_level) === 9)),
            ...(managedGrade11.length
              ? managedGrade11
              : current.filter((row) => Number(row.grade_level) === 11)),
          ];
        });
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  // The per-student rows above are admin-only, so a public visitor always sees
  // none. School-level placements are public, so the published figures come from
  // selections_grade9 / selections_grade11 instead of counting name rows.
  const { data: placed9 } = useEntity("selections_grade9", []);
  const { data: placed11 } = useEntity("selections_grade11", []);
  const published9 = (placed9 as any[]).filter((r) => Number(r.placed) > 0);
  const published11 = (placed11 as any[]).filter((r) => Number(r.placed) > 0);

  const grade9Data = useMemo(() => {
    const grouped: Record<string, SelectionStudent[]> = {};
    students
      .filter((student) => Number(student.grade_level) === 9)
      .sort((a, b) => Number(a.position_no || 0) - Number(b.position_no || 0))
      .forEach((student) => {
        grouped[student.school] = grouped[student.school] || [];
        grouped[student.school].push(student);
      });
    return grouped;
  }, [students]);

  const grade11Data = useMemo(() => {
    const grouped: Record<string, SelectionStudent[]> = {};
    students
      .filter((student) => Number(student.grade_level) === 11)
      .sort((a, b) => Number(a.position_no || 0) - Number(b.position_no || 0))
      .forEach((student) => {
        grouped[student.school] = grouped[student.school] || [];
        grouped[student.school].push(student);
      });
    return grouped;
  }, [students]);

  const grade9Schools = Object.keys(grade9Data).sort((a, b) => a.localeCompare(b));
  const grade11Schools = Object.keys(grade11Data).sort((a, b) => a.localeCompare(b));

  return (
    <section id="selections" className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <span className="text-amber-500 text-xs font-bold uppercase tracking-widest">
            2026 Selection Lists
          </span>
          <h2
            className="text-4xl font-bold text-[#0B2545] mt-2 mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Grade 9 & 11 Placement Lists
          </h2>
          <p className="text-gray-500">
            Official 2026 selection lists for Milne Bay Province. Published placements per school are
            shown below; individual student names are not published on this site.
          </p>
        </div>

        {(published9.length > 0 || published11.length > 0) && (
          <div className="mb-10 rounded-2xl border border-gray-100 bg-[#F8F6F1] p-6">
            <h3 className="text-lg font-bold text-[#0B2545] mb-4">Published placements by school</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500">
                    <th className="px-3 py-2 font-semibold">School</th>
                    <th className="px-3 py-2 font-semibold">Grade</th>
                    <th className="px-3 py-2 font-semibold">District</th>
                    <th className="px-3 py-2 font-semibold text-right">Capacity</th>
                    <th className="px-3 py-2 font-semibold text-right">Placed</th>
                    <th className="px-3 py-2 font-semibold text-right">Cut-off</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ...published9.map((r) => ({ ...r, grade: 9 })),
                    ...published11.map((r) => ({ ...r, grade: 11 })),
                  ].map((r, i) => (
                    <tr key={`${r.grade}-${r.school}-${i}`} className="border-t border-gray-200/70">
                      <td className="px-3 py-2 font-medium text-[#0B2545]">{r.school}</td>
                      <td className="px-3 py-2 text-gray-700">{r.grade}</td>
                      <td className="px-3 py-2 text-gray-700">{r.district}</td>
                      <td className="px-3 py-2 text-right text-gray-700">{r.capacity}</td>
                      <td className="px-3 py-2 text-right font-semibold text-amber-700">
                        {r.placed}
                      </td>
                      <td className="px-3 py-2 text-right text-gray-700">{r.cutoff}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Schools whose placements are still being finalised are not listed. Figures are updated
              as each district confirms its results.
            </p>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <h3
              className="text-2xl font-bold text-[#0B2545] mb-6 flex items-center gap-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              <span className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                9
              </span>
              Grade 9 Placement Summary ({published9.length} published)
            </h3>
            <div className="space-y-3">
              {grade9Schools.map((school) => (
                <details
                  key={school}
                  className="group bg-[#F8F6F1] rounded-xl border border-gray-100 overflow-hidden"
                >
                  <summary className="flex items-center justify-between p-4 cursor-pointer list-none">
                    <h4 className="font-semibold text-[#0B2545] pr-8">{school}</h4>
                    <span className="text-amber-500 transition-transform group-open:rotate-180">
                      ▼
                    </span>
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
                          {(grade9Data[school] || []).map((student, i) => (
                            <tr
                              key={i}
                              className={`border-b ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                            >
                              <td className="px-3 py-2 text-center text-gray-700">
                                {student.position_no || "-"}
                              </td>
                              <td className="px-3 py-2 text-gray-700">
                                {student.primary_school || "-"}
                              </td>
                              <td className="px-3 py-2 font-medium text-[#0B2545]">
                                {student.surname}
                              </td>
                              <td className="px-3 py-2 text-gray-700">
                                {student.first_name || "-"}
                              </td>
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
                    {(grade9Data[school] || []).length === 0 && (
                      <p className="text-gray-500 text-sm py-4 text-center">
                        Data not yet available for this school
                      </p>
                    )}
                    <div className="mt-3 text-right">
                      <Link
                        to="/selections"
                        className="text-amber-600 hover:text-amber-800 text-sm font-medium"
                      >
                        View Selection Lists →
                      </Link>
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </div>

          <div>
            <h3
              className="text-2xl font-bold text-[#0B2545] mb-6 flex items-center gap-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              <span className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-sm">
                11
              </span>
              Grade 11 Placement Summary ({published11.length} published)
            </h3>
            <div className="space-y-3">
              {grade11Schools.map((school) => (
                <details
                  key={school}
                  className="group bg-[#F8F6F1] rounded-xl border border-gray-100 overflow-hidden"
                >
                  <summary className="flex items-center justify-between p-4 cursor-pointer list-none">
                    <h4 className="font-semibold text-[#0B2545] pr-8">{school}</h4>
                    <span className="text-amber-500 transition-transform group-open:rotate-180">
                      ▼
                    </span>
                  </summary>
                  <div className="px-4 pb-4 pt-0 border-t border-gray-200">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-[#163663] text-white text-left">
                            <th className="px-3 py-2 font-semibold">NAME</th>
                            <th className="px-3 py-2 font-semibold w-20">GENDER</th>
                            <th className="px-3 py-2 font-semibold">SLF NO</th>
                            <th className="px-3 py-2 font-semibold">TRANSFERRED FROM</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(grade11Data[school] || []).map((student, i) => (
                            <tr
                              key={i}
                              className={`border-b ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                            >
                              <td className="px-3 py-2 font-medium text-[#0B2545]">
                                {student.student_name || "-"}
                              </td>
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
                              <td className="px-3 py-2 font-mono text-gray-700">
                                {student.slf_no || "-"}
                              </td>
                              <td className="px-3 py-2 text-gray-600">
                                {student.transferred_from || "-"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {(grade11Data[school] || []).length === 0 && (
                      <p className="text-gray-500 text-sm py-4 text-center">
                        Data not yet available for this school
                      </p>
                    )}
                    <div className="mt-3 text-right">
                      <Link
                        to="/selections"
                        className="text-amber-600 hover:text-amber-800 text-sm font-medium"
                      >
                        View Selection Lists →
                      </Link>
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 p-6 bg-amber-50 rounded-xl border border-amber-100 text-center">
          <h3
            className="text-lg font-bold text-[#0B2545] mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Need the complete lists?
          </h3>
          <p className="text-gray-600 mb-4">
            Full PDF downloads with all students for each school are available.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/selections"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-5 py-2.5 rounded transition-colors"
            >
              View Grade 9 Lists
            </Link>
            <Link
              to="/selections"
              className="inline-flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold px-5 py-2.5 rounded transition-colors"
            >
              View Grade 11 Lists
            </Link>
            <Link
              to="/selections"
              className="inline-flex items-center gap-2 border border-amber-500 text-amber-600 hover:bg-amber-50 font-semibold px-5 py-2.5 rounded transition-colors"
            >
              View Summary Tables →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function PathwaysSection() {
  const PATHWAYS_FALLBACK = [
    {
      title: "University Entrance",
      desc: "Grade 12 Higher School Certificate with required subject combinations for UPNG, DWU, PAU, and overseas universities. STAT-P testing available.",
      icon: "🎓",
      color: "bg-blue-500",
      stats: "65% of Grade 12 grads",
    },
    {
      title: "Technical & VET Articulation",
      desc: "Direct entry into VET certificate/diploma programs. Technical stream students receive credit recognition. Partnerships with 4 provincial VET centres.",
      icon: "🔧",
      color: "bg-orange-500",
      stats: "20% transition to VET",
    },
    {
      title: "Teacher Education",
      desc: "Primary teacher training at PNGEI & DWU. Secondary teacher education at UPNG & DWU. Division coordinates selections annually.",
      icon: "👨‍🏫",
      color: "bg-green-500",
      stats: "120+ teachers/year",
    },
    {
      title: "Health & Nursing",
      desc: "Entry to nursing colleges (St. Mary's, Mendi, Lae) and community health worker programs. Science stream prerequisite.",
      icon: "🏥",
      color: "bg-red-500",
      stats: "80+ health workers/yr",
    },
    {
      title: "Police & Defence Forces",
      desc: "Grade 12 certificate minimum for officer cadet programs. Physical fitness & leadership from school programs valued.",
      icon: "🛡️",
      color: "bg-gray-700",
      stats: "40+ recruits/year",
    },
    {
      title: "Maritime & Fisheries",
      desc: "National Fisheries College & maritime training. Island district students given priority. Business/Technical streams relevant.",
      icon: "⚓",
      color: "bg-cyan-500",
      stats: "25+ cadets/year",
    },
    {
      title: "Agriculture & Rural Dev",
      desc: "University of Natural Resources (UNRE) & agriculture colleges. Making a Living subject provides foundation.",
      icon: "🌱",
      color: "bg-lime-600",
      stats: "30+ agriculture students",
    },
    {
      title: "FODE & Distance Upgrading",
      desc: "Grade 10/12 upgrades via FODE for missed exams or improved marks. Flexible for working students.",
      icon: "📚",
      color: "bg-indigo-500",
      stats: "500+ FODE enrolments",
    },
  ];
  const { data: pathways } = useEntity("post_pathways", PATHWAYS_FALLBACK);
  const { data: headings } = useEntity("post_section_headings", []);
  const heading =
    headings.find((h: any) => h.skey === "pathways") || {
      eyebrow: "Post-Grade 12 Pathways",
      heading: "Where Our Students Go",
      blurb: "Post Primary education opens multiple pathways. The Division tracks graduate destinations to align programs with provincial workforce needs.",
    };

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-amber-500 text-xs font-bold uppercase tracking-widest">
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pathways.map((p: any) => (
            <div
              key={p.title}
              className="bg-[#F8F6F1] rounded-xl p-6 border border-gray-100 hover:border-amber-200 hover:shadow-lg transition-all"
            >
              <div className={`${p.color} text-white rounded-lg p-2 inline-block mb-3`}>
                <span className="text-xl">{p.icon}</span>
              </div>
              <h3
                className="text-lg font-bold text-[#0B2545] mb-1"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {p.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">{p.desc}</p>
              <div className="text-amber-600 text-xs font-semibold">{p.stats}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function InitiativesSection() {
  const INITIATIVES_FALLBACK = [
    {
      title: "STEM Excellence Program",
      desc: "Enhanced labs, specialist teachers, and industry partnerships at Cameron & Alotau Secondary. Target: 50% Science stream enrolment.",
      icon: "🔬",
      status: "Active",
      color: "bg-blue-500",
    },
    {
      title: "Grade 12 Exam Preparation",
      desc: "Holiday revision camps, past paper workshops, and online resources. 2025 pass rate target: 85%+ across all streams.",
      icon: "📝",
      status: "Active",
      color: "bg-green-500",
    },
    {
      title: "Career Guidance Expansion",
      desc: "Trained career counsellors in 15 schools. Annual Provincial Career Expo. Tertiary application workshops for all Grade 12s.",
      icon: "🎯",
      status: "Scaling",
      color: "bg-amber-500",
    },
    {
      title: "Boarding Facility Upgrades",
      desc: "K2.5M investment in dormitory renovations, water/sanitation, and dining facilities at 8 boarding schools (2024–2026).",
      icon: "🏠",
      status: "Active",
      color: "bg-teal-500",
    },
    {
      title: "Digital Learning Platforms",
      desc: "Moodle LMS deployment at 10 schools. Offline content servers for remote schools. Teacher training in blended delivery.",
      icon: "💻",
      status: "Pilot",
      color: "bg-purple-500",
    },
    {
      title: "School-Based Assessment Quality",
      desc: "Standardised SBA moderation across all 24 schools. External marker calibration. Data-driven intervention for at-risk students.",
      icon: "📊",
      status: "Active",
      color: "bg-indigo-500",
    },
  ];
  const { data: initiatives } = useEntity("post_initiatives", INITIATIVES_FALLBACK);
  const { data: headings } = useEntity("post_section_headings", []);
  const heading =
    headings.find((h: any) => h.skey === "initiatives") || {
      eyebrow: "Key Initiatives",
      heading: "Driving Quality & Access",
      blurb: "Targeted programs improving outcomes, expanding pathways, and modernizing secondary education across the province.",
    };

  return (
    <section className="bg-[#F8F6F1] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-amber-500 text-xs font-bold uppercase tracking-widest">
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
              className="bg-white rounded-xl p-6 border border-gray-100 hover:border-amber-200 hover:shadow-lg transition-all"
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

function SupportSection() {
  const SUPPORT_FALLBACK = [
    {
      icon: "📄",
      title: "Curriculum & Exam Resources",
      desc: "Syllabuses, exam specs, past papers, marking guides distributed annually",
    },
    {
      icon: "🏗️",
      title: "Infrastructure & Maintenance",
      desc: "TFF infrastructure component, SLIP grants, boarding facility funding",
    },
    {
      icon: "👨‍🏫",
      title: "Teacher Development",
      desc: "In-service training, subject panels, HOD leadership programs, certification",
    },
    {
      icon: "📊",
      title: "Data & Quality Assurance",
      desc: "EMIS, school inspections, exam analysis, performance dashboards",
    },
    {
      icon: "🎓",
      title: "Student Support Services",
      desc: "Career guidance, counselling, scholarship info, tertiary applications",
    },
    {
      icon: "🚨",
      title: "Emergency & Resilience",
      desc: "Disaster recovery, psychosocial support, temporary learning spaces",
    },
  ];
  const CONTACT_FALLBACK = {
    heading: "Post Primary Helpdesk",
    body: "Assistance with enrolments, subject selection, exam queries, tertiary applications, and school transfers.",
    phone_label: "Provincial Post Primary Officer",
    phone_value: "+675 641 1234 (ext. 3)",
    email_label: "Email",
    email_value: "post.primary@mbpeducation.gov.pg",
    office_label: "Office",
    office_value: "Division of Education, Alotau",
    button_label: "Submit Enquiry",
    button_href: "/contact",
  };
  const { data: support } = useEntity("post_support", SUPPORT_FALLBACK);
  const { data: contactRows } = useEntity("post_support_contact", [CONTACT_FALLBACK]);
  const { data: headings } = useEntity("post_section_headings", []);
  const contact = { ...CONTACT_FALLBACK, ...(contactRows?.[0] || {}) };
  const heading =
    headings.find((h: any) => h.skey === "support") || {
      eyebrow: "Support & Resources",
      heading: "Empowering Schools & Students",
      blurb: "Comprehensive support ensuring every secondary school delivers quality education and every student can access their chosen pathway.",
    };

  return (
    <section className="bg-[#163663] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">
              {heading.eyebrow}
            </span>
            <h2
              className="text-4xl font-bold text-white mt-2 mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {heading.heading}
            </h2>
            {heading.blurb && (
              <p className="text-amber-100 leading-relaxed mb-8">{heading.blurb}</p>
            )}
            <div className="space-y-4">
              {support.map((item: any) => (
                <div
                  key={item.title}
                  className="flex gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-amber-500/50 hover:bg-white/10 transition-all"
                >
                  <span className="text-2xl shrink-0">{item.icon}</span>
                  <div>
                    <h3 className="text-white font-semibold">{item.title}</h3>
                    <p className="text-amber-200 text-sm">{item.desc}</p>
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
            <p className="text-amber-200 mb-6">{contact.body}</p>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-white">
                <span className="text-amber-400 text-xl">📞</span>
                <div>
                  <div className="text-sm text-amber-200">{contact.phone_label}</div>
                  <div className="font-semibold">{contact.phone_value}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-white">
                <span className="text-amber-400 text-xl">✉️</span>
                <div>
                  <div className="text-sm text-amber-200">{contact.email_label}</div>
                  <div className="font-semibold">{contact.email_value}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-white">
                <span className="text-amber-400 text-xl">📍</span>
                <div>
                  <div className="text-sm text-amber-200">{contact.office_label}</div>
                  <div className="font-semibold">{contact.office_value}</div>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-white/10">
              <Link
                to={contact.button_href}
                className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-[#0B2545] font-semibold px-6 py-3 rounded transition-colors"
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

function DownloadsSection() {
  const DOWNLOADS_FALLBACK = [
    { name: "2026 Grade 9 Selection List", type: "PDF", size_text: "2.4 MB", category: "Selection Lists" },
    { name: "2026 Grade 11 Selection List", type: "PDF", size_text: "3.1 MB", category: "Selection Lists" },
    { name: "Post Primary Handbook 2026", type: "PDF", size_text: "3.1 MB", category: "Policy" },
    { name: "Grade 10 & 12 Exam Specifications", type: "PDF", size_text: "4.2 MB", category: "Assessment" },
    { name: "Stream Selection Guidelines", type: "PDF", size_text: "1.8 MB", category: "Guidance" },
    { name: "Secondary Curriculum: Grades 9–12", type: "PDF", size_text: "22.4 MB", category: "Curriculum" },
    { name: "School Learning Improvement Plan Template", type: "DOCX", size_text: "920 KB", category: "Planning" },
    { name: "Career Guidance Resource Kit", type: "PDF", size_text: "5.6 MB", category: "Guidance" },
    { name: "Boarding School Standards", type: "PDF", size_text: "2.7 MB", category: "Infrastructure" },
    { name: "Teacher Subject Panel Minutes 2025", type: "PDF", size_text: "1.4 MB", category: "Professional Dev" },
  ];
  const { data: downloads } = useEntity("downloads", []);
  // The downloads table is shared with /downloads and /basic; this section shows
  // only the documents scoped to Post Primary.
  const scoped = downloads.filter((d: any) => d.program === "post");
  const docs = scoped.length ? scoped : DOWNLOADS_FALLBACK;
  const { data: headings } = useEntity("post_section_headings", []);
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
            <span className="text-amber-500 text-xs font-bold uppercase tracking-widest">
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
            className="text-amber-600 hover:text-amber-800 font-semibold text-sm flex items-center gap-1"
          >
            Request Documents →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {docs.map((doc: any) => (
            <Link
              key={doc.name}
              to="/downloads"
              className="bg-white rounded-xl p-5 border border-gray-100 hover:border-amber-300 hover:shadow-lg transition-all flex items-start gap-4"
            >
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${
                  doc.type === "PDF" ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
                }`}
              >
                <span className="text-xl">{doc.type === "PDF" ? "📄" : "📝"}</span>
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-600">
                  {doc.category}
                </span>
                <h3 className="text-[#0B2545] font-semibold text-sm mt-1 truncate">{doc.name}</h3>
                <div className="text-gray-500 text-xs mt-1">{doc.size_text}</div>
              </div>
              <span className="text-amber-500 shrink-0">→</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const FAQS_FALLBACK = [
    {
      q: "How does my child get into a secondary school?",
      a: "Placement is based on Grade 8 Examination results. Students apply through the national online selection system (Grade 9 Selection). The Division manages provincial quotas for each school.",
    },
    {
      q: "What is the difference between National High and Provincial High schools?",
      a: "National High Schools (e.g., Cameron) are centrally funded, selective entry, and offer all streams. Provincial High Schools are provincially funded, serve local catchments, and may offer limited streams based on resources.",
    },
    {
      q: "Can my child change streams in Grade 11?",
      a: "Stream changes are possible in the first 4 weeks of Grade 11 with principal approval and subject teacher assessment. After this, changes are not permitted due to assessment requirements.",
    },
    {
      q: "What if my child fails the Grade 10 Exam?",
      a: "Students can repeat Grade 10 at their school, enrol in FODE to upgrade, or enter VET certificate programs. The Division provides counselling on alternative pathways.",
    },
    {
      q: "Are there scholarships for Grade 12 graduates?",
      a: "Yes: TESAS (tertiary), HECAS, and provincial government scholarships. The Division coordinates nominations. Criteria: academic merit, financial need, priority workforce areas.",
    },
    {
      q: "How do I get my Grade 12 certificate reissued?",
      a: "Apply through Measurement Services Division (NDoE) with statutory declaration, police report (if lost), and K30 fee. Processing: 4–6 weeks. Contact Post Primary helpdesk for assistance.",
    },
  ];
  const { data: faqs } = useEntity("post_faq", FAQS_FALLBACK);
  const { data: headings } = useEntity("post_section_headings", []);
  const heading =
    headings.find((h: any) => h.skey === "faq") || {
      eyebrow: "Frequently Asked",
      heading: "Common Questions",
    };

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-amber-500 text-xs font-bold uppercase tracking-widest">
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
                <span className="text-amber-500 transition-transform group-open:rotate-180">▼</span>
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

export default function PostPrimaryPage() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif" }}>
      <SiteHeader />
      <PageHero />
      <OverviewSection />
      <CurriculumSection />
      <SchoolsSection />
      <SelectionListsSection />
      <PathwaysSection />
      <InitiativesSection />
      <SupportSection />
      <DownloadsSection />
      <FAQSection />
      <SiteFooter />
    </div>
  );
}
