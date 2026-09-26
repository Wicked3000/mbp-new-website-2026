import { Link } from "react-router-dom";

export function SupportSection() {
  return (
    <section className="bg-[#163663] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">
              Support & Resources
            </span>
            <h2
              className="text-4xl font-bold text-white mt-2 mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Empowering Schools & Students
            </h2>
            <p className="text-amber-100 leading-relaxed mb-8">
              Comprehensive support ensuring every secondary school delivers quality education and
              every student can access their chosen pathway.
            </p>
            <div className="space-y-4">
              {[
                {
                  icon: "📄",
                  title: "Curriculum & Exam Resources",
                  desc: "Syllabuses, exam specs, past papers, marking guides distributed annually",
                },
                {
                  icon: "🏗️",
                  title: "Infrastructure & Maintenance",
                  desc: "TFF infrastructure component, SLIP grants, boarding facility funding",
                },
                {
                  icon: "👨‍🏫",
                  title: "Teacher Development",
                  desc: "In-service training, subject panels, HOD leadership programs, certification",
                },
                {
                  icon: "📊",
                  title: "Data & Quality Assurance",
                  desc: "EMIS, school inspections, exam analysis, performance dashboards",
                },
                {
                  icon: "🎓",
                  title: "Student Support Services",
                  desc: "Career guidance, counselling, scholarship info, tertiary applications",
                },
                {
                  icon: "🚨",
                  title: "Emergency & Resilience",
                  desc: "Disaster recovery, psychosocial support, temporary learning spaces",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-amber-500/50 hover:bg-white/10 transition-all"
                >
                  <span className="text-2xl shrink-0">{item.icon}</span>
                  <div>
                    <h3 className="text-white font-semibold">{item.title}</h3>
                    <p className="text-amber-200 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
            <h3
              className="text-2xl font-bold text-white mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Post Primary Helpdesk
            </h3>
            <p className="text-amber-200 mb-6">
              Assistance with enrolments, subject selection, exam queries, tertiary applications,
              and school transfers.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-white">
                <span className="text-amber-400 text-xl">📞</span>
                <div>
                  <div className="text-sm text-amber-200">Provincial Post Primary Officer</div>
                  <div className="font-semibold">+675 641 1234 (ext. 3)</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-white">
                <span className="text-amber-400 text-xl">✉️</span>
                <div>
                  <div className="text-sm text-amber-200">Email</div>
                  <div className="font-semibold">post.primary@mbpeducation.gov.pg</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-white">
                <span className="text-amber-400 text-xl">📍</span>
                <div>
                  <div className="text-sm text-amber-200">Office</div>
                  <div className="font-semibold">Division of Education, Alotau</div>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-white/10">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-[#0B2545] font-semibold px-6 py-3 rounded transition-colors"
              >
                Submit Enquiry →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
