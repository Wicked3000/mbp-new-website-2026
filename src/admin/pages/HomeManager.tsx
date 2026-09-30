"use client";

import ManagerTabs, { type ManagerTab } from "@/admin/components/ManagerTabs";
import HeroManager from "@/admin/pages/HeroManager";
import NewsManager from "@/admin/pages/NewsManager";
import NoticesManager from "@/admin/pages/NoticesManager";
import EventsManager from "@/admin/pages/EventsManager";
import { QuickLinksManager } from "@/admin/pages/SimpleManagers";

// Every section of the home page, in the order it appears on /, one tab each.
//
// Five of these were already plain Crud tables (stats, programs, leadership,
// districts, partners) and are inlined here as configs. Five more were
// database-backed but needed custom UI of their own - the hero slider's upload
// widget, the news and notices publish toggles, the events editor, the quick
// links form - so they are rendered as their existing manager components rather
// than rebuilt. The remaining five are the home page sections that were
// hardcoded in src/App.tsx and gained tables in this work.

const ORDER = { key: "sort_order", label: "Order", type: "number" as const };

const TABS: ManagerTab[] = [
  {
    key: "hero",
    label: "Hero Slider",
    component: <HeroManager />,
  },
  {
    key: "quicklinks",
    label: "Quick Links",
    component: <QuickLinksManager />,
  },
  {
    key: "stats",
    label: "Stats",
    entity: "stats",
    title: "Stats Bar",
    subtitle: "4-number stats strip",
    fields: [
      { key: "value_text", label: "Value", required: true, placeholder: "312" },
      { key: "label", label: "Label", required: true },
      { key: "sub", label: "Sub", required: true, placeholder: "Province-wide" },
      ORDER,
    ],
    columns: [
      { key: "value_text", label: "Value" },
      { key: "label", label: "Label" },
      { key: "sub", label: "Sub" },
    ],
  },
  {
    key: "programs",
    label: "Programs",
    entity: "programs",
    title: "Education Programs",
    subtitle: "4 program cards",
    fields: [
      { key: "code", label: "Code", required: true, placeholder: "01" },
      { key: "label", label: "Label", required: true },
      { key: "level", label: "Level", required: true, placeholder: "Elementary - Grade 8" },
      { key: "description", label: "Description", type: "textarea", required: true },
      { key: "color", label: "Color class", placeholder: "bg-[#0B2545]" },
      { key: "accent", label: "Accent class", placeholder: "bg-teal-500" },
      { key: "href", label: "Link href", placeholder: "/basic" },
      { key: "img", label: "Program image", type: "image", required: true },
      ORDER,
    ],
    columns: [
      { key: "code", label: "Code" },
      { key: "label", label: "Label" },
      { key: "level", label: "Level" },
      { key: "sort_order", label: "Order" },
    ],
  },
  {
    key: "mission",
    label: "Mission Section",
    entity: "home_mission",
    title: "Mission Section",
    subtitle: "The Our Mission block: copy, image, years-of-service badge and button",
    fields: [
      { key: "eyebrow", label: "Eyebrow", placeholder: "Our Mission" },
      { key: "heading", label: "Heading", required: true },
      { key: "heading_accent", label: "Heading accent", placeholder: "Through Education" },
      { key: "para1", label: "First paragraph", type: "textarea" },
      { key: "para2", label: "Second paragraph", type: "textarea" },
      { key: "image", label: "Image", type: "image" },
      { key: "image_alt", label: "Image alt text" },
      { key: "badge_value", label: "Badge value", placeholder: "25+" },
      { key: "badge_label", label: "Badge label", placeholder: "Years of service" },
      { key: "badge_sub", label: "Badge sub-label" },
      { key: "button_label", label: "Button label" },
      { key: "button_href", label: "Button link", placeholder: "/about" },
      ORDER,
    ],
    columns: [
      { key: "heading", label: "Heading" },
      { key: "eyebrow", label: "Eyebrow" },
      { key: "badge_value", label: "Badge" },
    ],
    defaultValues: {
      eyebrow: "",
      heading: "",
      heading_accent: "",
      para1: "",
      para2: "",
      image: "",
      image_alt: "",
      badge_value: "",
      badge_label: "",
      badge_sub: "",
      button_label: "",
      button_href: "/about",
      sort_order: 1,
    },
  },
  {
    key: "mission_points",
    label: "Mission Points",
    entity: "home_mission_points",
    title: "Mission Points",
    subtitle: "The four tick items under the mission paragraphs",
    fields: [{ key: "feature", label: "Point", type: "textarea", required: true }, ORDER],
    columns: [
      { key: "feature", label: "Point" },
      { key: "sort_order", label: "Order" },
    ],
    defaultValues: { feature: "", sort_order: 0 },
  },
  {
    key: "selection_banner",
    label: "Selections Banner",
    entity: "home_selection_banner",
    title: "Selections Banner",
    subtitle: "The gradient banner linking to /selections and /downloads",
    fields: [
      { key: "icon", label: "Icon", placeholder: "🎓" },
      { key: "title", label: "Title", required: true },
      { key: "badge", label: "Badge", placeholder: "NEW" },
      { key: "body", label: "Body", type: "textarea" },
      { key: "primary_label", label: "Primary button label" },
      { key: "primary_href", label: "Primary button link", placeholder: "/selections" },
      { key: "secondary_label", label: "Secondary button label" },
      { key: "secondary_href", label: "Secondary button link", placeholder: "/downloads" },
      ORDER,
    ],
    columns: [
      { key: "title", label: "Title" },
      { key: "badge", label: "Badge" },
      { key: "primary_label", label: "Primary button" },
      { key: "secondary_label", label: "Secondary button" },
    ],
    defaultValues: {
      icon: "🎓",
      title: "",
      badge: "",
      body: "",
      primary_label: "",
      primary_href: "/selections",
      secondary_label: "",
      secondary_href: "/downloads",
      sort_order: 1,
    },
  },
  {
    key: "news",
    label: "News",
    component: <NewsManager />,
  },
  {
    key: "notices",
    label: "Notices",
    component: <NoticesManager />,
  },
  {
    key: "events",
    label: "Events",
    component: <EventsManager />,
  },
  {
    key: "leadership",
    label: "Leadership",
    entity: "leadership",
    title: "Leadership Team",
    subtitle: "About page + home advisor section",
    fields: [
      { key: "name", label: "Name", required: true },
      { key: "title", label: "Title", required: true },
      { key: "bio", label: "Bio", type: "textarea", required: true },
      { key: "icon", label: "Icon emoji", placeholder: "👨‍💼" },
      { key: "photo", label: "Photo", type: "image" },
      ORDER,
    ],
    columns: [
      { key: "name", label: "Name" },
      { key: "title", label: "Title" },
      { key: "sort_order", label: "Order" },
    ],
  },
  {
    key: "districts",
    label: "Districts",
    entity: "districts",
    title: "Districts & Schools",
    subtitle: "Coverage section thumbnails + district table",
    fields: [
      { key: "name", label: "District name", required: true },
      { key: "capital", label: "District capital", placeholder: "e.g. Alotau / Rabaraba" },
      { key: "schools", label: "Schools count", type: "number", required: true },
      {
        key: "type",
        label: "Type",
        type: "select",
        options: ["Urban", "Rural", "Island", "Remote", "Remote Islands", "Island / Coastal"],
        required: true,
      },
      { key: "students", label: "Students (e.g. 6,800+)", required: true },
      { key: "img", label: "Thumbnail", type: "image" },
      ORDER,
    ],
    columns: [
      {
        key: "img",
        label: "Thumb",
        render: (value: string) =>
          value ? (
            <img
              loading="lazy"
              decoding="async"
              src={value}
              alt=""
              className="h-10 w-16 rounded object-cover"
            />
          ) : (
            <span className="text-xs text-gray-400">None</span>
          ),
      },
      { key: "name", label: "Name" },
      { key: "capital", label: "Capital" },
      { key: "schools", label: "Schools" },
      { key: "type", label: "Type" },
      { key: "students", label: "Students" },
      { key: "sort_order", label: "Order" },
    ],
  },
  {
    key: "partners",
    label: "Partners",
    entity: "partners",
    title: "Partners",
    subtitle: "Upload and manage trusted partner logos",
    fields: [
      { key: "name", label: "Name", required: true },
      { key: "logo", label: "Partner logo", type: "image", required: true },
      ORDER,
    ],
    columns: [
      {
        key: "logo",
        label: "Logo",
        render: (value: string) =>
          value ? (
            <img
              loading="lazy"
              decoding="async"
              src={value}
              alt="Partner logo"
              className="h-9 w-16 object-contain"
            />
          ) : (
            <span className="text-xs text-gray-400">No logo</span>
          ),
      },
      { key: "name", label: "Name" },
      { key: "sort_order", label: "Order" },
    ],
  },
  {
    key: "cta",
    label: "WhatsApp CTA",
    entity: "home_cta",
    title: "WhatsApp Call To Action",
    subtitle: "Copy, image and form labels. The form itself still posts to the API.",
    fields: [
      { key: "badge", label: "Badge", placeholder: "Support" },
      { key: "heading", label: "Heading", required: true },
      { key: "body", label: "Body", type: "textarea" },
      { key: "sub_body", label: "Second paragraph", type: "textarea" },
      { key: "image", label: "Illustration", type: "image" },
      { key: "image_alt", label: "Image alt text" },
      { key: "tagline", label: "Tagline under image" },
      { key: "form_title", label: "Form title" },
      { key: "form_body", label: "Form body", type: "textarea" },
      { key: "phone_label", label: "Phone field label" },
      { key: "phone_placeholder", label: "Phone placeholder" },
      { key: "channel_label", label: "Channel field label" },
      { key: "channel_prompt", label: "Channel dropdown prompt" },
      { key: "button_label", label: "Submit button label" },
      { key: "button_loading_label", label: "Submit button (busy)" },
      { key: "response_note", label: "Response note" },
      ORDER,
    ],
    columns: [
      { key: "heading", label: "Heading" },
      { key: "form_title", label: "Form title" },
      { key: "button_label", label: "Submit button" },
    ],
    defaultValues: {
      badge: "",
      heading: "",
      body: "",
      sub_body: "",
      image: "",
      image_alt: "",
      tagline: "",
      form_title: "",
      form_body: "",
      phone_label: "",
      phone_placeholder: "",
      channel_label: "",
      channel_prompt: "",
      button_label: "",
      button_loading_label: "",
      response_note: "",
      sort_order: 1,
    },
  },
  {
    key: "cta_channels",
    label: "WhatsApp Channels",
    entity: "home_cta_channels",
    title: "WhatsApp Channels",
    subtitle:
      "Options in the channel dropdown. Each value is stored as the source on a subscription, so renaming one does not rewrite existing subscribers.",
    fields: [{ key: "name", label: "Channel name", required: true }, ORDER],
    columns: [
      { key: "name", label: "Channel" },
      { key: "sort_order", label: "Order" },
    ],
    defaultValues: { name: "", sort_order: 0 },
  },
];

export default function HomeManager() {
  return (
    <ManagerTabs
      title="Home Page"
      description="Every section of the home page, in the order it appears on /."
      tabs={TABS}
    />
  );
}
