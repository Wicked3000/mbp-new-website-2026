"use client";

import Link from "next/link";
import { useEntity } from "@/hooks/useDynamic";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";

export function SupportSection() {
  const SUPPORT_FALLBACK = [
    { icon: "👨‍🏫", title: "Dedicated Tutors", desc: "Subject-specialist tutors at each centre; phone/WhatsApp/email support; monthly progress calls" },
    { icon: "📚", title: "Learning Resources", desc: "Full textbook sets, video lessons, past exam papers, marking guides, study planners" },
    { icon: "💰", title: "Financial Support", desc: "Government FODE subsidy (free tuition), travel allowances for exams, device loan scheme" },
    { icon: "🧭", title: "Career & Pathway Guidance", desc: "Grade 12 tertiary applications, VET articulation, resume building, interview prep" },
    { icon: "🤝", title: "Peer Support Networks", desc: "WhatsApp study groups, centre study buddies, alumni mentoring, graduation events" },
    { icon: "🌏", title: "Inclusive Access", desc: "Materials in large print/audio, sign language tutors, disability support officers at main centres" },
  ];
  const CONTACT_FALLBACK = {
    heading: "FODE Helpdesk",
    body: "Enrolment, materials, exams, tutor issues, technical support, pathway advice.",
    phone_label: "Provincial FODE Coordinator",
    phone_value: "+675 641 1234 (ext. 5)",
    email_label: "Email",
    email_value: "fode@mbpeducation.gov.pg",
    whatsapp_label: "WhatsApp Support",
    whatsapp_value: "+675 7XXX XXXX",
    office_label: "Main Centre",
    office_value: "Alotau FODE Centre, Milne Bay",
    button_label: "Contact FODE Team",
    button_href: "/contact",
  };
  const { data: support } = useEntity("fode_support", SUPPORT_FALLBACK);
  const { data: contactRows } = useEntity("fode_support_contact", [CONTACT_FALLBACK]);
  const { data: headings } = useEntity("fode_section_headings", []);
  const contact = { ...CONTACT_FALLBACK, ...(contactRows?.[0] || {}) };
  const heading =
    headings.find((h: any) => h.skey === "support") || {
      eyebrow: "Student Support",
      heading: "Every Learner Supported",
      blurb: "Comprehensive support ensuring distance learners succeed - from enrolment to graduation and beyond.",
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
                  className="flex gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-teal-400/50 hover:bg-white/10 transition-all"
                >
                  <span className="text-2xl shrink-0"><Icon name={item.icon} size={20} className="text-teal-400" /></span>
                  <div>
                    <h3 className="text-white font-semibold">{item.title}</h3>
                    <p className="text-teal-100 text-sm">{item.desc}</p>
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
            <p className="text-teal-100 mb-6">{contact.body}</p>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-white">
                <span className="text-teal-400 text-xl"><Icon name="phone" size={18} className="text-teal-400" /></span>
                <div>
                  <div className="text-sm text-teal-100">{contact.phone_label}</div>
                  <div className="font-semibold">{contact.phone_value}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-white">
                <span className="text-teal-400 text-xl"><Icon name="mail" size={18} className="text-teal-400" /></span>
                <div>
                  <div className="text-sm text-teal-100">{contact.email_label}</div>
                  <div className="font-semibold">{contact.email_value}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-white">
                <span className="text-teal-400 text-xl"><Icon name="smartphone" size={18} className="text-teal-400" /></span>
                <div>
                  <div className="text-sm text-teal-100">{contact.whatsapp_label}</div>
                  <div className="font-semibold">{contact.whatsapp_value}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-white">
                <span className="text-teal-400 text-xl"><Icon name="map-pin" size={18} className="text-teal-400" /></span>
                <div>
                  <div className="text-sm text-teal-100">{contact.office_label}</div>
                  <div className="font-semibold">{contact.office_value}</div>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-white/10">
              <Link
                href={contact.button_href}
                className="inline-flex items-center gap-2 bg-teal-400 hover:bg-teal-500 text-white font-semibold px-6 py-3 rounded transition-colors"
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
