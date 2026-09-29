import { useEntity } from "@/hooks/useDynamic";
import Reveal from "@/components/Reveal";

export function InitiativesSection() {
  const INITIATIVES_FALLBACK = [
    { title: "New Centres in Alotau & Samarai", desc: "K5M investment for two new VET centres opening 2026. Alotau: expanded engineering/automotive. Samarai: maritime focus for island communities.", icon: "🏫", status: "Underway", color: "bg-teal-500" },
    { title: "Mobile Training Units", desc: "Fully equipped training trucks delivering short courses to remote districts. 3 units operational reaching 500+ trainees annually in villages.", icon: "🚚", status: "Active", color: "bg-blue-500" },
    { title: "Recognition of Prior Learning (RPL)", desc: "Fast-track certification for experienced workers without formal qualifications. Assessment weekends at all centres. 200+ certified in 2025.", icon: "📜", status: "Expanding", color: "bg-amber-500" },
    { title: "Women in Trades Initiative", desc: "Targeted recruitment, mentoring, and support for women in non-traditional trades. 35% female enrolment target by 2027. Childcare at centres.", icon: "👩‍🔧", status: "Active", color: "bg-pink-500" },
    { title: "Green Skills & Renewable Energy", desc: "New solar installation, biogas, and energy efficiency modules. Partnership with PNG Power & international NGOs. Aligned with PNG Climate Goals.", icon: "☀️", status: "New", color: "bg-green-500" },
    { title: "Digital Skills Integration", desc: "Basic ICT & digital literacy embedded in all trade programs. Computer labs at all centres. E-portfolio for competency evidence.", icon: "💻", status: "Rolling Out", color: "bg-indigo-500" },
  ];
  const { data: initiatives } = useEntity("vet_initiatives", INITIATIVES_FALLBACK);
  const { data: headings } = useEntity("vet_section_headings", []);
  const heading =
    headings.find((h: any) => h.skey === "initiatives") || {
      eyebrow: "Key Initiatives",
      heading: "Innovating Skills Development",
      blurb: "Strategic programs expanding access, improving quality, and aligning VET with emerging industry needs across Milne Bay.",
    };

  return (
    <section className="bg-[#F8F6F1] py-16 px-4">
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
              className="bg-white rounded-xl p-6 border border-gray-100 hover:border-teal-200 hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`${i.color} text-white rounded-lg p-2 shrink-0`}>
                  <span className="text-xl">{i.icon}</span>
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
