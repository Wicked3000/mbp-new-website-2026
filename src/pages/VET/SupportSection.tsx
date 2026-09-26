import { Link } from "react-router-dom";

export function SupportSection() {
  return (
    <section className="bg-[#0D9488] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <span className="text-amber-300 text-xs font-bold uppercase tracking-widest">
              Support & Resources
            </span>
            <h2
              className="text-4xl font-bold text-white mt-2 mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              For Trainees, Employers & Trainers
            </h2>
            <p className="text-teal-100 leading-relaxed mb-8">
              Comprehensive support ecosystem ensuring quality training delivery and successful
              outcomes for all VET stakeholders.
            </p>
            <div className="space-y-4">
              {[
                {
                  icon: "📚",
                  title: "Training Resources",
                  desc: "Learning guides, assessment tools, e-learning portal, industry-standard equipment",
                },
                {
                  icon: "👨‍🏫",
                  title: "Trainer Development",
                  desc: "Certificate IV in Training & Assessment, industry currency programs, moderation",
                },
                {
                  icon: "🏢",
                  title: "Employer Services",
                  desc: "Apprentice sign-up, wage subsidies, workplace assessor training, skills audits",
                },
                {
                  icon: "💰",
                  title: "Funding & Scholarships",
                  desc: "Government subsidies, industry scholarships, tool allowances, travel support",
                },
                {
                  icon: "📊",
                  title: "Quality Assurance",
                  desc: "Internal audit, external moderation, TVET Authority compliance, tracer studies",
                },
                {
                  icon: "🎯",
                  title: "Job Placement",
                  desc: "Industry job board, resume workshops, interview prep, graduate tracking system",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex gap-4 p-4 bg-white/10 rounded-xl border border-white/20 hover:border-amber-300/50 hover:bg-white/15 transition-all"
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

          <div className="bg-white/10 rounded-2xl p-8 border border-white/20">
            <h3
              className="text-2xl font-bold text-white mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              VET Helpdesk
            </h3>
            <p className="text-teal-100 mb-6">
              Information on courses, enrolment, apprenticeships, RPL, employer incentives, and
              centre locations.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-white">
                <span className="text-amber-300 text-xl">📞</span>
                <div>
                  <div className="text-sm text-teal-100">Provincial VET Coordinator</div>
                  <div className="font-semibold">+675 641 1234 (ext. 4)</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-white">
                <span className="text-amber-300 text-xl">✉️</span>
                <div>
                  <div className="text-sm text-teal-100">Email</div>
                  <div className="font-semibold">vet@mbpeducation.gov.pg</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-white">
                <span className="text-amber-300 text-xl">📍</span>
                <div>
                  <div className="text-sm text-teal-100">Office</div>
                  <div className="font-semibold">Alotau VET Centre, Milne Bay</div>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-white/20">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-amber-300 hover:bg-amber-400 text-[#0B2545] font-semibold px-6 py-3 rounded transition-colors"
              >
                Contact VET Team →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
