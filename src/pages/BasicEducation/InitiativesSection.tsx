import { useEntity } from "@/hooks/useDynamic";
import Reveal from "@/components/Reveal";

export function InitiativesSection() {
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
      <Reveal className="max-w-7xl mx-auto">
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
      </Reveal>
    </section>
  );
}
