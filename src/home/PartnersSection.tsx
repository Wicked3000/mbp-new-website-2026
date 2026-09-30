"use client";

import { useEntity } from "@/hooks/useDynamic";
import Reveal from "@/components/Reveal";

export function PartnersSection() {
  const FALLBACK_PARTNERS = [
    "National Dept. of Education",
    "Teaching Service Commission",
    "TVET Authority",
    "UNICEF PNG",
    "Australia PNG Partnership",
    "World Bank",
  ];
  const { data } = useEntity(
    "partners",
    FALLBACK_PARTNERS.map((n, i) => ({ id: i + 1, name: n })) as any,
  );
  const partners = (data as any[])
    .map((partner: any) =>
      typeof partner === "string"
        ? { id: partner, name: partner, logo: "" }
        : { ...partner, logo: partner.logo ?? partner.img ?? "" },
    )
    .sort((left: any, right: any) => (left.sort_order ?? 0) - (right.sort_order ?? 0));
  return (
    <section className="py-10 px-4 bg-[#F8F6F1] border-y border-gray-100">
      <Reveal className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="text-xs font-bold uppercase tracking-[0.14em] text-gray-500">
            Trusted partners & agencies
          </div>
          <div className="text-xs text-gray-400">Working together for quality education</div>
        </div>
        <div className="partner-marquee overflow-hidden" aria-label="Trusted partner logos">
          <div className="partner-marquee-track">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex shrink-0 gap-3 pr-3" aria-hidden={copy === 1}>
                {partners.map((partner: any) => {
                  const initials = partner.name
                    .split(/\s+/)
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((word: string) => word[0])
                    .join("")
                    .toUpperCase();
                  return (
                    <div
                      key={partner.id ?? partner.name}
                      className="w-52 h-28 rounded-2xl bg-white border border-gray-100 flex flex-col items-center justify-center gap-2 p-3 text-center hover:shadow-md hover:border-[#0D9488]/20 transition-all group"
                    >
                      {partner.logo ? (
                        <img
                          src={partner.logo}
                          alt={`${partner.name} logo`}
                          className="h-11 w-full object-contain transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <div className="h-11 w-11 rounded-xl bg-[#F8F6F1] border border-gray-100 grid place-items-center text-sm font-bold text-[#0B2545]">
                          {initials}
                        </div>
                      )}
                      <div className="text-[11px] font-bold text-gray-600 group-hover:text-[#0B2545] leading-tight">
                        {partner.name}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
