import { Link } from "react-router-dom";
import { MAIN_NAV } from "@/components/siteNav";

const RELATED_AGENCIES = [
  "National Dept. of Education",
  "Teaching Service Commission",
  "National Library of PNG",
  "Flexible Open Distance Ed.",
  "TVET Authority",
];

export default function SiteFooter() {
  return (
    <footer className="bg-[#07192E] text-white pt-14 pb-6 px-4" id="contact">
      <div className="max-w-7xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
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
              <span className="w-8 h-8 rounded-full bg-white/5 border border-white/10 grid place-items-center text-xs hover:bg-white hover:text-[#07192E] transition-colors cursor-pointer">
                f
              </span>
              <span className="w-8 h-8 rounded-full bg-white/5 border border-white/10 grid place-items-center text-xs hover:bg-white hover:text-[#07192E] transition-colors cursor-pointer">
                𝕏
              </span>
              <span className="w-8 h-8 rounded-full bg-white/5 border border-white/10 grid place-items-center text-xs hover:bg-white hover:text-[#07192E] transition-colors cursor-pointer">
                ▶
              </span>
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
              <li>
                <Link
                  to="/selections"
                  className="text-[#C9A84C] text-sm font-semibold hover:text-white transition-colors"
                >
                  Selections 2026 →
                </Link>
              </li>
              <li>
                <Link
                  to="/notices"
                  className="text-gray-400 text-sm hover:text-white transition-colors"
                >
                  Notice Board
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-xs uppercase tracking-[0.14em] text-[#C9A84C] mb-4">
              Related Agencies
            </h4>
            <ul className="space-y-2.5">
              {RELATED_AGENCIES.map((l) => (
                <li key={l}>
                  <a href="#" className="text-gray-400 text-sm hover:text-white transition-colors">
                    {l}
                  </a>
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
            <a href="#" className="text-gray-500 hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors">
              Terms of Use
            </a>
            <Link to="/accessibility" className="text-gray-500 hover:text-white transition-colors">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
