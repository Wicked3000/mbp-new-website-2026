import fodeImg from "../../../assets/fode/fode-img.jpg";

export function OverviewSection() {
  return (
    <section id="overview" className="bg-[#F8F6F1] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <span className="text-teal-400 text-xs font-bold uppercase tracking-widest">
              Program Overview
            </span>
            <h2
              className="text-4xl font-bold text-[#0B2545] mt-2 mb-6 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Education Without Boundaries
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4 text-lg">
              FODE provides the same national curriculum and examinations as conventional schools,
              delivered through flexible distance learning. The Division operates 12 study centres
              across all 17 districts, serving 3,500+ students annually.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              Students include Grade 10/12 upgraders, remote island learners, working adults, and
              those who missed conventional schooling. All courses lead to nationally recognized
              Grade 10 and Grade 12 certificates.
            </p>
            <div className="space-y-4">
              {[
                {
                  icon: "📚",
                  title: "Same National Curriculum",
                  desc: "Identical syllabus, textbooks, and examinations as classroom-based schools",
                },
                {
                  icon: "⏰",
                  title: "Flexible Scheduling",
                  desc: "Study at your own pace; no fixed timetables - ideal for working students and parents",
                },
                {
                  icon: "🏝️",
                  title: "Remote Access",
                  desc: "Study centres on islands and mainland; materials delivered by boat, plane, and digital platforms",
                },
                {
                  icon: "🎓",
                  title: "National Certification",
                  desc: "Grade 10 & 12 certificates identical to conventional schools; accepted for tertiary entry",
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
                src={fodeImg}
                alt="Study centre"
                className="w-full h-72 object-cover object-[50%_90%]"
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
                    "Free tuition under Government FODE subsidy",
                    "12 study centres + 25+ correspondence sites",
                    "Print & digital materials (Moodle LMS, offline apps)",
                    "Tutor support via phone, WhatsApp, and centre visits",
                    "Same Grade 10/12 National Exams as conventional schools",
                    "Credit transfer to/from conventional and VET pathways",
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm">
                      <span className="text-teal-400 shrink-0">✓</span>
                      <span className="text-gray-700">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { value: "12", label: "Study Centres", color: "bg-[#0B2545]" },
                {
                  value: "3,500+",
                  label: "Active Students",
                  color: "bg-[#163663]",
                },
                {
                  value: "25+",
                  label: "Correspondence Sites",
                  color: "bg-teal-600",
                },
                { value: "92%", label: "Exam Pass Rate", color: "bg-teal-700" },
              ].map((s) => (
                <div key={s.label} className={`${s.color} rounded-xl p-5 text-white text-center`}>
                  <div
                    className="text-3xl font-bold"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {s.value}
                  </div>
                  <div className="text-teal-100 text-sm uppercase tracking-wider">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
