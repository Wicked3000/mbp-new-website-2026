import PageHero from "@/components/PageHero";
import { FODE_HERO } from "@/pages/programThemes";
import fodeBannerImg from "../../../assets/fode/fode-banner-img.jpg";

export function FODEPageHero() {
  return (
    <PageHero
      theme={FODE_HERO}
      image={fodeBannerImg}
      imageAlt="FODE learning materials"
      imagePosition="object-[50%_100%]"
      eyebrow="Program 04 - Flexible Open & Distance Education"
      title="Flexible Open &"
      highlight=" Distance Education (FODE)"
      lead="Quality secondary education for remote communities, working adults, and students needing flexible pathways - learning without boundaries across Milne Bay Province."
      actions={[
        { label: "Overview", to: "#overview", variant: "primary" },
        { label: "Find Centres", to: "#centres", variant: "secondary" },
      ]}
    />
  );
}
