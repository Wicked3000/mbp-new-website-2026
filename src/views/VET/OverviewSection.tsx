"use client";

import { useEntity } from "@/hooks/useDynamic";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";

export function OverviewSection() {
  const OVERVIEW_FALLBACK = {
    eyebrow: "Program Overview",
    heading: "Skills for Employment & Entrepreneurship",
    intro:
      "The VET program provides competency-based skills training aligned with national qualifications. The Division coordinates 6 registered VET centres across the province, offering certificate and diploma programs in priority trade areas.",
    body: "Training is open to Grade 10 and Grade 12 school leavers, out-of-school youth, and existing workers seeking formal recognition. Programs range from 6-month certificates to 2-year diplomas, with pathways to higher education and apprenticeships.",
    features_title: "Key Features",
  };
  const CARDS_FALLBACK = [
    {
      icon: "🔧",
      title: "Competency-Based Training",
      desc: "Industry-aligned qualifications (NC1–NC3) assessed against national competency standards",
    },
    {
      icon: "🏭",
      title: "Workplace Learning",
      desc: "Structured workplace training & industry attachments mandatory for all programs",
    },
    {
      icon: "📜",
      title: "National Certification",
      desc: "TVET Authority accredited; qualifications recognized nationally and regionally",
    },
    {
      icon: "🚀",
      title: "Pathways to Higher Study",
      desc: "Credit articulation into technical colleges, universities, and apprenticeship schemes",
    },
  ];
  const FEATURES_FALLBACK = [
    { feature: "Free tuition for eligible students under Government subsidy" },
    { feature: "8 trade programs across 6 training centres" },
    { feature: "Industry partnerships with PNG LNG, Ok Tedi, local businesses" },
    { feature: "Recognition of Prior Learning (RPL) for experienced workers" },
    { feature: "Entrepreneurship & business skills embedded in all courses" },
    { feature: "Job placement support through provincial industry links" },
  ];
  const STATS_FALLBACK = [
    { value_text: "6", label: "Training Centres", color: "bg-[#0D9488]" },
    { value_text: "8", label: "Trade Programs", color: "bg-[#14B8A6]" },
    { value_text: "1,200+", label: "Annual Trainees", color: "bg-teal-600" },
    { value_text: "85%", label: "Employment Rate", color: "bg-teal-700" },
  ];

  const { data: overviewRows } = useEntity("vet_overview", [OVERVIEW_FALLBACK]);
  const { data: cards } = useEntity("vet_overview_cards", CARDS_FALLBACK);
  const { data: features } = useEntity("vet_overview_features", FEATURES_FALLBACK);
  const { data: stats } = useEntity("vet_overview_stats", STATS_FALLBACK);
  const overview = { ...OVERVIEW_FALLBACK, ...(overviewRows?.[0] || {}) };

  return (
    <section id="overview" className="bg-[#F8F6F1] py-16 px-4">
      <Reveal className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <span className="text-teal-400 text-xs font-bold uppercase tracking-widest">
              {overview.eyebrow}
            </span>
            <h2
              className="text-4xl font-bold text-[#0B2545] mt-2 mb-6 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {overview.heading}
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4 text-lg">{overview.intro}</p>
            <p className="text-gray-600 leading-relaxed mb-6">{overview.body}</p>
            <div className="space-y-4">
              {cards.map((item: any) => (
                <div
                  key={item.title}
                  className="flex gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-teal-200 hover:shadow-md transition-all"
                >
                  <div className="text-2xl shrink-0"><Icon name={item.icon} size={20} /></div>
                  <div>
                    <h3 className="text-[#0B2545] font-bold mb-1">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100">
              <img loading="lazy" decoding="async" src="/assets/vet/vet-img.jpg" alt="Workshop training" className="w-full h-64 object-cover" />
              <div className="p-6">
                <h3
                  className="text-xl font-bold text-[#0B2545] mb-3"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {overview.features_title}
                </h3>
                <ul className="space-y-3">
                  {features.map((row: any, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <span className="text-amber-300 shrink-0"><Icon name="check" size={20} className="text-amber-300 shrink-0" /></span>
                      <span className="text-gray-700">{row.feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {stats.map((s: any) => (
                <div key={s.label} className={`${s.color} rounded-xl p-5 text-white text-center`}>
                  <div
                    className="text-3xl font-bold"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {s.value_text}
                  </div>
                  <div className="text-amber-100 text-sm uppercase tracking-wider">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
