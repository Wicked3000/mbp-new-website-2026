import { Link } from "react-router-dom";
import { useEntity } from "@/hooks/useDynamic";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";

export function SupportSection() {
  const SUPPORT_FALLBACK = [
    { icon: "📚", title: "Training Resources", desc: "Learning guides, assessment tools, e-learning portal, industry-standard equipment" },
    { icon: "👨‍🏫", title: "Trainer Development", desc: "Certificate IV in Training & Assessment, industry currency programs, moderation" },
    { icon: "🏢", title: "Employer Services", desc: "Apprentice sign-up, wage subsidies, workplace assessor training, skills audits" },
    { icon: "💰", title: "Funding & Scholarships", desc: "Government subsidies, industry scholarships, tool allowances, travel support" },
    { icon: "📊", title: "Quality Assurance", desc: "Internal audit, external moderation, TVET Authority compliance, tracer studies" },
    { icon: "🎯", title: "Job Placement", desc: "Industry job board, resume workshops, interview prep, graduate tracking system" },
  ];
  const CONTACT_FALLBACK = {
    heading: "VET Helpdesk",
    body: "Information on courses, enrolment, apprenticeships, RPL, employer incentives, and centre locations.",
    phone_label: "Provincial VET Coordinator",
    phone_value: "+675 641 1234 (ext. 4)",
    email_label: "Email",
    email_value: "vet@mbpeducation.gov.pg",
    office_label: "Office",
    office_value: "Alotau VET Centre, Milne Bay",
    button_label: "Contact VET Team",
    button_href: "/contact",
  };
  const { data: support } = useEntity("vet_support", SUPPORT_FALLBACK);
  const { data: contactRows } = useEntity("vet_support_contact", [CONTACT_FALLBACK]);
  const { data: headings } = useEntity("vet_section_headings", []);
  const contact = { ...CONTACT_FALLBACK, ...(contactRows?.[0] || {}) };
  const heading =
    headings.find((h: any) => h.skey === "support") || {
      eyebrow: "Support & Resources",
      heading: "For Trainees, Employers & Trainers",
      blurb: "Comprehensive support ecosystem ensuring quality training delivery and successful outcomes for all VET stakeholders.",
    };

  return (
    <section className="bg-[#0D9488] py-16 px-4">
      <Reveal className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <span className="text-amber-300 text-xs font-bold uppercase tracking-widest">
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
                  className="flex gap-4 p-4 bg-white/10 rounded-xl border border-white/20 hover:border-amber-300/50 hover:bg-white/15 transition-all"
                >
                  <span className="text-2xl shrink-0"><Icon name={item.icon} size={20} className="text-amber-300" /></span>
                  <div>
                    <h3 className="text-white font-semibold">{item.title}</h3>
                    <p className="text-teal-100 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/10 rounded-2xl p-8 border border-white/20">
            <h3
              className="text-2xl font-bold text-white mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {contact.heading}
            </h3>
            <p className="text-teal-100 mb-6">{contact.body}</p>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-white">
                <span className="text-amber-300 text-xl"><Icon name="phone" size={18} className="text-amber-300" /></span>
                <div>
                  <div className="text-sm text-teal-100">{contact.phone_label}</div>
                  <div className="font-semibold">{contact.phone_value}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-white">
                <span className="text-amber-300 text-xl"><Icon name="mail" size={18} className="text-amber-300" /></span>
                <div>
                  <div className="text-sm text-teal-100">{contact.email_label}</div>
                  <div className="font-semibold">{contact.email_value}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-white">
                <span className="text-amber-300 text-xl"><Icon name="map-pin" size={18} className="text-amber-300" /></span>
                <div>
                  <div className="text-sm text-teal-100">{contact.office_label}</div>
                  <div className="font-semibold">{contact.office_value}</div>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-white/20">
              <Link
                to={contact.button_href}
                className="inline-flex items-center gap-2 bg-amber-300 hover:bg-amber-400 text-[#0B2545] font-semibold px-6 py-3 rounded transition-colors"
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
