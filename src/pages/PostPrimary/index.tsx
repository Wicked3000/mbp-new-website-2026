import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { PostPrimaryPageHero } from "./PageHero";
import { OverviewSection } from "./OverviewSection";
import { CurriculumSection } from "./CurriculumSection";
import { SchoolsSection } from "./SchoolsSection";
import { SelectionListsSection } from "./SelectionListsSection";
import { PathwaysSection } from "./PathwaysSection";
import { InitiativesSection } from "./InitiativesSection";
import { SupportSection } from "./SupportSection";
import { DownloadsSection } from "./DownloadsSection";
import { FAQSection } from "./FAQSection";

export default function PostPrimaryPage() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif" }}>
      <SiteHeader />
      <PostPrimaryPageHero />
      <main id="main-content">
        <OverviewSection />
        <CurriculumSection />
        <SchoolsSection />
        <SelectionListsSection />
        <PathwaysSection />
        <InitiativesSection />
        <SupportSection />
        <DownloadsSection />
      </main>
      <FAQSection />
      <SiteFooter />
    </div>
  );
}
