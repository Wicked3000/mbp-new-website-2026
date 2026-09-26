export function FAQSection() {
  const FAQS = [
    {
      q: "When will the 2026 Grade 9 and Grade 11 Selection Lists be released?",
      a: "Lists are typically published in late January 2026, after Grade 8 and Grade 10 results are released (December 2025) and the National Online Selection System (NOSS) processing is complete (mid-January).",
    },
    {
      q: "How do I check if my child has been selected?",
      a: "1) Visit the school noticeboard where lists are posted. 2) Check the Division of Education website (this page). 3) Check the NDoE website. 4) SMS notification sent to registered parent phone numbers.",
    },
    {
      q: "What if my child is not on the selection list?",
      a: "Options: 1) Appeal through the Provincial Selection Committee (2 weeks after publication). 2) Apply for FODE (distance education) - continuous enrolment. 3) Consider VET certificate programs. 4) Repeat Grade 8/10 to improve scores.",
    },
    {
      q: "How are students selected for Grade 9 and Grade 11?",
      a: "Automated matching via NOSS based on: (1) Exam score (highest first), (2) School preferences (1st choice priority), (3) School capacity limits, (4) District quotas for boarding schools. Same process for both grades.",
    },
    {
      q: "Can I change my child's school after selection?",
      a: "Transfers are possible but limited. Submit transfer request to Provincial Education Office within 2 weeks of term start. Approved only if: space available at requested school, valid reason (medical, relocation), both principals agree.",
    },
    {
      q: "What are the cutoff scores for each school?",
      a: "Cutoffs vary yearly based on applicant pool. 2026 cutoffs are shown in the tables above. Cameron Secondary (National High) typically highest (185+ for Gr 9, 220+ for Gr 11 Science). Rural schools lower (75–120).",
    },
    {
      q: "My child was selected for a boarding school. What next?",
      a: "School will send admission letter with: reporting date, fees (boarding component), required items (uniform, bedding, toiletries), medical form. Parents must confirm acceptance and pay deposit by deadline.",
    },
    {
      q: "Where can I get help with the selection process?",
      a: "Contact: Provincial Selection Helpdesk +675 641 1234 ext. 2 (Basic) or ext. 3 (Post Primary). Email: selections@mbpeducation.gov.pg. Visit your District Education Office for in-person assistance.",
    },
  ];

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-[#C9A84C] text-xs font-bold uppercase tracking-widest">
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
                <span className="text-[#C9A84C] transition-transform group-open:rotate-180">▼</span>
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
