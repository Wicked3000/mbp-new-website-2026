import { Link } from "react-router-dom";

export function EnrolmentSection() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <span className="text-teal-400 text-xs font-bold uppercase tracking-widest">
              How to Enrol
            </span>
            <h2
              className="text-4xl font-bold text-[#0B2545] mt-2 mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Start Your Trade Career
            </h2>
            <p className="text-gray-600 leading-relaxed mb-8">
              VET enrolments open twice yearly (January & July intakes). Priority given to Grade
              10/12 school leavers and out-of-school youth aged 16–35.
            </p>
            <div className="space-y-6">
              {[
                {
                  step: "01",
                  title: "Choose a Trade",
                  desc: "Review programs at vet.mbpeducation.gov.pg or visit your nearest centre. Consider your interests, aptitude, and local job market.",
                },
                {
                  step: "02",
                  title: "Check Eligibility",
                  desc: "Grade 10 certificate (minimum), medical fitness, age 16+. Mature entry (21+) considered with work experience. RPL available.",
                },
                {
                  step: "03",
                  title: "Submit Application",
                  desc: "Online at VET portal or paper form at any centre. Attach: certificates, ID, medical report, references. No application fee.",
                },
                {
                  step: "04",
                  title: "Selection & Interview",
                  desc: "Aptitude test + panel interview. Ranking based on grades, test, interview. Results within 2 weeks. Waitlist maintained.",
                },
                {
                  step: "05",
                  title: "Enrol & Commence",
                  desc: "Accept offer, pay subsidized fees (K200–K500/term), attend orientation. Tools & PPE provided. Training starts first Monday of term.",
                },
              ].map((s) => (
                <div key={s.step} className="flex gap-4">
                  <div
                    className="w-12 h-12 rounded-full bg-teal-100 text-teal-700 font-bold flex items-center justify-center shrink-0 text-xl"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {s.step}
                  </div>
                  <div>
                    <h3 className="text-[#0B2545] font-semibold">{s.title}</h3>
                    <p className="text-gray-600 text-sm">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-teal-50 rounded-2xl p-8 border border-teal-100">
            <h3
              className="text-2xl font-bold text-[#0B2545] mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              2026 Intake Dates
            </h3>
            <div className="space-y-4 mb-6">
              {[
                {
                  label: "January Intake Applications Open",
                  date: "1 October 2025",
                },
                {
                  label: "January Intake Applications Close",
                  date: "30 November 2025",
                },
                {
                  label: "January Intake Interviews",
                  date: "8–12 December 2025",
                },
                { label: "January Intake Commences", date: "26 January 2026" },
                {
                  label: "July Intake Applications Open",
                  date: "1 April 2026",
                },
                {
                  label: "July Intake Applications Close",
                  date: "31 May 2026",
                },
                { label: "July Intake Interviews", date: "9–13 June 2026" },
                { label: "July Intake Commences", date: "20 July 2026" },
              ].map((d) => (
                <div
                  key={d.label}
                  className="flex items-center justify-between py-3 border-b border-teal-100"
                >
                  <span className="text-gray-700">{d.label}</span>
                  <span className="font-semibold text-teal-700">{d.date}</span>
                </div>
              ))}
            </div>
            <Link
              to="/contact"
              className="block w-full text-center bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded transition-colors"
            >
              Start an Enquiry →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
