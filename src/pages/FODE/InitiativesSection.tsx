import { useEntity } from "@/hooks/useDynamic";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";

export function InitiativesSection() {
  const INITIATIVES_FALLBACK = [
    { title: "FODE Mobile App Launch", desc: "Offline-first Android app with full curriculum, video lessons, assignment upload, and tutor chat. 2,000+ downloads target for 2026.", icon: "📱", status: "Launched", color: "bg-teal-500" },
    { title: "Satellite Internet for Island Centres", desc: "Starlink terminals at 6 remote island centres (Kiriwina, Losuia, Esa'ala, Samarai, Misima, Rossel). High-speed access for LMS & video calls.", icon: "🛰️", status: "Rolling Out", color: "bg-blue-500" },
    { title: "Radio Education Expansion", desc: "Daily 1-hour slots on NBC Milne Bay. New studio at Alotau Centre. Programs in English & Tok Pisin. Reaches 95% of province.", icon: "📻", status: "Active", color: "bg-amber-500" },
    { title: "Women's Learning Circles", desc: "Safe study spaces for women with childcare. Female tutors. Flexible timing. 40% female enrolment increase since 2024.", icon: "👩‍🎓", status: "Active", color: "bg-pink-500" },
    { title: "Digital Literacy Integration", desc: "Basic ICT module now compulsory in all programs. Computer labs upgraded at all centres. ICDL certification pathway available.", icon: "💻", status: "New", color: "bg-indigo-500" },
    { title: "Tracer Study & Alumni Network", desc: "Annual graduate tracking (employment, further study). Alumni mentorship program. FODE graduates database for provincial workforce planning.", icon: "📊", status: "Active", color: "bg-purple-500" },
  ];
  const { data: initiatives } = useEntity("fode_initiatives", INITIATIVES_FALLBACK);
  const { data: headings } = useEntity("fode_section_headings", []);
  const heading =
    headings.find((h: any) => h.skey === "initiatives") || {
      eyebrow: "Key Initiatives",
      heading: "Innovating Distance Learning",
      blurb: "Strategic programs using technology and community engagement to reach every learner in Milne Bay.",
    };

  return (
    <section className="py-16 px-4 bg-white">
      <Reveal className="max-w-7xl mx-auto">
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
          {heading.blurb && (
            <p className="text-gray-500 mt-3 max-w-xl mx-auto text-base leading-relaxed">
              {heading.blurb}
            </p>
          )}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {initiatives.map((i: any) => (
            <div
              key={i.title}
              className="bg-[#F8F6F1] rounded-xl p-6 border border-gray-100 hover:border-teal-200 hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`${i.color} text-white rounded-lg p-2 shrink-0`}>
                  <span className="text-xl"><Icon name={i.icon} size={18} /></span>
                </div>
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 bg-white/80 rounded">
                  {i.status}
                </span>
              </div>
              <h3
                className="text-lg font-bold text-[#0B2545] mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {i.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">{i.desc}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
