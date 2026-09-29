import { useEntity } from "@/hooks/useDynamic";
import Reveal from "@/components/Reveal";

export function ProgramsSection() {
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
      <Reveal className="max-w-7xl mx-auto">
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
      </Reveal>
    </section>
  );
}
