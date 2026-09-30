import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { VETPageHero } from "./PageHero";
import { OverviewSection } from "./OverviewSection";
import { ProgramsSection } from "./ProgramsSection";
import { CentresSection } from "./CentresSection";
import { SelectionListsSection } from "./SelectionListsSection";
import { IndustrySection } from "./IndustrySection";
import { InitiativesSection } from "./InitiativesSection";
import { EnrolmentSection } from "./EnrolmentSection";
import { SupportSection } from "./SupportSection";
import { DownloadsSection } from "./DownloadsSection";
import { FAQSection } from "./FAQSection";

export default function VETPage() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif" }}>
      <SiteHeader />
      <VETPageHero />
      <main id="main-content">
        <OverviewSection />
        <ProgramsSection />
        <CentresSection />
        <SelectionListsSection />
        <IndustrySection />
        <InitiativesSection />
        <EnrolmentSection />
        <SupportSection />
        <DownloadsSection />
      </main>
      <FAQSection />
      <SiteFooter />
    </div>
  );
}
