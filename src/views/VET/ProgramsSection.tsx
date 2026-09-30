"use client";

import Link from "next/link";
import { useEntity } from "@/hooks/useDynamic";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";

export function ProgramsSection() {
  const PROGRAMS_FALLBACK = [
    { code: "CPC10120", name: "Certificate I in Construction", duration: "6 months", level: "NC1", trades: "Carpentry, Masonry, Concreting", icon: "🔨", color: "bg-amber-500" },
    { code: "MEM10119", name: "Certificate I in Engineering", duration: "6 months", level: "NC1", trades: "Welding, Fitting, Machining", icon: "⚙️", color: "bg-blue-500" },
    { code: "AUR10120", name: "Certificate I in Automotive", duration: "6 months", level: "NC1", trades: "Light Vehicle, Diesel, Electrical", icon: "🚗", color: "bg-red-500" },
    { code: "UEE10120", name: "Certificate I in Electrotechnology", duration: "6 months", level: "NC1", trades: "Electrical, Renewable Energy", icon: "⚡", color: "bg-yellow-500" },
    { code: "SIT10122", name: "Certificate I in Hospitality", duration: "6 months", level: "NC1", trades: "Cookery, Front Office, Housekeeping", icon: "🍳", color: "bg-pink-500" },
    { code: "AHC10116", name: "Certificate I in Agriculture", duration: "6 months", level: "NC1", trades: "Crop Production, Livestock, Machinery", icon: "🌱", color: "bg-green-500" },
    { code: "ICT10119", name: "Certificate I in ICT", duration: "6 months", level: "NC1", trades: "Computer Hardware, Networking, Support", icon: "💻", color: "bg-purple-500" },
    { code: "MST10119", name: "Certificate I in Maritime", duration: "8 months", level: "NC1", trades: "Deck Rating, Engine Rating, Safety", icon: "⚓", color: "bg-cyan-500" },
  ];
  const { data: programs } = useEntity("vet_programs", PROGRAMS_FALLBACK);
  const { data: headings } = useEntity("vet_section_headings", []);
  const heading =
    headings.find((h: any) => h.skey === "programs") || {
      eyebrow: "Trade Programs",
      heading: "Certificate Courses Offered",
      blurb: "All programs are TVET Authority accredited. Graduates receive National Certificates (NC1) with pathways to NC2/NC3 and diploma programs.",
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {programs.map((p: any) => (
            <div
              key={p.code}
              className="bg-[#F8F6F1] rounded-xl p-6 border border-gray-100 hover:border-teal-300 hover:shadow-lg transition-all"
            >
              <div className={`${p.color} text-white rounded-lg p-2 inline-block mb-3`}>
                <span className="text-xl"><Icon name={p.icon} size={18} /></span>
              </div>
              <div
                className="text-[#0B2545] font-bold text-sm mb-1"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {p.name}
              </div>
              <div className="text-teal-600 text-xs font-semibold uppercase tracking-wider mb-2">
                {p.code} • {p.level}
              </div>
              <p className="text-gray-600 text-xs leading-relaxed mb-3">{p.trades}</p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Duration: {p.duration}</span>
                <Link href="/contact" className="text-teal-600 hover:text-teal-800 font-medium">
                  Enquire →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
