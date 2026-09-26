import { Link } from "react-router-dom";

export function SupportSection() {
  return (
    <section className="bg-[#0B2545] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <span className="text-teal-400 text-xs font-bold uppercase tracking-widest">
              Student Support
            </span>
            <h2
              className="text-4xl font-bold text-white mt-2 mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Every Learner Supported
            </h2>
            <p className="text-teal-100 leading-relaxed mb-8">
              Comprehensive support ensuring distance learners succeed - from enrolment to
              graduation and beyond.
            </p>
            <div className="space-y-4">
              {[
                {
                  icon: "👨‍🏫",
                  title: "Dedicated Tutors",
                  desc: "Subject-specialist tutors at each centre; phone/WhatsApp/email support; monthly progress calls",
                },
                {
                  icon: "📚",
                  title: "Learning Resources",
                  desc: "Full textbook sets, video lessons, past exam papers, marking guides, study planners",
                },
                {
                  icon: "💰",
                  title: "Financial Support",
                  desc: "Government FODE subsidy (free tuition), travel allowances for exams, device loan scheme",
                },
                {
                  icon: "🧭",
                  title: "Career & Pathway Guidance",
                  desc: "Grade 12 tertiary applications, VET articulation, resume building, interview prep",
                },
                {
                  icon: "🤝",
                  title: "Peer Support Networks",
                  desc: "WhatsApp study groups, centre study buddies, alumni mentoring, graduation events",
                },
                {
                  icon: "🌏",
                  title: "Inclusive Access",
                  desc: "Materials in large print/audio, sign language tutors, disability support officers at main centres",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-teal-400/50 hover:bg-white/10 transition-all"
                >
                  <span className="text-2xl shrink-0">{item.icon}</span>
                  <div>
                    <h3 className="text-white font-semibold">{item.title}</h3>
                    <p className="text-teal-100 text-sm">{item.desc}</p>
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
              FODE Helpdesk
            </h3>
            <p className="text-teal-100 mb-6">
              Enrolment, materials, exams, tutor issues, technical support, pathway advice.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-white">
                <span className="text-teal-400 text-xl">📞</span>
                <div>
                  <div className="text-sm text-teal-100">Provincial FODE Coordinator</div>
                  <div className="font-semibold">+675 641 1234 (ext. 5)</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-white">
                <span className="text-teal-400 text-xl">✉️</span>
                <div>
                  <div className="text-sm text-teal-100">Email</div>
                  <div className="font-semibold">fode@mbpeducation.gov.pg</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-white">
                <span className="text-teal-400 text-xl">📱</span>
                <div>
                  <div className="text-sm text-teal-100">WhatsApp Support</div>
                  <div className="font-semibold">+675 7XXX XXXX</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-white">
                <span className="text-teal-400 text-xl">📍</span>
                <div>
                  <div className="text-sm text-teal-100">Main Centre</div>
                  <div className="font-semibold">Alotau FODE Centre, Milne Bay</div>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-white/10">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-teal-400 hover:bg-teal-500 text-white font-semibold px-6 py-3 rounded transition-colors"
              >
                Contact FODE Team →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
