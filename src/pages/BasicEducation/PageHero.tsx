import PageHero, { TEAL_HERO } from "@/components/PageHero";

export function BasicEducationPageHero() {
  return (
    <PageHero
      theme={TEAL_HERO}
      image="https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=1600&h=900&fit=crop&auto=format"
      imageAlt="Elementary school students in Milne Bay"
      eyebrow="Program 01 - Basic Education"
      title="Basic Education"
      highlight="Elementary to Grade 8"
      lead="Providing foundational literacy, numeracy and life skills for all children from Prep through to Grade 8 across Milne Bay Province's 312 schools."
      actions={[
        { label: "Overview", to: "#overview", variant: "primary" },
        { label: "Find Schools", to: "#schools", variant: "secondary" },
      ]}
    />
  );
}
