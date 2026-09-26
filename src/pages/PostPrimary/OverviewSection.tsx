export function OverviewSection() {
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
