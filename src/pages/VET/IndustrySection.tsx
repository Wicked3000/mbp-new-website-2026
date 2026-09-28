import { useEntity } from "@/hooks/useDynamic";

export function IndustrySection() {
  const PARTNERS_FALLBACK = [
    { name: "PNG LNG Project", sector: "Oil & Gas", programs: "Engineering, Welding, Electrical, Safety", icon: "🛢️" },
    { name: "Ok Tedi Mining", sector: "Mining", programs: "Heavy Diesel, Electrical, Mechanical", icon: "⛏️" },
    { name: "Pacific Towing", sector: "Maritime", programs: "Deck Rating, Engine Rating, Marine Engineering", icon: "🚢" },
    { name: "Kumul Consolidated Holdings", sector: "State Enterprises", programs: "Multiple trades across subsidiaries", icon: "🏛️" },
    { name: "Alotau Chamber of Commerce", sector: "Private Sector", programs: "Hospitality, Business, Construction", icon: "🤝" },
    { name: "Provincial Health Authority", sector: "Health", programs: "Biomedical Equipment, Maintenance", icon: "🏥" },
  ];
  const APPRENTICESHIP_FALLBACK = [
    { icon: "🎓", heading: "Apprenticeship & Traineeship Program", body: "The Division facilitates formal apprenticeships combining on-the-job training with structured off-the-job learning. Employers receive wage subsidies; apprentices earn while they learn.", bullet: "4-year apprenticeships in Engineering, Construction, Automotive" },
    { icon: "🎓", heading: "Apprenticeship & Traineeship Program", body: "The Division facilitates formal apprenticeships combining on-the-job training with structured off-the-job learning. Employers receive wage subsidies; apprentices earn while they learn.", bullet: "2-year traineeships in Hospitality, Business, ICT" },
    { icon: "🎓", heading: "Apprenticeship & Traineeship Program", body: "The Division facilitates formal apprenticeships combining on-the-job training with structured off-the-job learning. Employers receive wage subsidies; apprentices earn while they learn.", bullet: "Competency-based progression (not time-based)" },
    { icon: "🎓", heading: "Apprenticeship & Traineeship Program", body: "The Division facilitates formal apprenticeships combining on-the-job training with structured off-the-job learning. Employers receive wage subsidies; apprentices earn while they learn.", bullet: "National Trade Testing on completion" },
    { icon: "🎓", heading: "Apprenticeship & Traineeship Program", body: "The Division facilitates formal apprenticeships combining on-the-job training with structured off-the-job learning. Employers receive wage subsidies; apprentices earn while they learn.", bullet: "Pathway to Certificate IV & Diploma" },
    { icon: "🎓", heading: "Apprenticeship & Traineeship Program", body: "The Division facilitates formal apprenticeships combining on-the-job training with structured off-the-job learning. Employers receive wage subsidies; apprentices earn while they learn.", bullet: "Employer incentives & training support" },
  ];
  const { data: partners } = useEntity("vet_partners", PARTNERS_FALLBACK);
  const { data: apprenticeship } = useEntity("vet_apprenticeship", APPRENTICESHIP_FALLBACK);
  const { data: headings } = useEntity("vet_section_headings", []);
  const heading =
    headings.find((h: any) => h.skey === "industry") || {
      eyebrow: "Industry Partnerships",
      heading: "Training for Real Jobs",
      blurb: "Strong industry links ensure curriculum relevance, workplace placements, and employment pathways for graduates.",
    };
  // The callout rendered its icon, heading and body once above the bullet list.
  const callout = apprenticeship[0] || {
    icon: "🎓",
    heading: "Apprenticeship & Traineeship Program",
    body: "",
  };

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
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
          {partners.map((p: any) => (
            <div
              key={p.name}
              className="bg-[#F8F6F1] rounded-xl p-6 border border-gray-100 hover:border-teal-200 hover:shadow-lg transition-all"
            >
              <div className="text-3xl mb-3">{p.icon}</div>
              <h3
                className="text-lg font-bold text-[#0B2545] mb-1"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {p.name}
              </h3>
              <div className="text-teal-600 text-xs font-semibold uppercase tracking-wider mb-2">
                {p.sector}
              </div>
              <p className="text-gray-600 text-sm mb-3">{p.programs}</p>
              <div className="text-teal-600 text-xs font-medium">Active Partnership</div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-teal-50 rounded-xl border border-teal-100">
          <div className="flex items-start gap-4">
            <div className="text-3xl shrink-0">{callout.icon}</div>
            <div>
              <h3
                className="text-xl font-bold text-[#0B2545] mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {callout.heading}
              </h3>
              <p className="text-gray-600 mb-4">{callout.body}</p>
              <ul className="space-y-2 text-gray-700 text-sm grid sm:grid-cols-2">
                {apprenticeship.map((row: any, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-teal-500">•</span> {row.bullet}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
