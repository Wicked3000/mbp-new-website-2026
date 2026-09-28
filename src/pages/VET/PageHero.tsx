import { Link } from "react-router-dom";
import { useEntity } from "@/hooks/useDynamic";

export function VETPageHero() {
  const FALLBACK = {
    eyebrow: "Program 03 - Vocational Education & Training",
    title: "Vocational Education",
    subtitle: " & Training (VET)",
    description:
      "Skills and trades training for out-of-school youth and adults, delivered through registered VET providers across Milne Bay Province - building a skilled workforce for PNG's future.",
    banner: "/assets/vet/vet-banner.jpg",
    alt: "VET training workshop",
  };
  const { data } = useEntity("vet_hero", [FALLBACK]);
  const hero = { ...FALLBACK, ...(data?.[0] || {}) };
  return (
    <section className="relative h-[400px] sm:h-[480px] overflow-hidden bg-[#0D9488]">
      <img decoding="async"
        src={hero.banner}
        alt={hero.alt}
        className="absolute inset-0 w-full h-full object-cover object-[50%_40%] opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0B2545]/90 via-[#163663]/70 to-[#0D9488]/30" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 h-full flex flex-col justify-center">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-amber-300/20 border border-amber-300/40 text-amber-200 text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-300 inline-block" />
            {hero.eyebrow}
          </div>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-5"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {hero.title}
            <span className="block text-amber-300">{hero.subtitle}</span>
          </h1>
          <p className="text-teal-100 text-lg leading-relaxed max-w-2xl">
            {hero.description}
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
            <Link
              to="#overview"
              className="inline-flex items-center gap-2 bg-amber-300 hover:bg-amber-400 text-[#0B2545] font-semibold px-6 py-3 rounded transition-colors"
            >
              Overview
            </Link>
            <Link
              to="#centres"
              className="inline-flex items-center gap-2 border border-amber-300 text-amber-200 hover:bg-amber-300/10 hover:text-white font-semibold px-6 py-3 rounded transition-colors"
            >
              Find Centres
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
