"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";

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

/**
 * One frame of a rotating banner: an image and the words that go with it. The
 * words belong to the slide rather than to the banner, which is the whole point
 * of a rotating hero - the image and the sentence about it change together.
 */
export type HeroSlide = {
  image: string;
  imageAlt: string;
  eyebrow: string;
  title: ReactNode;
  /** Optional second line of the heading, highlighted in the accent colour. */
  highlight?: ReactNode;
  lead: string;
  actions?: HeroAction[];
  /** Tailwind object-position for this image, when it needs its own framing. */
  imagePosition?: string;
};

// Eight seconds per frame. Shorter than the home hero's two minutes on purpose:
// that one is a full-viewport statement read once, whereas a banner sits above
// content the visitor came for, so a long dwell reads as the page being stuck.
// Long enough that the short heading and one line of lead can be read in full.
const ROTATION_MS = 8_000;

// The image crossfade and the arrival of the words share one duration, so the
// text appears to be arriving with its photograph rather than after it.
const CROSSFADE_MS = 1_200;

type PageHeroProps = {
  theme: HeroTheme;
  image?: string;
  imageAlt?: string;
  /** Tailwind object-position for the image, e.g. "object-[50%_40%]". */
  imagePosition?: string;
  /** Image opacity, 0-100. Programme banners sit further back than decorative ones. */
  imageOpacity?: number;
  eyebrow?: string;
  title?: ReactNode;
  /** Optional second line of the heading, highlighted in the accent colour. */
  highlight?: ReactNode;
  lead?: string;
  actions?: HeroAction[];
  /**
   * Turns the banner into a rotating hero: the images crossfade and the words
   * change with them. Supplying one slide is the same as supplying none.
   */
  slides?: HeroSlide[];
  /** Extra decoration layered over the image, below the text. */
  overlay?: ReactNode;
  /** Classes for the column holding the text. */
  contentClassName?: string;
  /**
   * Page-specific content inside the banner, under the lead - the news and
   * notices search fields live here. Kept as a slot so those pages can use the
   * shared banner instead of hand-rolling their own to hold one control.
   */
  children?: ReactNode;
  /** Anchor id, for in-page links that target the top of a page. */
  id?: string;
};

export default function PageHero({
  theme,
  image,
  imageAlt = "",
  imagePosition = "object-center",
  imageOpacity = 40,
  eyebrow,
  title,
  highlight,
  lead,
  actions = [],
  slides,
  overlay,
  contentClassName = "max-w-3xl",
  children,
  id,
}: PageHeroProps) {
  // A rotating banner needs at least two frames to rotate, so a single slide
  // (or none) shows no controls and no timer. Frames themselves come from
  // `slides` whenever any are supplied, so the array is authoritative: passing
  // one slide alongside the fixed props shows that slide, not a mixture of the
  // two.
  const rotating = (slides?.length ?? 0) > 1;
  const frames: HeroSlide[] = slides?.length
    ? slides
    : [
        {
          image: image ?? "",
          imageAlt,
          eyebrow: eyebrow ?? "",
          title: title ?? "",
          highlight,
          lead: lead ?? "",
          actions,
          imagePosition,
        },
      ];

  const [current, setCurrent] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Same reasoning as the home hero: auto-rotation is a moving, non-essential
  // effect, so it stops for reduced-motion visitors and while a pointer or
  // keyboard focus is inside the banner. Reading a frame mid-fade should not
  // have the words change underneath the reader.
  const paused = hovered || focusWithin || reducedMotion;

  useEffect(() => {
    setCurrent((p) => (frames.length ? p % frames.length : 0));
  }, [frames.length]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReducedMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (!rotating || paused) return;
    // The timer is now the only thing that advances the banner, so the step is
    // inline rather than a callback shared with controls that no longer exist.
    const id = setInterval(
      () => setCurrent((p) => (p + 1) % frames.length),
      ROTATION_MS,
    );
    return () => clearInterval(id);
  }, [rotating, paused, frames.length]);

  const frame = frames[Math.min(current, frames.length - 1)];

  return (
    // The single banner component for every public page. One h1 inside one
    // section, in the same order, at the same height, so the heading structure
    // is identical wherever a visitor lands.
    <section
      id={id}
      data-page-hero=""
      className={`relative h-[400px] sm:h-[480px] overflow-hidden ${theme.background}`}
      onMouseEnter={rotating ? () => setHovered(true) : undefined}
      onMouseLeave={rotating ? () => setHovered(false) : undefined}
      onFocus={rotating ? () => setFocusWithin(true) : undefined}
      onBlur={
        rotating
          ? (e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) setFocusWithin(false);
            }
          : undefined
      }
      role={rotating ? "region" : undefined}
      aria-roledescription={rotating ? "carousel" : undefined}
      aria-label={rotating ? "Page banner" : undefined}
    >
      {/*
        Rotating: every frame's image is mounted and crossfaded, so there is no
        flash of an empty panel while the next one loads. Fixed: one image, as
        before. The `key` on the current index restarts the arrival animation on
        the words whenever the frame changes.
      */}
      <div aria-live={rotating && paused ? "polite" : "off"}>
        {frames.map((f, i) => (
          <div
            key={`${f.image}-${i}`}
            role={rotating ? "group" : undefined}
            aria-roledescription={rotating ? "slide" : undefined}
            aria-label={rotating ? `Slide ${i + 1} of ${frames.length}` : undefined}
            aria-hidden={rotating ? i !== current : undefined}
            className="absolute inset-0"
          >
            <img
              src={f.image}
              alt={f.imageAlt}
              className={`absolute inset-0 w-full h-full object-cover ${f.imagePosition ?? imagePosition} ${
                rotating ? `transition-opacity duration-[${CROSSFADE_MS}ms] ease-in-out` : ""
              } ${rotating ? (i === current ? "opacity-100" : "opacity-0") : ""}`}
              style={{ opacity: rotating ? undefined : imageOpacity / 100 }}
              loading={rotating && i > 0 ? "lazy" : "eager"}
              decoding="async"
            />
          </div>
        ))}
      </div>
      <div className={`absolute inset-0 ${theme.gradient}`} />
      {overlay}
      {/*
        Only the text settles in. The banner image is the first thing on the
        page and is already at full opacity when the route animation runs, so
        animating it too would just delay the content behind a second effect.
        The extra bottom padding on a rotating banner keeps the frame buttons
        clear of the last line of text.
      */}
      <div
        className={`page-enter relative z-10 max-w-7xl mx-auto px-4 h-full flex flex-col justify-center ${
          rotating ? "pb-16" : ""
        }`}
      >
        <div className={contentClassName}>
          {/* Keyed on the frame index so the words animate in with the photo. */}
          <div key={rotating ? current : "static"} className={rotating ? "hero-slide-text" : ""}>
            <div
              className={`inline-flex items-center gap-2 border text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded mb-5 ${theme.badge}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full inline-block ${theme.dot}`} />
              {frame.eyebrow}
            </div>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-5"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {frame.title}
              {frame.highlight ? (
                <span className={`block ${theme.accent}`}>{frame.highlight}</span>
              ) : null}
            </h1>
            <p className={`${theme.lead} text-lg leading-relaxed max-w-2xl`}>{frame.lead}</p>
            {frame.actions && frame.actions.length > 0 ? (
              <div className="flex flex-wrap gap-4 mt-8">
                {frame.actions.map((action) => (
                  <Link
                    key={action.to}
                    href={action.to}
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded transition-colors ${
                      action.variant === "primary"
                        ? theme.primaryAction
                        : theme.secondaryAction
                    }`}
                  >
                    {action.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
          {children}
        </div>
      </div>
      {rotating ? (
        /*
          Dots only. The banner advances on its own, so the arrows were
          redundant with that: a visitor who wants a different frame now waits
          seconds for it, but the dots put any frame a single click away. The
          hover pause covers the reader who is halfway through a sentence.
        */
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {frames.map((f, i) => (
            <button
              key={`dot-${i}`}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === current}
              className={`transition-all rounded-full ${
                i === current ? "w-7 h-2 bg-[#C9A84C]" : "w-2 h-2 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
