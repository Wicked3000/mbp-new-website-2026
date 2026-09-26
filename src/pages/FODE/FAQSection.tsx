export function FAQSection() {
  const FAQS = [
    {
      q: "Is a FODE certificate the same as a regular school certificate?",
      a: "Yes. FODE students sit the identical Grade 10 and Grade 12 National Examinations as conventional schools. Certificates are issued by the same authority (Measurement Services Division) with no distinction.",
    },
    {
      q: "Can I study FODE while working full-time?",
      a: "Absolutely. FODE is designed for flexible, self-paced learning. Many students work full-time. You submit assignments monthly and attend tutorials when your schedule allows. No fixed class times.",
    },
    {
      q: "How do I get course materials if I live on a remote island?",
      a: "Materials are shipped to your nearest centre or correspondence site by boat/plane. Digital materials sync via the mobile app when you have internet. Radio lessons broadcast weekly. Tutors visit remote sites quarterly.",
    },
    {
      q: "What if I fail an assignment or exam?",
      a: "Assignments can be resubmitted after tutor feedback. Failed exams can be re-sat at the next exam sitting (June or October). No limit on attempts. Tutor support provided for improvement.",
    },
    {
      q: "Can I transfer from FODE to a regular school?",
      a: "Yes. Credit transfer is available. Provide your FODE transcripts and certificates. The Division coordinates transfers with the receiving school. Many students do Grade 10 via FODE then enter Grade 11 conventionally.",
    },
    {
      q: "How much does FODE cost?",
      a: "Tuition is free under Government FODE subsidy. Students pay only for: exam fees (K50–K100), optional printing, and travel to exam centres. Device loan scheme available for eligible students.",
    },
  ];

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-teal-400 text-xs font-bold uppercase tracking-widest">
            Frequently Asked
          </span>
          <h2
            className="text-4xl font-bold text-[#0B2545] mt-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Common Questions
          </h2>
        </div>
        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <details
              key={i}
              className="group bg-[#F8F6F1] rounded-xl border border-gray-100 overflow-hidden"
            >
              <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                <h3 className="text-[#0B2545] font-semibold text-base pr-8">{faq.q}</h3>
                <span className="text-teal-400 transition-transform group-open:rotate-180">▼</span>
              </summary>
              <div className="px-5 pb-5 pt-0 text-gray-600 leading-relaxed border-t border-gray-200">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
