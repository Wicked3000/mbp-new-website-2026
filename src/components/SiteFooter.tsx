import { Link } from "react-router-dom";
import { MAIN_NAV } from "@/components/siteNav";
import SocialFloat, { SOCIAL_NETWORKS } from "@/components/SocialFloat";
import BackToTop from "@/components/BackToTop";

// Only entries with a real destination are listed: pages that exist on this
// site, or agency portals referenced elsewhere in the codebase. Anything
// without a verifiable link is omitted rather than rendered as a dead "#".
const RELATED_AGENCIES: { label: string; to: string; external?: boolean }[] = [
  { label: "National Dept. of Education", to: "https://education.gov.pg", external: true },
  { label: "Teaching Service Commission", to: "https://tsc.gov.pg", external: true },
  { label: "TVET Authority", to: "/vet" },
  { label: "Flexible Open Distance Ed.", to: "/fode" },
];

export default function SiteFooter() {
  return (
    <>
      <SocialFloat />
      <BackToTop />
      <footer className="bg-[#07192E] text-white pt-14 pb-6 px-4" id="contact">
      <div className="max-w-7xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img loading="lazy" decoding="async"
                src="/assets/logo/mbp-logo-bg-removed.png"
                alt="Milne Bay Province Division of Education"
                className="w-10 h-10 shrink-0 object-contain bg-white rounded-full p-1"
              />
              <div>
                <div
                  className="font-bold text-sm tracking-tight"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Milne Bay Province
                </div>
                <div className="text-[#0D9488] text-xs font-bold uppercase tracking-widest">
                  Division of Education
                </div>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Committed to quality education for all children and young people across Milne Bay
              Province, Papua New Guinea.
            </p>
            <div className="mt-4 flex gap-2">
              {SOCIAL_NETWORKS.map((n) => (
                <a
                  key={n.label}
                  href={n.href || undefined}
                  target={n.href ? "_blank" : undefined}
                  rel={n.href ? "noopener noreferrer" : undefined}
                  aria-label={
                    n.href ? `${n.label} (opens in a new tab)` : `${n.label} — add a profile URL`
                  }
                  role="link"
                  tabIndex={0}
                  title={n.label}
                  style={{ "--brand": n.brand } as React.CSSProperties}
                  className="w-8 h-8 rounded-full border border-transparent bg-white text-[var(--brand)] grid place-items-center transition-all hover:text-white hover:bg-[var(--brand)] hover:shadow-lg"
                >
                  {n.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-xs uppercase tracking-[0.14em] text-[#C9A84C] mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {MAIN_NAV.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-gray-400 text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-xs uppercase tracking-[0.14em] text-[#C9A84C] mb-4">
              Related Agencies
            </h4>
            <ul className="space-y-2.5">
              {RELATED_AGENCIES.map((l) => (
                <li key={l.label}>
                  {l.external ? (
                    <a
                      href={l.to}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 text-sm hover:text-white transition-colors"
                    >
                      {l.label}
                    </a>
                  ) : (
                    <Link
                      to={l.to}
                      className="text-gray-400 text-sm hover:text-white transition-colors"
                    >
                      {l.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-xs uppercase tracking-[0.14em] text-[#C9A84C] mb-4">
              Contact Us
            </h4>
            <div className="space-y-3 text-sm text-gray-400">
              <div>
                <div className="text-white font-semibold mb-0.5 text-xs uppercase tracking-widest">
                  Office Address
                </div>
                Division of Education, Alotau, Milne Bay Province, PNG
              </div>
              <div>
                <div className="text-white font-semibold mb-0.5 text-xs uppercase tracking-widest">
                  Phone
                </div>
                <a href="tel:+6756411234" className="hover:text-white">
                  +675 641 1234
                </a>
              </div>
              <div>
                <div className="text-white font-semibold mb-0.5 text-xs uppercase tracking-widest">
                  Email
                </div>
                <a href="mailto:info@mbpeducation.gov.pg" className="hover:text-white">
                  info@mbpeducation.gov.pg
                </a>
              </div>
              <div>
                <div className="text-white font-semibold mb-0.5 text-xs uppercase tracking-widest">
                  Office Hours
                </div>
                Mon – Fri: 8:00am – 4:30pm
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm">
          <span className="text-gray-500 text-xs">
            © 2026 Milne Bay Province Division of Education. All rights reserved.
          </span>
          <div className="flex gap-5 text-xs">
            <Link to="/privacy" className="text-gray-500 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-500 hover:text-white transition-colors">
              Terms of Use
            </Link>
            <Link to="/accessibility" className="text-gray-500 hover:text-white transition-colors">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
      </footer>
    </>
  );
}
