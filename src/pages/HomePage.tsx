import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { HeroSection } from "@/home/HeroSection";
import { QuickLinksStrip } from "@/home/QuickLinksStrip";
import { StatsSection } from "@/home/StatsSection";
import { ProgramsSection } from "@/home/ProgramsSection";
import { AboutMissionSection } from "@/home/AboutMissionSection";
import { SelectionBanner } from "@/home/SelectionBanner";
import { NewsSection } from "@/home/NewsSection";
import { EventsSection } from "@/home/EventsSection";
import { LeadershipSection } from "@/home/LeadershipSection";
import { DistrictsSection } from "@/home/DistrictsSection";
import { PartnersSection } from "@/home/PartnersSection";
import { HelpCTASection } from "@/home/HelpCTASection";

export default function HomePage() {
  return (
    <div
      className="min-h-screen bg-[#F8F6F1]"
      style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif" }}
    >
      <SiteHeader />
      <main id="main-content">
        <HeroSection />
        <QuickLinksStrip />
        <StatsSection />
        <ProgramsSection />
        <AboutMissionSection />
        <SelectionBanner />
        <NewsSection />
        <EventsSection />
        <LeadershipSection />
        <DistrictsSection />
        <PartnersSection />
        <HelpCTASection />
      </main>
      <SiteFooter />
    </div>
  );
}
