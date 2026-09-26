import { Link } from "react-router-dom";

export function EnrolmentSection() {
  return (
    <section className="bg-[#F8F6F1] py-16 px-4">
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
              Join Anytime, Study Anywhere
            </h2>
            <p className="text-gray-600 leading-relaxed mb-8">
              FODE has continuous enrolment with two main intakes. No age limit. No previous school
              required for foundation programs.
            </p>
            <div className="space-y-6">
              {[
                {
                  step: "01",
                  title: "Choose Your Program",
                  desc: "Grade 10 Upgrade, Grade 12 Upgrade, Matriculation, Adult Literacy, VET Pathway, or Teacher Upgrading. Counsellors available at all centres.",
                },
                {
                  step: "02",
                  title: "Gather Documents",
                  desc: "Birth certificate/ID, previous certificates (if any), passport photos, medical form. Grade 8/10 certs for upgrade programs.",
                },
                {
                  step: "03",
                  title: "Visit Nearest Centre",
                  desc: "12 study centres + 25 correspondence sites. Staff assist with forms, course selection, and material collection. Remote: apply via WhatsApp/phone.",
                },
                {
                  step: "04",
                  title: "Receive Materials",
                  desc: "Full course package: textbooks, workbooks, assignment booklets, study guide, exam timetable. Digital access via app/LMS activated.",
                },
                {
                  step: "05",
                  title: "Start Learning",
                  desc: "Flexible start - begin any week. Tutor assigned. Study plan created. Submit assignments monthly. Attend tutorials as schedule allows.",
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

          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <h3
              className="text-2xl font-bold text-[#0B2545] mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              2026 Key Dates
            </h3>
            <div className="space-y-4 mb-6">
              {[
                { label: "Major Intake 1 Opens", date: "15 January 2026" },
                { label: "Major Intake 1 Closes", date: "31 March 2026" },
                { label: "Grade 10 Exams (FODE)", date: "12–16 October 2026" },
                { label: "Grade 12 Exams (FODE)", date: "19–23 October 2026" },
                { label: "Major Intake 2 Opens", date: "1 July 2026" },
                { label: "Major Intake 2 Closes", date: "30 September 2026" },
                { label: "Results Released", date: "December 2026" },
                {
                  label: "Continuous Enrolment",
                  date: "Year-round (foundation programs)",
                },
              ].map((d) => (
                <div
                  key={d.label}
                  className="flex items-center justify-between py-3 border-b border-gray-100"
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
