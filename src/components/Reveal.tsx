"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

/**
 * Scroll reveal, built on one shared observer.
 *
 * Content fades and settles in as it enters the viewport. Two rules keep this
 * from becoming a hazard:
 *
 *  1. A visitor who prefers reduced motion never sees the animation. The CSS
 *     forces .reveal visible under that preference; this hook simply does not
 *     observe, so there is also no work done on their behalf.
 *  2. An element already in the viewport on load reveals immediately rather
 *     than waiting for a scroll event that may never come - otherwise the
 *     first screen of every page would sit at opacity 0.
 *
 * The observer is shared and disconnected when the last subscriber unmounts;
 * one observer per element would be a lot of callbacks on a long page.
 */

let observer: IntersectionObserver | null = null;
// Keyed by element rather than a Set scanned per callback: a long page has many
// subscribers, and find() over all of them on every intersection is work the
// browser does on the scroll path.
const subscribers = new Map<Element, () => void>();

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function ensureObserver() {
  if (observer || typeof IntersectionObserver === "undefined") return observer;
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const onReveal = subscribers.get(entry.target);
        if (!onReveal) continue;
        // One reveal per element, then stop watching it entirely.
        subscribers.delete(entry.target);
        observer?.unobserve(entry.target);
        onReveal();
      }
      // Nothing left to watch: stop the browser doing intersection maths.
      if (subscribers.size === 0 && observer) {
        observer.disconnect();
        observer = null;
      }
    },
    // Bottom-biased: start the animation as the element comes up from the fold
    // rather than the instant a single pixel clears the top of the screen.
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
  );
  return observer;
}

export type RevealProps = {
  children: ReactNode;
  /** Rendered as this element, so a wrapper div never breaks a grid or flex row. */
  as?: ElementType;
  className?: string;
  /** Stagger index, used with .reveal-group on a list or grid. */
  index?: number;
} & Record<string, unknown>;

/**
 * Wraps a block so it animates in once on scroll.
 *
 * Used at section level rather than on every card: a section appearing is a
 * legible change of state, whereas twenty cards each animating reads as noise.
 */
export default function Reveal({
  children,
  as: Tag = "div",
  className = "",
  index = 0,
  ...rest
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  // Starts true so the very first paint is visible. An element that renders at
  // opacity 0 and is only shown by an effect would flash: hidden on load, then
  // visible a frame later. The sections this wraps are mostly below the fold,
  // so the observer flips them back to false before they are ever seen - and
  // anything already on screen is observed as intersecting immediately.
  const [revealed, setRevealed] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || typeof IntersectionObserver === "undefined") return;
    const io = ensureObserver();
    if (!io) return;
    setRevealed(false);
    const onReveal = () => setRevealed(true);
    subscribers.set(el, onReveal);
    io.observe(el);
    return () => {
      subscribers.delete(el);
      io.unobserve(el);
    };
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`.trim()}
      data-revealed={revealed}
      style={index ? ({ "--reveal-index": index } as React.CSSProperties) : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/**
 * Stagger container. Children should be <Reveal index={i}>.
 */
export function RevealGroup({
  children,
  as: Tag = "div",
  className = "",
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
}) {
  return <Tag className={`reveal-group ${className}`.trim()}>{children}</Tag>;
}
