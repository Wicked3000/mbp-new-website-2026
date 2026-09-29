import { useEntity } from "@/hooks/useDynamic";
import PageHero, { NAVY_HERO } from "@/components/PageHero";

export function PostPrimaryPageHero() {
  const FALLBACK = {
    eyebrow: "Program 02 - Post Primary",
    title: "Post Primary",
    subtitle: "Grades 9 – 12",
    description:
      "Secondary education pathways preparing students for tertiary admission, technical training, and employment across Milne Bay's 24 secondary and national high schools.",
    banner: "/assets/education_programs/post/banner.jpg",
    alt: "Secondary school students",
  };
  const { data } = useEntity("post_hero", [FALLBACK]);
  const hero = { ...FALLBACK, ...(data?.[0] || {}) };
  return (
    <PageHero
      theme={NAVY_HERO}
      image={hero.banner}
      imageAlt={hero.alt}
      imageOpacity={40}
      eyebrow={hero.eyebrow}
      title={hero.title}
      highlight={hero.subtitle}
      lead={hero.description}
      actions={[
        { label: "Overview", to: "#overview", variant: "primary" },
        { label: "Find Schools", to: "#schools", variant: "secondary" },
      ]}
    />
  );
}
