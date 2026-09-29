import { useEntity } from "@/hooks/useDynamic";
import Reveal from "@/components/Reveal";

export function OverviewSection() {
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
      <Reveal className="max-w-7xl mx-auto">
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
      </Reveal>
    </section>
  );
}
