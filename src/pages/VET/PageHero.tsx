import { useEntity } from "@/hooks/useDynamic";
import PageHero, { TEAL_HERO } from "@/components/PageHero";

export function VETPageHero() {
  const FALLBACK = {
    eyebrow: "Program 03 - Vocational Education & Training",
    title: "Vocational Education",
    subtitle: " & Training (VET)",
    description:
      "Skills and trades training for out-of-school youth and adults, delivered through registered VET providers across Milne Bay Province - building a skilled workforce for PNG's future.",
    banner: "/assets/vet/vet-banner.jpg",
    alt: "VET training workshop",
  };
  const { data } = useEntity("vet_hero", [FALLBACK]);
  const hero = { ...FALLBACK, ...(data?.[0] || {}) };
  return (
    <PageHero
      theme={TEAL_HERO}
      image={hero.banner}
      imageAlt={hero.alt}
      imageOpacity={40}
      imagePosition="object-[50%_40%]"
      eyebrow={hero.eyebrow}
      title={hero.title}
      highlight={hero.subtitle}
      lead={hero.description}
      actions={[
        { label: "Overview", to: "#overview", variant: "primary" },
        { label: "Find Centres", to: "#centres", variant: "secondary" },
      ]}
    />
  );
}
