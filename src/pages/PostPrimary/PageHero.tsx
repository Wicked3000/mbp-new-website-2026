import { Link } from "react-router-dom";
import { useEntity } from "@/hooks/useDynamic";

export function PostPrimaryPageHero() {
  const FALLBACK = {
    eyebrow: "Program 02 - Post Primary",
    title: "Post Primary",
    subtitle: "Grades 9 – 12",
    description:
      "Secondary education pathways preparing students for tertiary admission, technical training, and employment across Milne Bay's 24 secondary and national high schools.",
    banner: "/assets/education_programs/post/banner.jpg",
    alt: "Secondary school students",
  };
  const { data } = useEntity("post_hero", [FALLBACK]);
  const hero = { ...FALLBACK, ...(data?.[0] || {}) };
  return (
    <section className="relative h-[400px] sm:h-[480px] overflow-hidden bg-[#163663]">
      <img decoding="async"
        src={hero.banner}
        alt={hero.alt}
        className="absolute inset-0 w-full h-full object-cover object-center opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#163663]/90 via-[#163663]/70 to-[#0B2545]/40" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 h-full flex flex-col justify-center">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
            {hero.eyebrow}
          </div>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-5"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {hero.title}
            <span className="block text-amber-400">{hero.subtitle}</span>
          </h1>
          <p className="text-amber-100 text-lg leading-relaxed max-w-2xl">
            {hero.description}
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
            <Link
              to="#overview"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-[#0B2545] font-semibold px-6 py-3 rounded transition-colors"
            >
              Overview
            </Link>
            <Link
              to="#schools"
              className="inline-flex items-center gap-2 border border-amber-400 text-amber-300 hover:bg-amber-400/10 hover:text-white font-semibold px-6 py-3 rounded transition-colors"
            >
              Find Schools
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
