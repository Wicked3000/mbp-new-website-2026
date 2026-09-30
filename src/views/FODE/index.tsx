import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { FODEPageHero } from "./PageHero";
import { OverviewSection } from "./OverviewSection";
import { ProgramsSection } from "./ProgramsSection";
import { CentresSection } from "./CentresSection";
import { SelectionListsSection } from "./SelectionListsSection";
import { DeliverySection } from "./DeliverySection";
import { EnrolmentSection } from "./EnrolmentSection";
import { SupportSection } from "./SupportSection";
import { InitiativesSection } from "./InitiativesSection";
import { DownloadsSection } from "./DownloadsSection";
import { FAQSection } from "./FAQSection";

export default function FODEPage() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif" }}>
      <SiteHeader />
      <FODEPageHero />
      <main id="main-content">
        <OverviewSection />
        <ProgramsSection />
        <CentresSection />
        <SelectionListsSection />
        <DeliverySection />
        <EnrolmentSection />
        <SupportSection />
        <InitiativesSection />
        <DownloadsSection />
      </main>
      <FAQSection />
      <SiteFooter />
    </div>
  );
}
