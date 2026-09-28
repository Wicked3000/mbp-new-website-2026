import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { BasicEducationPageHero } from "./PageHero";
import { OverviewSection } from "./OverviewSection";
import { CurriculumSection } from "./CurriculumSection";
import { SchoolsSection } from "./SchoolsSection";
import { InitiativesSection } from "./InitiativesSection";
import { SupportSection } from "./SupportSection";
import { DownloadsSection } from "./DownloadsSection";
import { FAQSection } from "./FAQSection";

export default function BasicEducationPage() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif" }}>
      <SiteHeader />
      <BasicEducationPageHero />
      <main id="main-content">
        <OverviewSection />
        <CurriculumSection />
        <SchoolsSection />
        <InitiativesSection />
        <SupportSection />
        <DownloadsSection />
      </main>
      <FAQSection />
      <SiteFooter />
    </div>
  );
}
