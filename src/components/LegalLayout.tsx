import type { ReactNode } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PageHero, { TEAL_HERO } from "@/components/PageHero";

export type LegalSection = { heading: string; body: ReactNode };

// Shared shell for the plain-text policy pages so /privacy and /terms share
// one hero, one table of contents, and one last-updated treatment.
export default function LegalLayout({
  eyebrow,
  title,
  subtitle,
  updated,
  sections,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  updated: string;
  sections: LegalSection[];
}) {
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif" }}>
      <SiteHeader />

      <PageHero
        theme={TEAL_HERO}
        image="/assets/logo/mbp-logo-bg-removed.png"
        imageAlt=""
        imageOpacity={4}
        imagePosition="object-[100%_0%]"
        contentClassName="max-w-4xl"
        eyebrow={eyebrow}
        title={title}
        lead={subtitle}
      >
        <p className="text-teal-200/70 text-sm mt-6">Last updated: {updated}</p>
      </PageHero>

      <section className="py-14 px-4 bg-white">
        <div className="max-w-4xl mx-auto lg:flex lg:gap-12">
          <nav aria-label="On this page" className="lg:w-56 shrink-0 mb-10 lg:mb-0">
            <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-gray-500 mb-4">
              On this page
            </h2>
            <ol className="space-y-2 border-l-2 border-gray-100 pl-4">
              {sections.map((s, i) => (
                <li key={s.heading}>
                  <a
                    href={`#section-${i + 1}`}
                    className="text-sm text-gray-600 hover:text-[#0D9488] transition-colors"
                  >
                    {s.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="lg:flex-1 min-w-0 space-y-10">
            {sections.map((s, i) => (
              <section key={s.heading} id={`section-${i + 1}`} className="scroll-mt-28">
                <h2
                  className="text-xl font-bold text-[#0B2545] mb-3"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {s.heading}
                </h2>
                <div className="text-gray-700 leading-relaxed space-y-3 [&_a]:text-[#0D9488] [&_a]:underline">
                  {s.body}
                </div>
              </section>
            ))}

            <div className="bg-[#F8F6F1] border border-gray-100 rounded-2xl p-6">
              <h3 className="font-bold text-[#0B2545] mb-2">Questions about this policy?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Contact the Division of Education in Alotau, or use the online contact form.
              </p>
              <div className="flex flex-wrap gap-3 text-sm font-semibold">
                <a
                  href="mailto:info@mbpeducation.gov.pg"
                  className="px-4 py-2 rounded-full bg-white border border-gray-200 hover:border-[#0D9488] transition-colors"
                >
                  info@mbpeducation.gov.pg
                </a>
                <a
                  href="tel:+6756411234"
                  className="px-4 py-2 rounded-full bg-white border border-gray-200 hover:border-[#0D9488] transition-colors"
                >
                  +675 641 1234
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
