import { ICONS, resolveIcon, isIconName } from "./iconSet";

type IconProps = {
  /**
   * An icon name, or one of the emoji the site stored before icons existed.
   * Content rows in the database still hold emoji, so both are accepted.
   */
  name?: string | null;
  /** Rendered size in pixels. */
  size?: number;
  className?: string;
  /**
   * Shown when the value resolves to nothing. A hero tile with an unknown icon
   * should look empty rather than show a glyph that means the wrong thing.
   */
  fallback?: "dot" | "none";
  /** Accessible name. Omit for decorative icons next to a text label. */
  title?: string;
};

/**
 * Draws a content icon as an SVG.
 *
 * Replaces the pictographic emoji this site used throughout. Emoji are rendered
 * by the platform rather than the stylesheet - in colour, at a size unrelated to
 * the font, and differently on every operating system - which is why they read
 * as foreign next to the rest of the interface.
 */
export default function Icon({
  name,
  size = 20,
  className = "",
  fallback = "dot",
  title,
}: IconProps) {
  const resolved = resolveIcon(name);
  if (!resolved) {
    if (fallback === "none") return null;
    // A neutral placeholder: visible enough that a missing icon is obvious, and
    // carrying no meaning of its own.
    return (
      <span
        aria-hidden={title ? undefined : "true"}
        role={title ? "img" : undefined}
        aria-label={title}
        className={`inline-block rounded-full bg-current opacity-25 shrink-0 ${className}`}
        style={{ width: size * 0.5, height: size * 0.5 }}
      />
    );
  }
  if (!isIconName(resolved)) return null;
  const Glyph = ICONS[resolved];
  return (
    <Glyph
      size={size}
      className={`shrink-0 ${className}`}
      aria-hidden={title ? undefined : "true"}
      role={title ? "img" : undefined}
      aria-label={title}
      strokeWidth={1.75}
    />
  );
}

export { ICONS, resolveIcon };
