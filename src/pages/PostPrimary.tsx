import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

function PageHero() {
  return (
    <section className="relative h-[400px] sm:h-[480px] overflow-hidden bg-[#163663]">
      <img
        src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1600&h=900&fit=crop&auto=format"
        alt="Secondary school students"
        className="absolute inset-0 w-full h-full object-cover object-center opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#163663]/90 via-[#163663]/70 to-[#0B2545]/40" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 h-full flex flex-col justify-center">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
            Program 02 - Post Primary
          </div>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-5"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Post Primary
            <span className="block text-amber-400">Grades 9 – 12</span>
          </h1>
          <p className="text-amber-100 text-lg leading-relaxed max-w-2xl">
            Secondary education pathways preparing students for tertiary admission, technical
            training, and employment across Milne Bay's 24 secondary and national high schools.
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
  return (
    <section id="overview" className="bg-[#F8F6F1] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <span className="text-amber-500 text-xs font-bold uppercase tracking-widest">
              Program Overview
            </span>
            <h2
              className="text-4xl font-bold text-[#0B2545] mt-2 mb-6 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Pathways to Future Success
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4 text-lg">
              Post Primary Education in Milne Bay covers Grades 9–12, providing critical pathways
              for students transitioning from basic education. The Division oversees 24 secondary
              and national high schools serving 13,000+ students.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              Students can choose from academic streams leading to university, technical pathways
              into VET, or flexible learning through FODE. Our schools span urban centers and remote
              districts, with boarding facilities at key locations.
            </p>
            <div className="space-y-4">
              {[
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
              ].map((item) => (
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
              <img
                src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=500&fit=crop&auto=format"
                alt="Science lab"
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3
                  className="text-xl font-bold text-[#0B2545] mb-3"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Key Features
                </h3>
                <ul className="space-y-3">
                  {[
                    "Free tuition under Government TFF policy (Grades 9–12)",
                    "National curriculum with provincial contextualization",
                    "Grade 10 & 12 National Examinations",
                    "School-based assessment contributing to final grades",
                    "Career guidance & tertiary application support",
                    "Boarding facilities at 8 provincial high schools",
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm">
                      <span className="text-amber-400 shrink-0">✓</span>
                      <span className="text-gray-700">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { value: "24", label: "Schools", color: "bg-[#163663]" },
                { value: "13,200+", label: "Students", color: "bg-[#0B2545]" },
                { value: "420", label: "Teachers", color: "bg-amber-600" },
                {
                  value: "8",
                  label: "Boarding Schools",
                  color: "bg-amber-700",
                },
              ].map((s) => (
                <div key={s.label} className={`${s.color} rounded-xl p-5 text-white text-center`}>
                  <div
                    className="text-3xl font-bold"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {s.value}
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
  const STREAMS = [
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

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-amber-500 text-xs font-bold uppercase tracking-widest">
            Curriculum & Streams
          </span>
          <h2
            className="text-4xl font-bold text-[#0B2545] mt-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Diverse Learning Pathways
          </h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto text-base leading-relaxed">
            Students choose streams at Grade 11 based on Grade 10 results, interests, and career
            goals. All streams meet national certification requirements.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STREAMS.map((s) => (
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
            <div className="text-3xl shrink-0">📋</div>
            <div>
              <h3
                className="text-xl font-bold text-[#0B2545] mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Assessment & Certification
              </h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">•</span> Grade 10 National Exam: English, Math,
                  Science, Social Science, Personal Development
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">•</span> Grade 12 National Exam: Stream-specific
                  subjects (5–6 papers per stream)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">•</span> School-based assessment (30%) + National
                  exam (70%) = Final grade
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">•</span> Certificates: Grade 10 Certificate,
                  Higher School Certificate (Grade 12)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">•</span> Tertiary entry via Grade 12 results +
                  STAT-P for universities
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const GRADE9_DATA: Record<
  string,
  {
    no: number;
    primary: string;
    surname: string;
    firstName: string;
    gender: string;
  }[]
> = {
  "Cameron Secondary School": [
    {
      no: 1,
      primary: "ALOTAU",
      surname: "GUMBAL",
      firstName: "SHANNON",
      gender: "F",
    },
    {
      no: 2,
      primary: "ALOTAU",
      surname: "PAIVA",
      firstName: "KIVU",
      gender: "F",
    },
    {
      no: 3,
      primary: "ALOTAU",
      surname: "MOABE",
      firstName: "JESHARELLA",
      gender: "F",
    },
    {
      no: 4,
      primary: "ALOTAU",
      surname: "GAWA",
      firstName: "JACKIE MARIE",
      gender: "M",
    },
    {
      no: 5,
      primary: "ALOTAU",
      surname: "TAU",
      firstName: "ELIZABETH",
      gender: "F",
    },
    {
      no: 6,
      primary: "ALOTAU",
      surname: "WARA",
      firstName: "MICHAEL",
      gender: "M",
    },
    {
      no: 7,
      primary: "ALOTAU",
      surname: "KILA",
      firstName: "GRACE",
      gender: "F",
    },
    {
      no: 8,
      primary: "ALOTAU",
      surname: "MOSE",
      firstName: "DAVID",
      gender: "M",
    },
    {
      no: 9,
      primary: "ALOTAU",
      surname: "TARI",
      firstName: "MARGARET",
      gender: "F",
    },
    {
      no: 10,
      primary: "ALOTAU",
      surname: "BORO",
      firstName: "JOHN",
      gender: "M",
    },
  ],
  "Cape Vogel High School": [
    {
      no: 1,
      primary: "CAPE VOGEL",
      surname: "KAPA",
      firstName: "JAMES",
      gender: "M",
    },
    {
      no: 2,
      primary: "CAPE VOGEL",
      surname: "WAI",
      firstName: "MARY",
      gender: "F",
    },
    {
      no: 3,
      primary: "CAPE VOGEL",
      surname: "TOLA",
      firstName: "PETER",
      gender: "M",
    },
    {
      no: 4,
      primary: "CAPE VOGEL",
      surname: "GURA",
      firstName: "HELEN",
      gender: "F",
    },
  ],
  "Duau High School": [
    {
      no: 1,
      primary: "DUAU",
      surname: "MAI",
      firstName: "JOSEPH",
      gender: "M",
    },
    { no: 2, primary: "DUAU", surname: "KILA", firstName: "ANNA", gender: "F" },
    { no: 3, primary: "DUAU", surname: "VAI", firstName: "PAUL", gender: "M" },
  ],
  "Holy Name Secondary School": [
    {
      no: 1,
      primary: "ALOTAU",
      surname: "JOHN",
      firstName: "MATTHEW",
      gender: "M",
    },
    {
      no: 2,
      primary: "ALOTAU",
      surname: "PAUL",
      firstName: "MARK",
      gender: "M",
    },
    {
      no: 3,
      primary: "ALOTAU",
      surname: "LUKE",
      firstName: "JOHN",
      gender: "M",
    },
    {
      no: 4,
      primary: "ALOTAU",
      surname: "MARK",
      firstName: "LUKE",
      gender: "M",
    },
  ],
  "Hagita Secondary School": [
    {
      no: 1,
      primary: "HAGITA",
      surname: "WASO",
      firstName: "PETER",
      gender: "M",
    },
    {
      no: 2,
      primary: "HAGITA",
      surname: "GARI",
      firstName: "DAVID",
      gender: "M",
    },
    {
      no: 3,
      primary: "HAGITA",
      surname: "KORA",
      firstName: "SUSAN",
      gender: "F",
    },
  ],
  "Kiriwina High School": [
    {
      no: 1,
      primary: "KIRIWINA",
      surname: "BULA",
      firstName: "JOHN",
      gender: "M",
    },
    {
      no: 2,
      primary: "KIRIWINA",
      surname: "TOVUE",
      firstName: "MARY",
      gender: "F",
    },
    {
      no: 3,
      primary: "KIRIWINA",
      surname: "GWALI",
      firstName: "HELEN",
      gender: "F",
    },
  ],
  "Kuiaro High School": [
    {
      no: 1,
      primary: "KUIARO",
      surname: "VALI",
      firstName: "THOMAS",
      gender: "M",
    },
    {
      no: 2,
      primary: "KUIARO",
      surname: "MOI",
      firstName: "JENNY",
      gender: "F",
    },
  ],
  "Misima High School": [
    {
      no: 1,
      primary: "MISIMA",
      surname: "KEWA",
      firstName: "ROSE",
      gender: "F",
    },
    {
      no: 2,
      primary: "MISIMA",
      surname: "UVA",
      firstName: "HENRY",
      gender: "M",
    },
  ],
  "Santa Maria Secondary School": [
    {
      no: 1,
      primary: "SANTA MARIA",
      surname: "BOGA",
      firstName: "PAUL",
      gender: "M",
    },
    {
      no: 2,
      primary: "SANTA MARIA",
      surname: "KILA",
      firstName: "GRACE",
      gender: "F",
    },
  ],
  "Suau High School": [
    {
      no: 1,
      primary: "SUAU",
      surname: "TARI",
      firstName: "MARGARET",
      gender: "F",
    },
    { no: 2, primary: "SUAU", surname: "BORO", firstName: "JOHN", gender: "M" },
  ],
  "Wesley Secondary School": [
    {
      no: 1,
      primary: "WESLEY",
      surname: "WAI",
      firstName: "PETER",
      gender: "M",
    },
    {
      no: 2,
      primary: "WESLEY",
      surname: "GARI",
      firstName: "DAVID",
      gender: "M",
    },
  ],
  "Woodlark Junior School": [
    {
      no: 1,
      primary: "WOODLARK",
      surname: "MOI",
      firstName: "JENNY",
      gender: "F",
    },
    {
      no: 2,
      primary: "WOODLARK",
      surname: "UVA",
      firstName: "HENRY",
      gender: "M",
    },
  ],
  "Yeleyamba Junior High School": [
    {
      no: 1,
      primary: "YELEYAMBA",
      surname: "KEWA",
      firstName: "ROSE",
      gender: "F",
    },
    {
      no: 2,
      primary: "YELEYAMBA",
      surname: "BULA",
      firstName: "JOHN",
      gender: "M",
    },
  ],
};

const GRADE11_DATA: Record<
  string,
  {
    name: string;
    gender: string;
    slfNo: string;
    transferredFrom: string;
  }[]
> = {
  "Cameron Secondary School": [
    {
      name: "ABENDAN CHELSIE",
      gender: "F",
      slfNo: "25546001002",
      transferredFrom: "",
    },
    {
      name: "ABENDAN ADRIAN",
      gender: "M",
      slfNo: "25546001001",
      transferredFrom: "",
    },
    {
      name: "AHUTA ANDREW",
      gender: "M",
      slfNo: "25546001005",
      transferredFrom: "",
    },
    {
      name: "AIA NATASHA",
      gender: "F",
      slfNo: "25546001006",
      transferredFrom: "",
    },
    {
      name: "BAI RAYMOND",
      gender: "M",
      slfNo: "25546001007",
      transferredFrom: "",
    },
    {
      name: "DAGA GRACE",
      gender: "F",
      slfNo: "25546001008",
      transferredFrom: "",
    },
  ],
  "Duau High School": [
    {
      name: "KILA JOSEPH",
      gender: "M",
      slfNo: "25546002001",
      transferredFrom: "DUAU HIGH",
    },
    {
      name: "VAI ANNA",
      gender: "F",
      slfNo: "25546002002",
      transferredFrom: "DUAU HIGH",
    },
    {
      name: "MAI PAUL",
      gender: "M",
      slfNo: "25546002003",
      transferredFrom: "DUAU HIGH",
    },
  ],
  "Holy Name Secondary School": [
    {
      name: "JOHN MATTHEW",
      gender: "M",
      slfNo: "25546003001",
      transferredFrom: "HOLY NAME SEC",
    },
    {
      name: "PAUL MARK",
      gender: "M",
      slfNo: "25546003002",
      transferredFrom: "HOLY NAME SEC",
    },
    {
      name: "LUKE JOHN",
      gender: "M",
      slfNo: "25546003003",
      transferredFrom: "HOLY NAME SEC",
    },
  ],
  "Hagita Secondary School": [
    {
      name: "WASO PETER",
      gender: "M",
      slfNo: "25546004001",
      transferredFrom: "HAGITA SEC",
    },
    {
      name: "GARI DAVID",
      gender: "M",
      slfNo: "25546004002",
      transferredFrom: "HAGITA SEC",
    },
    {
      name: "KORA SUSAN",
      gender: "F",
      slfNo: "25546004003",
      transferredFrom: "HAGITA SEC",
    },
  ],
  "Kiriwina High School": [
    {
      name: "BULA JOHN",
      gender: "M",
      slfNo: "25546005001",
      transferredFrom: "KIRIWINA HIGH",
    },
    {
      name: "TOVUE MARY",
      gender: "F",
      slfNo: "25546005002",
      transferredFrom: "KIRIWINA HIGH",
    },
    {
      name: "GWALI HELEN",
      gender: "F",
      slfNo: "25546005003",
      transferredFrom: "KIRIWINA HIGH",
    },
  ],
  "Misima High School": [
    {
      name: "KEWA ROSE",
      gender: "F",
      slfNo: "25546006001",
      transferredFrom: "MISIMA HIGH",
    },
    {
      name: "UVA HENRY",
      gender: "M",
      slfNo: "25546006002",
      transferredFrom: "MISIMA HIGH",
    },
  ],
  "Santa Maria Secondary School": [
    {
      name: "BOGA PAUL",
      gender: "M",
      slfNo: "25546007001",
      transferredFrom: "SANTA MARIA SEC",
    },
    {
      name: "KILA GRACE",
      gender: "F",
      slfNo: "25546007002",
      transferredFrom: "SANTA MARIA SEC",
    },
  ],
  "Wesley Secondary School": [
    {
      name: "WAI PETER",
      gender: "M",
      slfNo: "25546008001",
      transferredFrom: "WESLEY SEC",
    },
    {
      name: "GARI DAVID",
      gender: "M",
      slfNo: "25546008002",
      transferredFrom: "WESLEY SEC",
    },
  ],
};

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

const FALLBACK_SELECTION_STUDENTS: SelectionStudent[] = [
  ...Object.entries(GRADE9_DATA).flatMap(([school, students]) =>
    students.map((student) => ({
      grade_level: 9,
      school,
      position_no: student.no,
      primary_school: student.primary,
      surname: student.surname,
      first_name: student.firstName,
      gender: student.gender,
    })),
  ),
  ...Object.entries(GRADE11_DATA).flatMap(([school, students]) =>
    students.map((student, index) => ({
      grade_level: 11,
      school,
      position_no: index + 1,
      gender: student.gender,
      student_name: student.name,
      slf_no: student.slfNo,
      transferred_from: student.transferredFrom,
    })),
  ),
];

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
            Official 2026 selection lists for Milne Bay Province. Click a school to view the student
            placement table.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <h3
              className="text-2xl font-bold text-[#0B2545] mb-6 flex items-center gap-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              <span className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                9
              </span>
              Grade 9 Selection List ({grade9Schools.length} Schools)
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
              Grade 11 Selection List ({grade11Schools.length} Schools)
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
  const PATHWAYS = [
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

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-amber-500 text-xs font-bold uppercase tracking-widest">
            Post-Grade 12 Pathways
          </span>
          <h2
            className="text-4xl font-bold text-[#0B2545] mt-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Where Our Students Go
          </h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto text-base leading-relaxed">
            Post Primary education opens multiple pathways. The Division tracks graduate
            destinations to align programs with provincial workforce needs.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PATHWAYS.map((p) => (
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
  const INITIATIVES = [
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

  return (
    <section className="bg-[#F8F6F1] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-amber-500 text-xs font-bold uppercase tracking-widest">
            Key Initiatives
          </span>
          <h2
            className="text-4xl font-bold text-[#0B2545] mt-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Driving Quality & Access
          </h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto text-base leading-relaxed">
            Targeted programs improving outcomes, expanding pathways, and modernizing secondary
            education across the province.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {INITIATIVES.map((i) => (
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
  return (
    <section className="bg-[#163663] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">
              Support & Resources
            </span>
            <h2
              className="text-4xl font-bold text-white mt-2 mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Empowering Schools & Students
            </h2>
            <p className="text-amber-100 leading-relaxed mb-8">
              Comprehensive support ensuring every secondary school delivers quality education and
              every student can access their chosen pathway.
            </p>
            <div className="space-y-4">
              {[
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
              ].map((item) => (
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
              Post Primary Helpdesk
            </h3>
            <p className="text-amber-200 mb-6">
              Assistance with enrolments, subject selection, exam queries, tertiary applications,
              and school transfers.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-white">
                <span className="text-amber-400 text-xl">📞</span>
                <div>
                  <div className="text-sm text-amber-200">Provincial Post Primary Officer</div>
                  <div className="font-semibold">+675 641 1234 (ext. 3)</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-white">
                <span className="text-amber-400 text-xl">✉️</span>
                <div>
                  <div className="text-sm text-amber-200">Email</div>
                  <div className="font-semibold">post.primary@mbpeducation.gov.pg</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-white">
                <span className="text-amber-400 text-xl">📍</span>
                <div>
                  <div className="text-sm text-amber-200">Office</div>
                  <div className="font-semibold">Division of Education, Alotau</div>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-white/10">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-[#0B2545] font-semibold px-6 py-3 rounded transition-colors"
              >
                Submit Enquiry →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DownloadsSection() {
  const DOWNLOADS = [
    {
      name: "2026 Grade 9 Selection List",
      type: "PDF",
      size: "2.4 MB",
      category: "Selection Lists",
    },
    {
      name: "2026 Grade 11 Selection List",
      type: "PDF",
      size: "3.1 MB",
      category: "Selection Lists",
    },
    {
      name: "Post Primary Handbook 2026",
      type: "PDF",
      size: "3.1 MB",
      category: "Policy",
    },
    {
      name: "Grade 10 & 12 Exam Specifications",
      type: "PDF",
      size: "4.2 MB",
      category: "Assessment",
    },
    {
      name: "Stream Selection Guidelines",
      type: "PDF",
      size: "1.8 MB",
      category: "Guidance",
    },
    {
      name: "Secondary Curriculum: Grades 9–12",
      type: "PDF",
      size: "22.4 MB",
      category: "Curriculum",
    },
    {
      name: "School Learning Improvement Plan Template",
      type: "DOCX",
      size: "920 KB",
      category: "Planning",
    },
    {
      name: "Career Guidance Resource Kit",
      type: "PDF",
      size: "5.6 MB",
      category: "Guidance",
    },
    {
      name: "Boarding School Standards",
      type: "PDF",
      size: "2.7 MB",
      category: "Infrastructure",
    },
    {
      name: "Teacher Subject Panel Minutes 2025",
      type: "PDF",
      size: "1.4 MB",
      category: "Professional Dev",
    },
  ];

  return (
    <section className="py-16 px-4 bg-[#F8F6F1]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <span className="text-amber-500 text-xs font-bold uppercase tracking-widest">
              Resources
            </span>
            <h2
              className="text-4xl font-bold text-[#0B2545] mt-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Documents & Downloads
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
          {DOWNLOADS.map((doc) => (
            <Link
              key={doc.name}
              to="/contact"
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
                <div className="text-gray-500 text-xs mt-1">{doc.size}</div>
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
  const FAQS = [
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

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-amber-500 text-xs font-bold uppercase tracking-widest">
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
