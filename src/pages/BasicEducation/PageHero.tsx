import { Link } from "react-router-dom";
import { useEntity } from "@/hooks/useDynamic";

export function BasicEducationPageHero() {
  const FALLBACK = {
    eyebrow: "Program 01 - Basic Education",
    title: "Basic Education",
    subtitle: "Elementary to Grade 8",
    description:
      "Providing foundational literacy, numeracy and life skills for all children from Prep through to Grade 8 across Milne Bay Province's 312 schools.",
    banner: "/assets/education_programs/basic/banner.jpg",
    alt: "Elementary school students in Milne Bay",
  };
  const { data } = useEntity("basic_hero", [FALLBACK]);
  const hero = { ...FALLBACK, ...(data?.[0] || {}) };
  return (
    <section className="relative h-[400px] sm:h-[480px] overflow-hidden bg-[#0B2545]">
      <img decoding="async"
        src={hero.banner}
        alt={hero.alt}
        className="absolute inset-0 w-full h-full object-cover object-center opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0B2545]/90 via-[#0B2545]/70 to-[#163663]/40" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 h-full flex flex-col justify-center">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-500/40 text-teal-300 text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 inline-block" />
            {hero.eyebrow}
          </div>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-5"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {hero.title}
            <span className="block text-teal-400">{hero.subtitle}</span>
          </h1>
          <p className="text-teal-100 text-lg leading-relaxed max-w-2xl">
            {hero.description}
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
            <Link
              to="#overview"
              className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white font-semibold px-6 py-3 rounded transition-colors"
            >
              Overview
            </Link>
            <Link
              to="#schools"
              className="inline-flex items-center gap-2 border border-teal-400 text-teal-300 hover:bg-teal-500/10 hover:text-white font-semibold px-6 py-3 rounded transition-colors"
            >
              Find Schools
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
