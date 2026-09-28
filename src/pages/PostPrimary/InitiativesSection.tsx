import { useEntity } from "@/hooks/useDynamic";

export function InitiativesSection() {
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
