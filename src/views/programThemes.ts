import type { HeroTheme } from "@/components/PageHero";

/**
 * Per-programme banner styling. The four education programmes each carry their
 * own accent, so the difference lives here instead of in four copies of the hero
 * markup.
 */
export const POST_PRIMARY_HERO: HeroTheme = {
  background: "bg-[#163663]",
  gradient: "bg-gradient-to-r from-[#163663]/90 via-[#163663]/70 to-[#0B2545]/40",
  badge: "bg-amber-400/20 border-amber-400/40 text-amber-300",
  accent: "text-amber-400",
  dot: "bg-amber-400",
  lead: "text-amber-100",
  primaryAction: "bg-amber-400 hover:bg-amber-500 text-[#0B2545]",
  secondaryAction: "border-amber-400 text-amber-300 hover:bg-amber-400/10 hover:text-white",
};

export const VET_HERO: HeroTheme = {
  background: "bg-[#0D9488]",
  gradient: "bg-gradient-to-r from-[#0B2545]/90 via-[#163663]/70 to-[#0D9488]/30",
  badge: "bg-amber-300/20 border-amber-300/40 text-amber-200",
  accent: "text-amber-300",
  dot: "bg-amber-300",
  lead: "text-teal-100",
  primaryAction: "bg-amber-300 hover:bg-amber-400 text-[#0B2545]",
  secondaryAction: "border-amber-300 text-amber-200 hover:bg-amber-300/10 hover:text-white",
};

export const FODE_HERO: HeroTheme = {
  background: "bg-[#0B2545]",
  gradient: "bg-gradient-to-r from-[#0B2545]/90 via-[#0B2545]/70 to-[#163663]/40",
  badge: "bg-teal-400/20 border-teal-400/40 text-teal-300",
  accent: "text-teal-400",
  dot: "bg-teal-400",
  lead: "text-teal-100",
  primaryAction: "bg-teal-400 hover:bg-teal-500 text-white",
  secondaryAction: "border-teal-400 text-teal-300 hover:bg-teal-400/10 hover:text-white",
};
