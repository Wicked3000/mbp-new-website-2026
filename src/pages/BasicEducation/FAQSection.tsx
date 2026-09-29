import { useEntity } from "@/hooks/useDynamic";
import Reveal from "@/components/Reveal";

export function FAQSection() {
  const FAQS_FALLBACK = [
    {
      q: "At what age should my child start Elementary Prep?",
      a: "Children should be 6 years old by June 30 of the enrolment year to start Elementary Prep. Early or late enrolment requires approval from the Provincial Education Advisor.",
    },
    {
      q: "What language is used for instruction in Elementary grades?",
      a: "Elementary Prep to Grade 2 uses the local vernacular language (or Tok Pisin in multilingual settings) as the medium of instruction. English is introduced as a subject from Elementary 2 and becomes the medium of instruction from Grade 3 onwards.",
    },
    {
      q: "How do I enrol my child in a Basic Education school?",
      a: "Visit your nearest school during enrolment period (typically January). Bring your child's birth certificate or clinic card, and proof of residence. The head teacher will process the enrolment. No fees are charged under the Tuition Fee Free policy.",
    },
    {
      q: "What is the Grade 8 National Examination?",
      a: "The Grade 8 Examination is a national assessment held annually in October. It covers English, Mathematics, Science, and Social Science. Results determine placement into Grade 9 (Post Primary) and certification of Basic Education completion.",
    },
    {
      q: "My child has a disability. Can they attend a regular school?",
      a: "Yes. The Division is implementing inclusive education across schools. Contact the Basic Education Officer to discuss your child's needs. Specialist teacher aides and adaptive resources are available in pilot schools, with expansion planned.",
    },
    {
      q: "How can I get a copy of my child's Grade 8 certificate?",
      a: "Certificates are issued by the Measurement Services Division of NDoE through the school. If lost, apply through your former school with a statutory declaration and K20 processing fee. Contact the Basic Education helpdesk for assistance.",
    },
  ];
  const { data: faqs } = useEntity("basic_faq", FAQS_FALLBACK);
  const { data: headings } = useEntity("basic_section_headings", []);
  const heading =
    headings.find((h: any) => h.skey === "faq") || {
      eyebrow: "Frequently Asked",
      heading: "Common Questions",
    };

  return (
    <section className="py-16 px-4 bg-white">
      <Reveal className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-teal-500 text-xs font-bold uppercase tracking-widest">
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
                <span className="text-teal-500 transition-transform group-open:rotate-180">▼</span>
              </summary>
              <div className="px-5 pb-5 pt-0 text-gray-600 leading-relaxed border-t border-gray-200">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
