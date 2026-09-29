import { Link } from "react-router-dom";
import { useEntity } from "@/hooks/useDynamic";
import Reveal from "@/components/Reveal";

export function EnrolmentSection() {
  const STEPS_FALLBACK = [
    { step: "01", title: "Choose a Trade", desc: "Review programs at vet.mbpeducation.gov.pg or visit your nearest centre. Consider your interests, aptitude, and local job market." },
    { step: "02", title: "Check Eligibility", desc: "Grade 10 certificate (minimum), medical fitness, age 16+. Mature entry (21+) considered with work experience. RPL available." },
    { step: "03", title: "Submit Application", desc: "Online at VET portal or paper form at any centre. Attach: certificates, ID, medical report, references. No application fee." },
    { step: "04", title: "Selection & Interview", desc: "Aptitude test + panel interview. Ranking based on grades, test, interview. Results within 2 weeks. Waitlist maintained." },
    { step: "05", title: "Enrol & Commence", desc: "Accept offer, pay subsidized fees (K200–K500/term), attend orientation. Tools & PPE provided. Training starts first Monday of term." },
  ];
  const DATES_FALLBACK = [
    { label: "January Intake Applications Open", date_text: "1 October 2025" },
    { label: "January Intake Applications Close", date_text: "30 November 2025" },
    { label: "January Intake Interviews", date_text: "8–12 December 2025" },
    { label: "January Intake Commences", date_text: "26 January 2026" },
    { label: "July Intake Applications Open", date_text: "1 April 2026" },
    { label: "July Intake Applications Close", date_text: "31 May 2026" },
    { label: "July Intake Interviews", date_text: "9–13 June 2026" },
    { label: "July Intake Commences", date_text: "20 July 2026" },
  ];
  const { data: steps } = useEntity("vet_enrolment_steps", STEPS_FALLBACK);
  const { data: dates } = useEntity("vet_intake_dates", DATES_FALLBACK);
  const { data: headings } = useEntity("vet_section_headings", []);
  const heading =
    headings.find((h: any) => h.skey === "enrolment") || {
      eyebrow: "How to Enrol",
      heading: "Start Your Trade Career",
      blurb: "VET enrolments open twice yearly (January & July intakes). Priority given to Grade 10/12 school leavers and out-of-school youth aged 16–35.",
    };

  return (
    <section className="py-16 px-4 bg-white">
      <Reveal className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <span className="text-teal-400 text-xs font-bold uppercase tracking-widest">
              {heading.eyebrow}
            </span>
            <h2
              className="text-4xl font-bold text-[#0B2545] mt-2 mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {heading.heading}
            </h2>
            {heading.blurb && <p className="text-gray-600 leading-relaxed mb-8">{heading.blurb}</p>}
            <div className="space-y-6">
              {steps.map((s: any) => (
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
              {dates.map((d: any) => (
                <div
                  key={d.label}
                  className="flex items-center justify-between py-3 border-b border-teal-100"
                >
                  <span className="text-gray-700">{d.label}</span>
                  <span className="font-semibold text-teal-700">{d.date_text}</span>
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
      </Reveal>
    </section>
  );
}
