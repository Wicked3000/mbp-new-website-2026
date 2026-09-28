import type { ReactNode } from "react";
import { FacebookIcon, LinkedInIcon, WhatsAppIcon } from "@/components/brandIcons";

export type SocialNetwork = {
  /** Network name, used for the accessible label. */
  label: string;
  /**
   * Destination URL. Empty until a verified profile URL is available — the
   * button still renders in its brand colour, it just has no target yet. Paste
   * the real href below and it goes live with no other change. WhatsApp accepts
   * a wa.me link (digits only, no "+" or spaces) or a web.whatsapp.com/send link.
   */
  href: string;
  /**
   * Brand colour. The glyph uses this colour on a white surface; on hover the
   * button fills with it and the glyph inverts to white.
   */
  brand: string;
  icon: ReactNode;
};

export const SOCIAL_NETWORKS: SocialNetwork[] = [
  {
    label: "Facebook",
    // TODO: e.g. "https://www.facebook.com/<your-page>"
    href: "",
    brand: "#1877F2",
    icon: <FacebookIcon size={19} />,
  },
  {
    label: "WhatsApp",
    // TODO: e.g. "https://wa.me/675XXXXXXXX" (mobile number, digits only)
    href: "",
    brand: "#25D366",
    icon: <WhatsAppIcon size={19} />,
  },
  {
    label: "LinkedIn",
    // TODO: e.g. "https://www.linkedin.com/company/<your-page>"
    href: "",
    brand: "#0A66C2",
    icon: <LinkedInIcon size={19} />,
  },
];

/**
 * Floating social links, pinned to the right edge and vertically centred, then
 * nudged below centre so they do not sit on top of the hero slider's next-slide
 * arrow, which occupies the same right edge at the true vertical midpoint.
 * Each button keeps its brand colour whether or not a URL has been filled in
 * yet, so the row never renders in a muted or "disabled" state.
 */
export default function SocialFloat() {
  return (
    <div
      className="fixed right-0 top-[70%] z-40 hidden -translate-y-1/2 flex-col gap-2 pr-3 sm:flex"
      aria-label="Social media"
    >
      {SOCIAL_NETWORKS.map((n) => (
        <a
          key={n.label}
          href={n.href || undefined}
          target={n.href ? "_blank" : undefined}
          rel={n.href ? "noopener noreferrer" : undefined}
          aria-label={
            n.href ? `${n.label} (opens in a new tab)` : `${n.label} — add a profile URL`
          }
          // Until a URL is set, keep it focusable and announced as a link so the
          // row behaves consistently; it simply has no destination yet.
          role="link"
          tabIndex={0}
          title={n.label}
          style={{ "--brand": n.brand } as React.CSSProperties}
          className="group w-11 h-11 grid place-items-center rounded-xl border border-gray-100 bg-white text-[var(--brand)] shadow-sm transition-all duration-200 hover:text-white hover:bg-[var(--brand)] hover:border-transparent hover:-translate-y-0.5 hover:shadow-lg focus-visible:text-white focus-visible:bg-[var(--brand)] focus-visible:border-transparent focus-visible:-translate-y-0.5 focus-visible:shadow-lg"
        >
          {n.icon}
        </a>
      ))}
    </div>
  );
}
