import { useState } from "react";
import Crud from "@/admin/components/Crud";

// Admin content for the home page.
//
// Most of the home page was already database-backed before this: the hero
// slider, quick links, stats, programs, news, notices, events, leadership,
// districts and partners each have their own manager, all reachable from the
// sidebar. Only the mission section, the selection banner and the WhatsApp call
// to action were hardcoded in src/App.tsx, and those are the tabs here.

type Tab = {
  key: string;
  label: string;
  entity: string;
  title: string;
  subtitle: string;
  fields: any[];
  columns: any[];
  defaultValues?: any;
};

const ORDER = { key: "sort_order", label: "Order", type: "number" as const };

const TABS: Tab[] = [
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
  const [active, setActive] = useState(TABS[0].key);
  const tab = TABS.find((t) => t.key === active) || TABS[0];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0B2545]">Home Page</h1>
        <p className="text-sm text-gray-600 mt-1">
          The three home page sections that were hardcoded. The rest of the home page - hero
          slider, quick links, stats, programs, news, notices, events, leadership, districts and
          partners - is managed from its own pages in the sidebar.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 pb-3">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setActive(t.key)}
            aria-current={active === t.key ? "page" : undefined}
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
              active === t.key
                ? "bg-[#0B2545] text-white"
                : "bg-white text-gray-700 border border-gray-200 hover:border-[#0D9488] hover:text-[#0D9488]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <Crud
        key={tab.key}
        entity={tab.entity}
        title={tab.title}
        subtitle={tab.subtitle}
        fields={tab.fields}
        columns={tab.columns}
        defaultValues={tab.defaultValues}
      />
    </div>
  );
}
