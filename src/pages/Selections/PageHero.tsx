import { Link } from "react-router-dom";

export function PageHero() {
  return (
    <section className="relative h-[400px] sm:h-[480px] overflow-hidden bg-[#0B2545]">
      <img
        src="https://images.unsplash.com/photo-1587440871870-84826771b576?w=1600&h=900&fit=crop&auto=format"
        alt="Students checking results"
        className="absolute inset-0 w-full h-full object-cover object-center opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0B2545]/90 via-[#0B2545]/70 to-[#163663]/40" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 h-full flex flex-col justify-center">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-[#C9A84C]/20 border border-[#C9A84C]/40 text-[#E2C47A] text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] inline-block" />
            2026 Selection Lists
          </div>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-5"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Grade 9 & 11 Selections
            <span className="block text-[#C9A84C]">2026 Academic Year</span>
          </h1>
          <p className="text-blue-100 text-lg leading-relaxed max-w-2xl">
            Official placement lists for students transitioning to Grade 9 (Secondary) and Grade 11
            (Upper Secondary) across Milne Bay Province schools.
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
            <Link
              to="#grade9"
              className="inline-flex items-center gap-2 bg-[#C9A84C] hover:bg-[#B8953E] text-[#0B2545] font-semibold px-6 py-3 rounded transition-colors"
            >
              Grade 9 Selection
            </Link>
            <Link
              to="#grade11"
              className="inline-flex items-center gap-2 border border-[#C9A84C] text-[#E2C47A] hover:bg-[#C9A84C]/10 hover:text-white font-semibold px-6 py-3 rounded transition-colors"
            >
              Grade 11 Selection
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
