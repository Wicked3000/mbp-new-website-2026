import { useEntity } from "@/hooks/useDynamic";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";

export function PathwaysSection() {
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
      <Reveal className="max-w-7xl mx-auto">
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
                <span className="text-xl"><Icon name={p.icon} size={18} /></span>
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
      </Reveal>
    </section>
  );
}
