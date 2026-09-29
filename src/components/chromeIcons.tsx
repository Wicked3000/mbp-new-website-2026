// Small line icons for the site chrome: contact details, opening hours, and the
// external-link marker. Stroke-based to match the existing admin icon set.
import type { ReactNode, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

/**
 * A stroked <svg> shell. `children` is passed in rather than the paths being
 * repeated, so every icon shares one set of presentation attributes.
 */
function icon(size: number, children: ReactNode, rest: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      // Decorative: the label beside each icon already says what it is, so
      // announcing the glyph too would only repeat it.
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  );
}

export function PhoneIcon({ size = 14, ...rest }: IconProps) {
  return icon(
    size,
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4 8.81 2 2 0 0 1 6 6.63h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L10 14.55a16 16 0 0 0 6 6l1.28-1.28a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />,
    rest,
  );
}

export function MailIcon({ size = 14, ...rest }: IconProps) {
  return icon(
    size,
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </>,
    rest,
  );
}

export function ClockIcon({ size = 14, ...rest }: IconProps) {
  return icon(
    size,
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </>,
    rest,
  );
}

export function ExternalLinkIcon({ size = 14, ...rest }: IconProps) {
  return icon(
    size,
    <>
      <path d="M14 4h6v6" />
      <path d="M20 4l-9 9" />
      <path d="M18 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5" />
    </>,
    rest,
  );
}
