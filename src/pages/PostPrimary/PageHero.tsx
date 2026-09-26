import PageHero from "@/components/PageHero";
import { POST_PRIMARY_HERO } from "@/pages/programThemes";

export function PostPrimaryPageHero() {
  return (
    <PageHero
      theme={POST_PRIMARY_HERO}
      image="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1600&h=900&fit=crop&auto=format"
      imageAlt="Secondary school students"
      eyebrow="Program 02 - Post Primary"
      title="Post Primary"
      highlight="Grades 9 – 12"
      lead="Secondary education pathways preparing students for tertiary admission, technical training, and employment across Milne Bay's 24 secondary and national high schools."
      actions={[
        { label: "Overview", to: "#overview", variant: "primary" },
        { label: "Find Schools", to: "#schools", variant: "secondary" },
      ]}
    />
  );
}
