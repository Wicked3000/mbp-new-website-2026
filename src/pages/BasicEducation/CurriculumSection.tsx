import { useEntity } from "@/hooks/useDynamic";

export function CurriculumSection() {
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
