import SharedPageHero, { NAVY_HERO } from "@/components/PageHero";

export function PageHero() {
  return (
    <SharedPageHero
      theme={NAVY_HERO}
      image="https://images.unsplash.com/photo-1587440871870-84826771b576?w=1600&h=900&fit=crop&auto=format"
      imageAlt=""
      imageOpacity={40}
      eyebrow="2026 Selection Lists"
      title={
        <>
          Grade 9 &amp; 11 Selections
          <span className="block text-[#C9A84C]">2026 Academic Year</span>
        </>
      }
      lead="Official placement lists for students transitioning to Grade 9 (Secondary) and Grade 11 (Upper Secondary) across Milne Bay Province schools."
      actions={[
        { label: "Grade 9 Selection", to: "#grade9", variant: "primary" },
        { label: "Grade 11 Selection", to: "#grade11", variant: "secondary" },
      ]}
    />
  );
}
