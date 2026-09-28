import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { useEntity } from "@/hooks/useDynamic";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

function PageHero() {
  const FALLBACK = {
    eyebrow: "Program 01 - Basic Education",
    title: "Basic Education",
    subtitle: "Elementary to Grade 8",
    description:
      "Providing foundational literacy, numeracy and life skills for all children from Prep through to Grade 8 across Milne Bay Province's 312 schools.",
    banner: "/assets/education_programs/basic/banner.jpg",
    alt: "Elementary school students in Milne Bay",
  };
  const { data } = useEntity("basic_hero", [FALLBACK]);
  const hero = { ...FALLBACK, ...(data?.[0] || {}) };
  return (
    <section className="relative h-[400px] sm:h-[480px] overflow-hidden bg-[#0B2545]">
      <img decoding="async"
        src={hero.banner}
        alt={hero.alt}
        className="absolute inset-0 w-full h-full object-cover object-center opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0B2545]/90 via-[#0B2545]/70 to-[#163663]/40" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 h-full flex flex-col justify-center">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-500/40 text-teal-300 text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 inline-block" />
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
              className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white font-semibold px-6 py-3 rounded transition-colors"
            >
              Overview
            </Link>
            <Link
              to="#schools"
              className="inline-flex items-center gap-2 border border-teal-400 text-teal-300 hover:bg-teal-500/10 hover:text-white font-semibold px-6 py-3 rounded transition-colors"
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
    heading: "Foundation for Lifelong Learning",
    intro:
      "Basic Education in Milne Bay Province covers the critical foundational years from Elementary Prep through Grade 8. This nine-year journey equips children with essential literacy, numeracy, and life skills that form the bedrock of all future learning.",
    body: "The Division oversees schools across all 4 districts of Milne Bay Province with a teaching workforce of 1,800+ qualified educators. Our schools span from urban Alotau to remote island communities in Samarai-Murua, ensuring every child has access to quality basic education.",
    features_title: "Key Features",
  };
  const CARDS_FALLBACK = [
    {
      icon: "📘",
      title: "Elementary (Prep–Grade 2)",
      desc: "Vernacular-based early learning focusing on oral language, pre-literacy, and cultural identity",
    },
    {
      icon: "📗",
      title: "Primary (Grades 3–8)",
      desc: "English-medium curriculum covering English, Mathematics, Science, Social Science, and Personal Development",
    },
    {
      icon: "📙",
      title: "Life Skills & Values",
      desc: "Health, hygiene, environmental awareness, and citizenship education integrated across all grades",
    },
    {
      icon: "📕",
      title: "Inclusive Education",
      desc: "Support for children with disabilities and learning difficulties through specialist teacher aides",
    },
  ];
  const FEATURES_FALLBACK = [
    { feature: "Free tuition under Government TFF policy" },
    { feature: "Standard-based curriculum (SBC) implementation" },
    { feature: "Vernacular education in Elementary years" },
    { feature: "School Learning Improvement Plans (SLIP)" },
    { feature: "Community participation through Boards of Management" },
    { feature: "Regular school inspections & quality assurance" },
  ];
  const STATS_FALLBACK = [
    { value_text: "312", label: "Schools", color: "bg-[#0B2545]" },
    { value_text: "35,200+", label: "Students", color: "bg-[#163663]" },
    { value_text: "1,840", label: "Teachers", color: "bg-teal-600" },
    { value_text: "17", label: "Districts", color: "bg-teal-700" },
  ];

  const { data: overviewRows } = useEntity("basic_overview", [OVERVIEW_FALLBACK]);
  const { data: cards } = useEntity("basic_overview_cards", CARDS_FALLBACK);
  const { data: features } = useEntity("basic_overview_features", FEATURES_FALLBACK);
  const { data: stats } = useEntity("basic_overview_stats", STATS_FALLBACK);
  const overview = { ...OVERVIEW_FALLBACK, ...(overviewRows?.[0] || {}) };

  return (
    <section id="overview" className="bg-[#F8F6F1] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <span className="text-teal-500 text-xs font-bold uppercase tracking-widest">
              {overview.eyebrow}
            </span>
            <h2
              className="text-4xl font-bold text-[#0B2545] mt-2 mb-6 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {overview.heading}
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4 text-lg">
              {overview.intro}
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              {overview.body}
            </p>
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
                src="/assets/education_programs/basic/banner.jpg"
                alt="Students in classroom"
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
                      <span className="text-teal-500 shrink-0">✓</span>
                      <span className="text-gray-700">{row.feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {stats.map((stat: any) => (
                <div
                  key={stat.label}
                  className={`${stat.color} rounded-xl p-5 text-white text-center`}
                >
                  <div
                    className="text-3xl font-bold"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {stat.value_text}
                  </div>
                  <div className="text-teal-100 text-sm uppercase tracking-wider">{stat.label}</div>
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
  const SUBJECTS_FALLBACK = [
    {
      area: "English",
      grades: "3–8",
      desc: "Reading, writing, speaking, listening; phonics to advanced comprehension",
      icon: "📝",
    },
    {
      area: "Mathematics",
      grades: "3–8",
      desc: "Number, algebra, measurement, geometry, statistics, problem-solving",
      icon: "🔢",
    },
    {
      area: "Science",
      grades: "3–8",
      desc: "Living world, physical world, earth & space, scientific inquiry skills",
      icon: "🔬",
    },
    {
      area: "Social Science",
      grades: "3–8",
      desc: "History, geography, civics, economics, PNG studies & culture",
      icon: "🌍",
    },
    {
      area: "Personal Development",
      grades: "3–8",
      desc: "Health, physical education, values, life skills, career awareness",
      icon: "💪",
    },
    {
      area: "Making a Living",
      grades: "6–8",
      desc: "Agriculture, business basics, home economics, technical skills",
      icon: "🛠️",
    },
    {
      area: "Vernacular / Tok Pisin",
      grades: "Prep–2",
      desc: "Oral language, cultural stories, early literacy in mother tongue",
      icon: "🗣️",
    },
    {
      area: "Religious Education",
      grades: "Prep–8",
      desc: "Christian principles, values, ethics (per Education Act)",
      icon: "✝️",
    },
  ];
  const { data: subjects } = useEntity("basic_curriculum", SUBJECTS_FALLBACK);
  const { data: headings } = useEntity("basic_section_headings", []);
  const heading =
    headings.find((h: any) => h.skey === "curriculum") || {
      eyebrow: "Curriculum",
      heading: "Standards-Based Curriculum",
      blurb: "Milne Bay schools implement the National Standards-Based Curriculum (SBC), ensuring consistent learning outcomes across all schools while allowing local contextualization.",
    };

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-teal-500 text-xs font-bold uppercase tracking-widest">
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
          {subjects.map((subject: any) => (
            <div
              key={subject.area}
              className="bg-[#F8F6F1] rounded-xl p-6 border border-gray-100 hover:border-teal-300 hover:shadow-lg transition-all"
            >
              <div className="text-3xl mb-3">{subject.icon}</div>
              <div
                className="text-[#0B2545] font-bold mb-1"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {subject.area}
              </div>
              <div className="text-teal-600 text-xs font-semibold uppercase tracking-wider mb-2">
                Grades {subject.grades}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{subject.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-teal-50 rounded-xl border border-teal-100">
          <div className="flex items-start gap-4">
            <div className="text-3xl shrink-0">📋</div>
            <div>
              <h3
                className="text-xl font-bold text-[#0B2545] mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Assessment & Progression
              </h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-teal-500">•</span> Continuous school-based assessment (SBA)
                  throughout the year
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-500">•</span> National Grade 8 Examination for
                  certification and secondary selection
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-500">•</span> Standards-referenced reporting to parents
                  each term
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-500">•</span> Early intervention for students not
                  meeting benchmarks
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const DISTRICTS_FALLBACK = [
  { id: 1, name: "Alotau", schools: 42, students: "6,800+", type: "Urban" },
  { id: 2, name: "Samarai-Murua", schools: 22, students: "1,900+", type: "Island" },
  { id: 3, name: "Esa'ala", schools: 15, students: "1,600+", type: "Island" },
  { id: 4, name: "Kiriwina-Goodenough", schools: 18, students: "2,100+", type: "Island" },
  { id: 5, name: "Huhu", schools: 21, students: "2,300+", type: "Rural" },
  { id: 6, name: "Rabaruana", schools: 28, students: "3,200+", type: "Rural" },
  { id: 7, name: "Losuia", schools: 17, students: "1,700+", type: "Island" },
  { id: 8, name: "Dobu", schools: 16, students: "1,800+", type: "Island" },
  { id: 9, name: "Wanigela", schools: 12, students: "1,100+", type: "Rural" },
  { id: 10, name: "Agaivaro", schools: 19, students: "2,000+", type: "Rural" },
  { id: 11, name: "Duau", schools: 14, students: "1,400+", type: "Rural" },
  { id: 12, name: "Guasopa", schools: 11, students: "1,000+", type: "Remote" },
  { id: 13, name: "Kokoda", schools: 13, students: "1,200+", type: "Remote" },
  { id: 14, name: "Maramatana", schools: 10, students: "900+", type: "Remote" },
  { id: 15, name: "Misi", schools: 12, students: "1,100+", type: "Rural" },
  { id: 16, name: "Sibonai", schools: 11, students: "950+", type: "Remote" },
  { id: 17, name: "West Ferguson", schools: 11, students: "1,050+", type: "Remote" },
];

function SchoolsSection() {
  // Admin-managed via /admin/districts, so additions and edits appear here
  // rather than needing a code change.
  const { data } = useEntity("districts", DISTRICTS_FALLBACK as any);

  const [district, setDistrict] = useState("");
  const [query, setQuery] = useState("");

  const districts = useMemo(
    () =>
      (data as any[])
        .slice()
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
    [data],
  );

  const normalizedQuery = query.trim().toLowerCase();

  const filteredDistricts = districts.filter(
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
              Schools Across 4 Districts
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
              {districts.map((d) => (
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
                    {/* Now navigates to that district's school list instead of
                        re-filtering the district table it sits in. */}
                    <Link
                      to={`/districts/${d.id ?? d.name}`}
                      className="text-teal-600 hover:text-teal-800 font-medium text-sm"
                    >
                      View Schools →
                    </Link>
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

function InitiativesSection() {
  const INITIATIVES_FALLBACK = [
    {
      title: "Early Grade Reading Assessment (EGRA)",
      desc: "Annual literacy screening for Grades 1–3 to identify struggling readers early and provide targeted intervention.",
      icon: "📖",
      status: "Active",
      color: "bg-teal-500",
    },
    {
      title: "School Learning Improvement Plans (SLIP)",
      desc: "Every school develops a 3-year improvement plan with community input, focusing on infrastructure, teaching quality, and student outcomes.",
      icon: "📋",
      status: "Active",
      color: "bg-blue-500",
    },
    {
      title: "Vernacular Education Support",
      desc: "Development of orthographies, teaching materials, and teacher training for 12+ local languages used in Elementary schools.",
      icon: "🗣️",
      status: "Ongoing",
      color: "bg-amber-500",
    },
    {
      title: "Inclusive Education Pilot",
      desc: "Specialist teacher aides and adaptive resources in 15 pilot schools supporting children with disabilities in mainstream classrooms.",
      icon: "🤝",
      status: "Pilot",
      color: "bg-purple-500",
    },
    {
      title: "WASH in Schools Program",
      desc: "Water, sanitation, and hygiene infrastructure upgrades plus hygiene education in 50 priority schools across the province.",
      icon: "💧",
      status: "Active",
      color: "bg-cyan-500",
    },
    {
      title: "Digital Learning Trial",
      desc: "Tablet-based literacy and numeracy apps deployed in 10 remote schools with solar charging, measuring learning gains.",
      icon: "💻",
      status: "Trial",
      color: "bg-indigo-500",
    },
  ];
  const { data: initiatives } = useEntity("basic_initiatives", INITIATIVES_FALLBACK);
  const { data: headings } = useEntity("basic_section_headings", []);
  const heading =
    headings.find((h: any) => h.skey === "initiatives") || {
      eyebrow: "Key Initiatives",
      heading: "Programs Driving Quality",
      blurb: "Targeted initiatives addressing literacy, inclusion, infrastructure, and innovation across the basic education sector.",
    };

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-teal-500 text-xs font-bold uppercase tracking-widest">
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
          {initiatives.map((init: any) => (
            <div
              key={init.title}
              className="bg-[#F8F6F1] rounded-xl p-6 border border-gray-100 hover:border-teal-200 hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`${init.color} text-white rounded-lg p-2 shrink-0`}>
                  <span className="text-xl">{init.icon}</span>
                </div>
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 bg-white/80 rounded">
                  {init.status}
                </span>
              </div>
              <h3
                className="text-lg font-bold text-[#0B2545] mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {init.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">{init.desc}</p>
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
      title: "Curriculum Materials",
      desc: "Syllabuses, teacher guides, student workbooks distributed annually",
    },
    {
      icon: "🏗️",
      title: "Infrastructure Grants",
      desc: "Maintenance and construction funding through SLIP and TFF",
    },
    {
      icon: "👨‍🏫",
      title: "Teacher Professional Development",
      desc: "In-service training, cluster workshops, and certification support",
    },
    {
      icon: "📊",
      title: "Data & Monitoring",
      desc: "EMIS reporting, school inspections, and performance dashboards",
    },
    {
      icon: "🤝",
      title: "Community Engagement",
      desc: "Board of Management training, P&C support, awareness campaigns",
    },
    {
      icon: "🚨",
      title: "Emergency Response",
      desc: "Cyclone/disaster recovery, temporary learning spaces, psychosocial support",
    },
  ];
  const CONTACT_FALLBACK = {
    heading: "Basic Education Helpdesk",
    body: "Need assistance with enrolments, transfers, curriculum, or school issues? Our dedicated Basic Education support team is here to help.",
    phone_label: "Provincial Basic Education Officer",
    phone_value: "+675 641 1234 (ext. 2)",
    email_label: "Email",
    email_value: "basic.education@mbpeducation.gov.pg",
    office_label: "Office",
    office_value: "Division of Education, Alotau",
    button_label: "Submit Enquiry",
    button_href: "/contact",
  };
  const { data: support } = useEntity("basic_support", SUPPORT_FALLBACK);
  const { data: contactRows } = useEntity("basic_support_contact", [CONTACT_FALLBACK]);
  const { data: headings } = useEntity("basic_section_headings", []);
  const contact = { ...CONTACT_FALLBACK, ...(contactRows?.[0] || {}) };
  const heading =
    headings.find((h: any) => h.skey === "support") || {
      eyebrow: "Support & Resources",
      heading: "For Teachers, Parents & Communities",
      blurb: "The Division provides comprehensive support to ensure every school can deliver quality basic education.",
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
                  className="flex gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-teal-500/50 hover:bg-white/10 transition-all"
                >
                  <span className="text-2xl shrink-0">{item.icon}</span>
                  <div>
                    <h3 className="text-white font-semibold">{item.title}</h3>
                    <p className="text-teal-200 text-sm">{item.desc}</p>
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
            <p className="text-teal-200 mb-6">{contact.body}</p>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-white">
                <span className="text-teal-400 text-xl">📞</span>
                <div>
                  <div className="text-sm text-teal-200">{contact.phone_label}</div>
                  <div className="font-semibold">{contact.phone_value}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-white">
                <span className="text-teal-400 text-xl">✉️</span>
                <div>
                  <div className="text-sm text-teal-200">{contact.email_label}</div>
                  <div className="font-semibold">{contact.email_value}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-white">
                <span className="text-teal-400 text-xl">📍</span>
                <div>
                  <div className="text-sm text-teal-200">{contact.office_label}</div>
                  <div className="font-semibold">{contact.office_value}</div>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-white/10">
              <Link
                to={contact.button_href}
                className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white font-semibold px-6 py-3 rounded transition-colors"
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
    {
      name: "Basic Education Handbook 2026",
      type: "PDF",
      size_text: "2.4 MB",
      category: "Policy",
    },
    {
      name: "Standards-Based Curriculum: Grades 3–8",
      type: "PDF",
      size_text: "18.7 MB",
      category: "Curriculum",
    },
    {
      name: "Elementary Vernacular Guide",
      type: "PDF",
      size_text: "5.1 MB",
      category: "Curriculum",
    },
    {
      name: "School Learning Improvement Plan Template",
      type: "DOCX",
      size_text: "890 KB",
      category: "Planning",
    },
    {
      name: "Grade 8 Examination Specifications",
      type: "PDF",
      size_text: "1.2 MB",
      category: "Assessment",
    },
    {
      name: "Inclusive Education Guidelines",
      type: "PDF",
      size_text: "3.3 MB",
      category: "Policy",
    },
    {
      name: "Teacher Performance Appraisal Forms",
      type: "PDF",
      size_text: "650 KB",
      category: "HR",
    },
    {
      name: "WASH in Schools Standards",
      type: "PDF",
      size_text: "2.1 MB",
      category: "Infrastructure",
    },
  ];
  const { data: downloads } = useEntity("downloads", []);
  // Only the documents scoped to Basic Education belong in this section; the
  // table is shared with /downloads.
  const scoped = downloads.filter((d: any) => d.program === "basic");
  const docs = scoped.length ? scoped : DOWNLOADS_FALLBACK;
  const { data: headings } = useEntity("basic_section_headings", []);
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
            <span className="text-teal-500 text-xs font-bold uppercase tracking-widest">
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
    {
      q: "At what age should my child start Elementary Prep?",
      a: "Children should be 6 years old by June 30 of the enrolment year to start Elementary Prep. Early or late enrolment requires approval from the Provincial Education Advisor.",
    },
    {
      q: "What language is used for instruction in Elementary grades?",
      a: "Elementary Prep to Grade 2 uses the local vernacular language (or Tok Pisin in multilingual settings) as the medium of instruction. English is introduced as a subject from Elementary 2 and becomes the medium of instruction from Grade 3 onwards.",
    },
    {
      q: "How do I enrol my child in a Basic Education school?",
      a: "Visit your nearest school during enrolment period (typically January). Bring your child's birth certificate or clinic card, and proof of residence. The head teacher will process the enrolment. No fees are charged under the Tuition Fee Free policy.",
    },
    {
      q: "What is the Grade 8 National Examination?",
      a: "The Grade 8 Examination is a national assessment held annually in October. It covers English, Mathematics, Science, and Social Science. Results determine placement into Grade 9 (Post Primary) and certification of Basic Education completion.",
    },
    {
      q: "My child has a disability. Can they attend a regular school?",
      a: "Yes. The Division is implementing inclusive education across schools. Contact the Basic Education Officer to discuss your child's needs. Specialist teacher aides and adaptive resources are available in pilot schools, with expansion planned.",
    },
    {
      q: "How can I get a copy of my child's Grade 8 certificate?",
      a: "Certificates are issued by the Measurement Services Division of NDoE through the school. If lost, apply through your former school with a statutory declaration and K20 processing fee. Contact the Basic Education helpdesk for assistance.",
    },
  ];
  const { data: faqs } = useEntity("basic_faq", FAQS_FALLBACK);
  const { data: headings } = useEntity("basic_section_headings", []);
  const heading =
    headings.find((h: any) => h.skey === "faq") || {
      eyebrow: "Frequently Asked",
      heading: "Common Questions",
    };

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-teal-500 text-xs font-bold uppercase tracking-widest">
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
                <span className="text-teal-500 transition-transform group-open:rotate-180">▼</span>
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

export default function BasicEducationPage() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif" }}>
      <SiteHeader />
      <PageHero />
      <OverviewSection />
      <CurriculumSection />
      <SchoolsSection />
      <InitiativesSection />
      <SupportSection />
      <DownloadsSection />
      <FAQSection />
      <SiteFooter />
    </div>
  );
}
