import type { ReactNode } from "react";
import { Link } from "react-router-dom";

/**
 * The banner at the top of every inner page. Colours come from a theme so a page
 * only supplies its words, image and accent, instead of ~45 lines of repeated
 * markup.
 */
export type HeroTheme = {
  /** Background behind the image, e.g. "bg-[#0B2545]". */
  background: string;
  /** Overlay gradient, usually from-<dark> via-<dark> to-<lighter>. */
  gradient: string;
  /** Eyebrow badge classes. */
  badge: string;
  /** Accent colour for the highlighted line in the heading. */
  accent: string;
  /** Background of the eyebrow dot. */
  dot: string;
  /** Colour of the lead paragraph. */
  lead: string;
  /** Solid call-to-action button classes. */
  primaryAction: string;
  /** Outlined call-to-action button classes. */
  secondaryAction: string;
};

export const TEAL_HERO: HeroTheme = {
  background: "bg-[#0B2545]",
  gradient: "bg-gradient-to-r from-[#0B2545]/90 via-[#0B2545]/70 to-[#163663]/40",
  badge: "bg-teal-500/20 border-teal-500/40 text-teal-300",
  accent: "text-teal-400",
  dot: "bg-teal-500",
  lead: "text-teal-100",
  primaryAction: "bg-teal-500 hover:bg-teal-600 text-white",
  secondaryAction:
    "border-teal-400 text-teal-300 hover:bg-teal-500/10 hover:text-white font-semibold",
};

export const NAVY_HERO: HeroTheme = {
  background: "bg-[#0B2545]",
  gradient: "bg-gradient-to-r from-[#0B2545]/90 via-[#0B2545]/70 to-[#163663]/40",
  badge: "bg-[#C9A84C]/20 border-[#C9A84C]/40 text-[#E2C47A]",
  accent: "text-[#14B8A6]",
  dot: "bg-[#C9A84C]",
  lead: "text-blue-100",
  primaryAction: "bg-[#C9A84C] hover:bg-amber-300 text-[#0B2545]",
  secondaryAction: "border-[#C9A84C] text-[#E2C47A] hover:bg-white/10 hover:text-white",
};

export type HeroAction = {
  label: string;
  /** In-page anchor ("#schools") or a route. */
  to: string;
  variant: "primary" | "secondary";
};

type PageHeroProps = {
  theme: HeroTheme;
  image: string;
  imageAlt: string;
  /** Tailwind object-position for the image, e.g. "object-[50%_40%]". */
  imagePosition?: string;
  /** Image opacity, 0-100. Programme banners sit further back than decorative ones. */
  imageOpacity?: number;
  eyebrow: string;
  title: ReactNode;
  /** Optional second line of the heading, highlighted in the accent colour. */
  highlight?: ReactNode;
  lead: string;
  actions?: HeroAction[];
  /** Extra decoration layered over the image, below the text. */
  overlay?: ReactNode;
  /** Classes for the column holding the text. */
  contentClassName?: string;
};

export default function PageHero({
  theme,
  image,
  imageAlt,
  imagePosition = "object-center",
  imageOpacity = 40,
  eyebrow,
  title,
  highlight,
  lead,
  actions = [],
  overlay,
  contentClassName = "max-w-3xl",
}: PageHeroProps) {
  return (
    <section className={`relative h-[400px] sm:h-[480px] overflow-hidden ${theme.background}`}>
      <img
        src={image}
        alt={imageAlt}
        className={`absolute inset-0 w-full h-full object-cover ${imagePosition}`}
        style={{ opacity: imageOpacity / 100 }}
      />
      <div className={`absolute inset-0 ${theme.gradient}`} />
      {overlay}
      <div className="relative z-10 max-w-7xl mx-auto px-4 h-full flex flex-col justify-center">
        <div className={contentClassName}>
          <div
            className={`inline-flex items-center gap-2 border text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded mb-5 ${theme.badge}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full inline-block ${theme.dot}`} />
            {eyebrow}
          </div>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-5"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {title}
            {highlight ? <span className={`block ${theme.accent}`}>{highlight}</span> : null}
          </h1>
          <p className={`${theme.lead} text-lg leading-relaxed max-w-2xl`}>{lead}</p>
          {actions.length > 0 && (
            <div className="flex flex-wrap gap-4 mt-8">
              {actions.map((action) => (
                <Link
                  key={action.to}
                  to={action.to}
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded transition-colors ${
                    action.variant === "primary" ? theme.primaryAction : theme.secondaryAction
                  }`}
                >
                  {action.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
