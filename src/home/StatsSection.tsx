import { useEntity } from "@/hooks/useDynamic";
import Reveal from "@/components/Reveal";
import { StatsRow } from "@/components/StatsRow";
import { STATS_FALLBACK } from "@/data/fallbacks";

export function StatsSection() {
  // The fallback is the one in src/data/fallbacks.ts, which the About page uses
  // too. It used to have a private copy here, and the two drifted apart.
  const { data } = useEntity("stats", STATS_FALLBACK as any);
  const list = (data as any[]).map((s: any) => ({
    value: s.value_text ?? s.value,
    label: s.label,
    sub: s.sub,
  }));
  return (
    <section className="relative py-12 sm:py-14 px-4 overflow-hidden">
      {/* The image and overlays are absolute and full-bleed, so only the content
          column is revealed. Wrapping the whole section would transform the
          background along with it and expose the page behind at the edges. */}
      <img
        src="/assets/background-img-stats/background-login.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-[#07192E]/75" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0B2545]/60 via-[#0B2545]/30 to-[#0D9488]/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
      <Reveal className="max-w-7xl mx-auto relative">
        <StatsRow items={list} />
      </Reveal>
    </section>
  );
}
