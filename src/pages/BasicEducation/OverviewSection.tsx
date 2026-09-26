export function OverviewSection() {
  return (
    <section id="overview" className="bg-[#F8F6F1] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <span className="text-teal-500 text-xs font-bold uppercase tracking-widest">
              Program Overview
            </span>
            <h2
              className="text-4xl font-bold text-[#0B2545] mt-2 mb-6 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Foundation for Lifelong Learning
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4 text-lg">
              Basic Education in Milne Bay Province covers the critical foundational years from
              Elementary Prep through Grade 8. This nine-year journey equips children with essential
              literacy, numeracy, and life skills that form the bedrock of all future learning.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              The Division oversees 312 schools across 17 districts, serving over 35,000 students
              with a teaching workforce of 1,800+ qualified educators. Our schools span from urban
              Alotau to remote island communities in Samarai-Murua, ensuring every child has access
              to quality basic education.
            </p>
            <div className="space-y-4">
              {[
                {
                  icon: "📚",
                  title: "Elementary (Prep–Grade 2)",
                  desc: "Vernacular-based early learning focusing on oral language, pre-literacy, and cultural identity",
                },
                {
                  icon: "📖",
                  title: "Primary (Grades 3–8)",
                  desc: "English-medium curriculum covering English, Mathematics, Science, Social Science, and Personal Development",
                },
                {
                  icon: "🌿",
                  title: "Life Skills & Values",
                  desc: "Health, hygiene, environmental awareness, and citizenship education integrated across all grades",
                },
                {
                  icon: "🏫",
                  title: "Inclusive Education",
                  desc: "Support for children with disabilities and learning difficulties through specialist teacher aides",
                },
              ].map((item) => (
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
              <img
                src="https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=800&h=500&fit=crop&auto=format"
                alt="Students in classroom"
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
                    "Free tuition under Government TFF policy",
                    "Standard-based curriculum (SBC) implementation",
                    "Vernacular education in Elementary years",
                    "School Learning Improvement Plans (SLIP)",
                    "Community participation through Boards of Management",
                    "Regular school inspections & quality assurance",
                  ].map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <span className="text-teal-500 shrink-0">✓</span>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { value: "312", label: "Schools", color: "bg-[#0B2545]" },
                { value: "35,200+", label: "Students", color: "bg-[#163663]" },
                { value: "1,840", label: "Teachers", color: "bg-teal-600" },
                { value: "17", label: "Districts", color: "bg-teal-700" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className={`${stat.color} rounded-xl p-5 text-white text-center`}
                >
                  <div
                    className="text-3xl font-bold"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {stat.value}
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
