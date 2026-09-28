import { useEntity } from "@/hooks/useDynamic";

export function FAQSection() {
  const FAQS_FALLBACK = [
    { q: "What are the entry requirements for VET certificate courses?", a: "Minimum Grade 10 certificate pass. Some trades require specific subjects (e.g., Maths/Science for Engineering). Mature age entry (21+) with relevant work experience considered. Medical fitness certificate required." },
    { q: "How much does VET training cost?", a: "Government-subsidized fees: K200–K500 per term depending on trade. Full fee-paying options available. Tool kits and PPE provided. Scholarships available for high-performing and disadvantaged students." },
    { q: "Can I do VET while working?", a: "Yes. Evening/weekend classes available for Certificate I in some trades. Block release (2 weeks on, 2 weeks off) for apprentices. RPL allows experienced workers to certify without full-time study." },
    { q: "What qualification will I receive?", a: "National Certificate Level 1 (NC1) on completion. Recognized by TVET Authority PNG. Pathways: NC2 → NC3 → Certificate IV → Diploma. Credit transfer to technical colleges and universities." },
    { q: "How do I apply for an apprenticeship?", a: "Employer must register with Division. Apprentice signs training contract. Division facilitates registration with TVET Authority. Wage subsidies available for employers. Contact VET Helpdesk for forms." },
    { q: "Are the new Samarai and Alotau centres open for 2026?", a: "Alotau VET Centre expansion: operational January 2026. Samarai VET Centre: opening July 2026 (maritime focus). Applications for both open October 2025. Limited places - apply early." },
  ];
  const { data: faqs } = useEntity("vet_faq", FAQS_FALLBACK);
  const { data: headings } = useEntity("vet_section_headings", []);
  const heading =
    headings.find((h: any) => h.skey === "faq") || {
      eyebrow: "Frequently Asked",
      heading: "Common Questions",
    };

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-teal-400 text-xs font-bold uppercase tracking-widest">
            {heading.eyebrow}
          </span>
          <h2
            className="text-4xl font-bold text-[#0B2545] mt-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {heading.heading}
          </h2>
        </div>
        <div className="space-y-4">
          {faqs.map((faq: any, i: number) => (
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
