import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useEntity } from "@/hooks/useDynamic";
import { useDistrictCount } from "@/hooks/useDistricts";
import { HERO_FALLBACK } from "./fallbackData";

// Two minutes per slide. Long enough that a visitor reading the heading and
// paragraph is not interrupted mid-sentence, which is what a carousel set to
// seconds effectively does.
const ROTATION_MS = 120_000;

export function HeroSection() {
  const { data: slides } = useEntity("hero_slides", HERO_FALLBACK);
  // Counted, not typed. This line used to state a district figure far higher
  // than the one the site actually holds, and a visitor could see the
  // disagreement by opening the districts page.
  const districtCount = useDistrictCount();
  const list = (slides as any[]).filter((s: any) => s.is_active !== 0);
  const [current, setCurrent] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Auto-rotation is a moving, non-essential effect, so it stops for anyone who
  // has asked for reduced motion, and while a pointer or keyboard focus is
  // inside the slider - reading a slide mid-fade should not have a new image
  // appear underneath the reader. There is deliberately no pause button: the
  // hero is presentation, and the only thing it competes with is the text above
  // it, which is static.
  const paused = hovered || focusWithin || reducedMotion;

  const go = useCallback(
    (dir: number) => {
      if (list.length < 2) return;
      setCurrent((p) => (p + dir + list.length) % list.length);
    },
    [list.length],
  );

  useEffect(() => {
    setCurrent((p) => (list.length ? p % list.length : 0));
  }, [list.length]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReducedMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (paused || list.length < 2) return;
    const id = setInterval(() => go(1), ROTATION_MS);
    return () => clearInterval(id);
  }, [paused, go]);

  return (
    <section
      // data-page-hero marks this as the page banner. It is not the shared
      // PageHero component - the home page's banner is a rotating carousel,
      // which has no equivalent elsewhere - but it serves the same structural
      // role, so it carries the same marker and check:banners accepts it.
      data-page-hero=""
      // Fills the viewport minus the sticky header and the announcement bar
      // above it, so the first screen is entirely hero. dvh rather than vh:
      // on mobile, vh does not account for the browser chrome, which makes the
      // bottom of the hero sit under the address bar. min-h, not h, so a long
      // headline or a narrow screen grows the section instead of clipping it.
      className="relative overflow-hidden bg-[#07192E] flex items-center min-h-[calc(100vh-7.5rem)] min-h-[calc(100svh-7.5rem)]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocusWithin(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setFocusWithin(false);
      }}
      role="region"
      aria-roledescription="carousel"
      aria-label="Hero slider"
    >
      {/* Slider images */}
      <div className="absolute inset-0" aria-live={paused ? "polite" : "off"}>
        {list.map((slide: any, i: number) => (
          <div
            key={slide.src + i}
            role="group"
            aria-roledescription="slide"
            aria-label={`Slide ${i + 1} of ${list.length}`}
            aria-hidden={i !== current}
            className="absolute inset-0"
          >
            <img
              src={slide.src}
              alt={slide.alt}
              className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-[1200ms] ease-in-out ${
                i === current ? "opacity-100" : "opacity-0"
              }`}
              loading={i === 0 ? "eager" : "lazy"}
              decoding="async"
            />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#07192E]/60 via-[#0B2545]/40 to-[#0B2545]/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#07192E]/45 via-transparent to-transparent" />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Controls */}
      <button
        onClick={() => go(-1)}
        aria-label="Previous slide"
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white hover:bg-white hover:text-[#0B2545] transition-colors hidden sm:grid place-items-center"
      >
        <span aria-hidden="true">‹</span>
      </button>
      <button
        onClick={() => go(1)}
        aria-label="Next slide"
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white hover:bg-white hover:text-[#0B2545] transition-colors hidden sm:grid place-items-center"
      >
        <span aria-hidden="true">›</span>
      </button>

      {/* Dots. The section is now viewport-height and its content is centred, so
          the content block could reach these. The extra bottom padding on the
          content keeps them clear of the last element. */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {list.map((_: any, i: number) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === current}
            className={`transition-all rounded-full ${
              i === current ? "w-8 h-2.5 bg-[#C9A84C]" : "w-2.5 h-2.5 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>

      {/* pb leaves room for the slide dots, which sit at the section's bottom
          edge now that it fills the viewport. */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 pt-14 pb-24 sm:pt-16 sm:pb-24 lg:pt-20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/15 text-[#E2C47A] text-[11px] font-bold uppercase tracking-[0.14em] px-3 py-1.5 rounded-full mb-5">
            <span className="w-2 h-2 rounded-full bg-[#C9A84C] animate-pulse inline-block" />
            Milne Bay Province • Papua New Guinea
          </div>
          <h1
            className="text-[40px] sm:text-[54px] lg:text-[62px] font-bold text-white leading-[0.95] tracking-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Quality Education
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#14B8A6] to-[#C9A84C]">
              for Every Child
            </span>
          </h1>
          <p className="text-blue-100/90 text-[17px] leading-relaxed mt-4 max-w-xl font-light">
            The Division of Education oversees and supports all levels of schooling from elementary
            through post-secondary across{" "}
            <span className="text-white font-semibold">
              {districtCount} districts &amp; 312 schools.
            </span>
          </p>

          <div className="flex flex-wrap gap-3 mt-8">
            <Link
              to="/basic"
              className="inline-flex items-center gap-2 bg-[#C9A84C] text-[#0B2545] font-bold px-6 py-3 rounded-full hover:bg-[#d4b45e] transition-colors shadow-md"
            >
              Explore Programs →
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur text-white font-semibold px-6 py-3 rounded-full border border-white/20 hover:bg-white hover:text-[#0B2545] transition-colors"
            >
              Contact Division
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
