import { useEntity } from "@/hooks/useDynamic";
import PageHero, { TEAL_HERO } from "@/components/PageHero";

export function FODEPageHero() {
  const FALLBACK = {
    eyebrow: "Program 04 - Flexible Open & Distance Education",
    title: "Flexible Open &",
    subtitle: " Distance Education (FODE)",
    description:
      "Quality secondary education for remote communities, working adults, and students needing flexible pathways - learning without boundaries across Milne Bay Province.",
    banner: "/assets/fode/fode-banner-img.jpg",
    alt: "FODE learning materials",
  };
  const { data } = useEntity("fode_hero", [FALLBACK]);
  const hero = { ...FALLBACK, ...(data?.[0] || {}) };
  return (
    <PageHero
      theme={TEAL_HERO}
      image={hero.banner}
      imageAlt={hero.alt}
      imageOpacity={40}
      imagePosition="object-[50%_100%]"
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
