import { Link } from "react-router-dom";
import { useEntity } from "@/hooks/useDynamic";
import Reveal from "@/components/Reveal";

export function SupportSection() {
  const SUPPORT_FALLBACK = [
    {
      icon: "📄",
      title: "Curriculum Materials",
      desc: "Syllabuses, teacher guides, student workbooks distributed annually",
    },
    {
      icon: "🏗️",
      title: "Infrastructure Grants",
      desc: "Maintenance and construction funding through SLIP and TFF",
    },
    {
      icon: "👨‍🏫",
      title: "Teacher Professional Development",
      desc: "In-service training, cluster workshops, and certification support",
    },
    {
      icon: "📊",
      title: "Data & Monitoring",
      desc: "EMIS reporting, school inspections, and performance dashboards",
    },
    {
      icon: "🤝",
      title: "Community Engagement",
      desc: "Board of Management training, P&C support, awareness campaigns",
    },
    {
      icon: "🚨",
      title: "Emergency Response",
      desc: "Cyclone/disaster recovery, temporary learning spaces, psychosocial support",
    },
  ];
  const CONTACT_FALLBACK = {
    heading: "Basic Education Helpdesk",
    body: "Need assistance with enrolments, transfers, curriculum, or school issues? Our dedicated Basic Education support team is here to help.",
    phone_label: "Provincial Basic Education Officer",
    phone_value: "+675 641 1234 (ext. 2)",
    email_label: "Email",
    email_value: "basic.education@mbpeducation.gov.pg",
    office_label: "Office",
    office_value: "Division of Education, Alotau",
    button_label: "Submit Enquiry",
    button_href: "/contact",
  };
  const { data: support } = useEntity("basic_support", SUPPORT_FALLBACK);
  const { data: contactRows } = useEntity("basic_support_contact", [CONTACT_FALLBACK]);
  const { data: headings } = useEntity("basic_section_headings", []);
  const contact = { ...CONTACT_FALLBACK, ...(contactRows?.[0] || {}) };
  const heading =
    headings.find((h: any) => h.skey === "support") || {
      eyebrow: "Support & Resources",
      heading: "For Teachers, Parents & Communities",
      blurb: "The Division provides comprehensive support to ensure every school can deliver quality basic education.",
    };

  return (
    <section className="bg-[#0B2545] py-16 px-4">
      <Reveal className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <span className="text-teal-400 text-xs font-bold uppercase tracking-widest">
              {heading.eyebrow}
            </span>
            <h2
              className="text-4xl font-bold text-white mt-2 mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {heading.heading}
            </h2>
            {heading.blurb && (
              <p className="text-teal-100 leading-relaxed mb-8">{heading.blurb}</p>
            )}
            <div className="space-y-4">
              {support.map((item: any) => (
                <div
                  key={item.title}
                  className="flex gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-teal-500/50 hover:bg-white/10 transition-all"
                >
                  <span className="text-2xl shrink-0">{item.icon}</span>
                  <div>
                    <h3 className="text-white font-semibold">{item.title}</h3>
                    <p className="text-teal-200 text-sm">{item.desc}</p>
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
            <p className="text-teal-200 mb-6">{contact.body}</p>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-white">
                <span className="text-teal-400 text-xl">📞</span>
                <div>
                  <div className="text-sm text-teal-200">{contact.phone_label}</div>
                  <div className="font-semibold">{contact.phone_value}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-white">
                <span className="text-teal-400 text-xl">✉️</span>
                <div>
                  <div className="text-sm text-teal-200">{contact.email_label}</div>
                  <div className="font-semibold">{contact.email_value}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-white">
                <span className="text-teal-400 text-xl">📍</span>
                <div>
                  <div className="text-sm text-teal-200">{contact.office_label}</div>
                  <div className="font-semibold">{contact.office_value}</div>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-white/10">
              <Link
                to={contact.button_href}
                className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white font-semibold px-6 py-3 rounded transition-colors"
              >
                {contact.button_label} →
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
