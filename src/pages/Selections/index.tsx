import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { PageHero } from "./PageHero";
import { KeyInfoSection } from "./KeyInfoSection";
import { Grade9Section } from "./Grade9Section";
import { Grade11Section } from "./Grade11Section";
import { ProcessSection } from "./ProcessSection";
import { FAQSection } from "./FAQSection";

export default function SelectionsPage() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif" }}>
      <SiteHeader />
      <main id="main-content">
        <PageHero />
        <KeyInfoSection />
        <Grade9Section />
        <Grade11Section />
        <ProcessSection />
        <FAQSection />
      </main>
      <SiteFooter />
    </div>
  );
}
