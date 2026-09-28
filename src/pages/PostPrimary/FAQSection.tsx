import { useEntity } from "@/hooks/useDynamic";

export function FAQSection() {
  const FAQS_FALLBACK = [
    {
      q: "How does my child get into a secondary school?",
      a: "Placement is based on Grade 8 Examination results. Students apply through the national online selection system (Grade 9 Selection). The Division manages provincial quotas for each school.",
    },
    {
      q: "What is the difference between National High and Provincial High schools?",
      a: "National High Schools (e.g., Cameron) are centrally funded, selective entry, and offer all streams. Provincial High Schools are provincially funded, serve local catchments, and may offer limited streams based on resources.",
    },
    {
      q: "Can my child change streams in Grade 11?",
      a: "Stream changes are possible in the first 4 weeks of Grade 11 with principal approval and subject teacher assessment. After this, changes are not permitted due to assessment requirements.",
    },
    {
      q: "What if my child fails the Grade 10 Exam?",
      a: "Students can repeat Grade 10 at their school, enrol in FODE to upgrade, or enter VET certificate programs. The Division provides counselling on alternative pathways.",
    },
    {
      q: "Are there scholarships for Grade 12 graduates?",
      a: "Yes: TESAS (tertiary), HECAS, and provincial government scholarships. The Division coordinates nominations. Criteria: academic merit, financial need, priority workforce areas.",
    },
    {
      q: "How do I get my Grade 12 certificate reissued?",
      a: "Apply through Measurement Services Division (NDoE) with statutory declaration, police report (if lost), and K30 fee. Processing: 4–6 weeks. Contact Post Primary helpdesk for assistance.",
    },
  ];
  const { data: faqs } = useEntity("post_faq", FAQS_FALLBACK);
  const { data: headings } = useEntity("post_section_headings", []);
  const heading =
    headings.find((h: any) => h.skey === "faq") || {
      eyebrow: "Frequently Asked",
      heading: "Common Questions",
    };

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-amber-500 text-xs font-bold uppercase tracking-widest">
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
                <span className="text-amber-500 transition-transform group-open:rotate-180">▼</span>
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
