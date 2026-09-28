import { Link } from "react-router-dom";
import { useEntity } from "@/hooks/useDynamic";
import Reveal from "@/components/Reveal";

export function SelectionBanner() {
  const FALLBACK = {
    icon: "🎓",
    title: "2026 Grade 9 & 11 Selections are Live",
    badge: "NEW",
    body: "Search placements by school, district or student name: official provincial lists.",
    primary_label: "View Selections",
    primary_href: "/selections",
    secondary_label: "Download PDF",
    secondary_href: "/downloads",
  };
  const { data } = useEntity("home_selection_banner", [FALLBACK]);
  const banner = { ...FALLBACK, ...(data?.[0] || {}) };
  return (
    <section className="px-4 py-6 bg-white">
      <Reveal className="max-w-7xl mx-auto">
        <div className="rounded-[18px] bg-gradient-to-r from-[#0B2545] via-[#163663] to-[#0D9488] p-[1px]">
          <div className="rounded-[17px] bg-gradient-to-r from-[#0B2545] via-[#163663] to-[#0D9488] px-6 py-5 flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex w-12 h-12 rounded-xl bg-white text-[#0B2545] items-center justify-center text-xl shadow-sm">
                {banner.icon}
              </div>
              <div>
                <div
                  className="text-white font-bold leading-tight flex flex-wrap items-center gap-2"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  <span>{banner.title}</span>
                  {banner.badge && (
                    <span className="bg-[#C9A84C] text-[#0B2545] text-xs font-bold px-2 py-1 rounded-full">
                      {banner.badge}
                    </span>
                  )}
                </div>
                <div className="text-blue-100 text-sm mt-1">{banner.body}</div>
              </div>
            </div>
            <div className="flex gap-3 shrink-0">
              <Link
                to={banner.primary_href}
                className="bg-white text-[#0B2545] font-bold px-5 py-2.5 rounded-full hover:bg-[#C9A84C] transition-colors shadow-sm text-sm"
              >
                {banner.primary_label} →
              </Link>
              {banner.secondary_label && (
                <Link
                  to={banner.secondary_href}
                  className="hidden sm:inline-flex items-center bg-white/10 border border-white/20 text-white font-semibold px-5 py-2.5 rounded-full hover:bg-white hover:text-[#0B2545] transition-colors text-sm"
                >
                  {banner.secondary_label}
                </Link>
              )}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
