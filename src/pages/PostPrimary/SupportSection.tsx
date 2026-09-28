import { Link } from "react-router-dom";
import { useEntity } from "@/hooks/useDynamic";

export function SupportSection() {
  const SUPPORT_FALLBACK = [
    {
      icon: "📄",
      title: "Curriculum & Exam Resources",
      desc: "Syllabuses, exam specs, past papers, marking guides distributed annually",
    },
    {
      icon: "🏗️",
      title: "Infrastructure & Maintenance",
      desc: "TFF infrastructure component, SLIP grants, boarding facility funding",
    },
    {
      icon: "👨‍🏫",
      title: "Teacher Development",
      desc: "In-service training, subject panels, HOD leadership programs, certification",
    },
    {
      icon: "📊",
      title: "Data & Quality Assurance",
      desc: "EMIS, school inspections, exam analysis, performance dashboards",
    },
    {
      icon: "🎓",
      title: "Student Support Services",
      desc: "Career guidance, counselling, scholarship info, tertiary applications",
    },
    {
      icon: "🚨",
      title: "Emergency & Resilience",
      desc: "Disaster recovery, psychosocial support, temporary learning spaces",
    },
  ];
  const CONTACT_FALLBACK = {
    heading: "Post Primary Helpdesk",
    body: "Assistance with enrolments, subject selection, exam queries, tertiary applications, and school transfers.",
    phone_label: "Provincial Post Primary Officer",
    phone_value: "+675 641 1234 (ext. 3)",
    email_label: "Email",
    email_value: "post.primary@mbpeducation.gov.pg",
    office_label: "Office",
    office_value: "Division of Education, Alotau",
    button_label: "Submit Enquiry",
    button_href: "/contact",
  };
  const { data: support } = useEntity("post_support", SUPPORT_FALLBACK);
  const { data: contactRows } = useEntity("post_support_contact", [CONTACT_FALLBACK]);
  const { data: headings } = useEntity("post_section_headings", []);
  const contact = { ...CONTACT_FALLBACK, ...(contactRows?.[0] || {}) };
  const heading =
    headings.find((h: any) => h.skey === "support") || {
      eyebrow: "Support & Resources",
      heading: "Empowering Schools & Students",
      blurb: "Comprehensive support ensuring every secondary school delivers quality education and every student can access their chosen pathway.",
    };

  return (
    <section className="bg-[#163663] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">
              {heading.eyebrow}
            </span>
            <h2
              className="text-4xl font-bold text-white mt-2 mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {heading.heading}
            </h2>
            {heading.blurb && (
              <p className="text-amber-100 leading-relaxed mb-8">{heading.blurb}</p>
            )}
            <div className="space-y-4">
              {support.map((item: any) => (
                <div
                  key={item.title}
                  className="flex gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-amber-500/50 hover:bg-white/10 transition-all"
                >
                  <span className="text-2xl shrink-0">{item.icon}</span>
                  <div>
                    <h3 className="text-white font-semibold">{item.title}</h3>
                    <p className="text-amber-200 text-sm">{item.desc}</p>
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
              {contact.heading}
            </h3>
            <p className="text-amber-200 mb-6">{contact.body}</p>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-white">
                <span className="text-amber-400 text-xl">📞</span>
                <div>
                  <div className="text-sm text-amber-200">{contact.phone_label}</div>
                  <div className="font-semibold">{contact.phone_value}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-white">
                <span className="text-amber-400 text-xl">✉️</span>
                <div>
                  <div className="text-sm text-amber-200">{contact.email_label}</div>
                  <div className="font-semibold">{contact.email_value}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-white">
                <span className="text-amber-400 text-xl">📍</span>
                <div>
                  <div className="text-sm text-amber-200">{contact.office_label}</div>
                  <div className="font-semibold">{contact.office_value}</div>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-white/10">
              <Link
                to={contact.button_href}
                className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-[#0B2545] font-semibold px-6 py-3 rounded transition-colors"
              >
                {contact.button_label} →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
