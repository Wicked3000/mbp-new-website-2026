"use client";

import { useEntity } from "@/hooks/useDynamic";
import SharedPageHero, { TEAL_HERO } from "@/components/PageHero";

export function BasicEducationPageHero() {
  const FALLBACK = {
    eyebrow: "Program 01 - Basic Education",
    title: "Basic Education",
    subtitle: "Elementary to Grade 8",
    description:
      "Providing foundational literacy, numeracy and life skills for all children from Prep through to Grade 8 across Milne Bay Province's 312 schools.",
    banner: "/assets/education_programs/basic/banner.jpg",
    alt: "Elementary school students in Milne Bay",
  };
  const { data } = useEntity("basic_hero", [FALLBACK]);
  const hero = { ...FALLBACK, ...(data?.[0] || {}) };
  return (
    <SharedPageHero
      theme={TEAL_HERO}
      image={hero.banner}
      imageAlt={hero.alt}
      imageOpacity={40}
      eyebrow={hero.eyebrow}
      title={hero.title}
      highlight={hero.subtitle}
      lead={hero.description}
    />
  );
}
