import PageHero from "@/components/PageHero";
import { VET_HERO } from "@/pages/programThemes";
import vetBanner from "../../../assets/vet/vet-banner.png";

export function VETPageHero() {
  return (
    <PageHero
      theme={VET_HERO}
      image={vetBanner}
      imageAlt="VET training workshop"
      imagePosition="object-[50%_40%]"
      eyebrow="Program 03 - Vocational Education & Training"
      title="Vocational Education"
      highlight=" & Training (VET)"
      lead="Skills and trades training for out-of-school youth and adults, delivered through registered VET providers across Milne Bay Province - building a skilled workforce for PNG's future."
      actions={[
        { label: "Overview", to: "#overview", variant: "primary" },
        { label: "Find Centres", to: "#centres", variant: "secondary" },
      ]}
    />
  );
}
