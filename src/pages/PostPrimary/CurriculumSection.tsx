export function CurriculumSection() {
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
