"use client";

import { useState } from "react";
import Crud from "@/admin/components/Crud";

// Every section of the public Basic Education page (/basic) in one admin page,
// one tab per section. Each tab is a Crud bound to the table that now backs
// that section; the page component falls back to its inline copy if a table is
// empty, so a section is never blank just because it has not been filled in.

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

const ORDER_FIELD = { key: "sort_order", label: "Order", type: "number" as const };

const TABS: Tab[] = [
  {
    key: "headings",
    label: "Section Headings",
    entity: "basic_section_headings",
    title: "Section Headings",
    subtitle: "Eyebrow, heading and blurb for each section on the page",
    fields: [
      { key: "skey", label: "Section key", required: true, placeholder: "curriculum" },
      { key: "eyebrow", label: "Eyebrow" },
      { key: "heading", label: "Heading" },
      { key: "blurb", label: "Blurb", type: "textarea" },
      ORDER_FIELD,
    ],
    columns: [
      { key: "skey", label: "Key" },
      { key: "eyebrow", label: "Eyebrow" },
      { key: "heading", label: "Heading" },
      { key: "sort_order", label: "Order" },
    ],
    defaultValues: { skey: "", eyebrow: "", heading: "", blurb: "", sort_order: 0 },
  },
  {
    key: "hero",
    label: "Page Hero",
    entity: "basic_hero",
    title: "Page Hero",
    subtitle: "The banner at the top of the Basic Education page",
    fields: [
      { key: "eyebrow", label: "Eyebrow", placeholder: "Program 01 - Basic Education" },
      { key: "title", label: "Title", required: true },
      { key: "subtitle", label: "Subtitle" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "banner", label: "Banner image", type: "image" },
      { key: "alt", label: "Image alt text" },
      ORDER_FIELD,
    ],
    columns: [
      { key: "title", label: "Title" },
      { key: "subtitle", label: "Subtitle" },
      { key: "eyebrow", label: "Eyebrow" },
    ],
    defaultValues: {
      eyebrow: "",
      title: "",
      subtitle: "",
      description: "",
      banner: "",
      alt: "",
      sort_order: 1,
    },
  },
  {
    key: "overview",
    label: "Overview",
    entity: "basic_overview",
    title: "Overview Text",
    subtitle: "Heading and the two intro paragraphs, plus the Key Features card title",
    fields: [
      { key: "eyebrow", label: "Eyebrow" },
      { key: "heading", label: "Heading" },
      { key: "intro", label: "Intro paragraph", type: "textarea" },
      { key: "body", label: "Second paragraph", type: "textarea" },
      { key: "features_title", label: "Key Features card title" },
      ORDER_FIELD,
    ],
    columns: [
      { key: "heading", label: "Heading" },
      { key: "eyebrow", label: "Eyebrow" },
      { key: "features_title", label: "Features card" },
    ],
    defaultValues: {
      eyebrow: "",
      heading: "",
      intro: "",
      body: "",
      features_title: "",
      sort_order: 1,
    },
  },
  {
    key: "overview_cards",
    label: "Overview Cards",
    entity: "basic_overview_cards",
    title: "Overview Cards",
    subtitle: "The four icon cards beside the overview text",
    fields: [
      { key: "icon", label: "Icon", placeholder: "📘" },
      { key: "title", label: "Title", required: true },
      { key: "desc", label: "Description", type: "textarea" },
      ORDER_FIELD,
    ],
    columns: [
      {
        key: "icon",
        label: "",
        render: (v: string) => <span className="text-xl">{v}</span>,
      },
      { key: "title", label: "Title" },
      { key: "sort_order", label: "Order" },
    ],
    defaultValues: { icon: "", title: "", desc: "", sort_order: 0 },
  },
  {
    key: "features",
    label: "Key Features",
    entity: "basic_overview_features",
    title: "Key Features",
    subtitle: "The tick list inside the Key Features card",
    fields: [
      { key: "feature", label: "Feature", type: "textarea", required: true },
      ORDER_FIELD,
    ],
    columns: [
      { key: "feature", label: "Feature" },
      { key: "sort_order", label: "Order" },
    ],
    defaultValues: { feature: "", sort_order: 0 },
  },
  {
    key: "stats",
    label: "Overview Stats",
    entity: "basic_overview_stats",
    title: "Overview Stats",
    subtitle: "The four coloured statistic tiles",
    fields: [
      { key: "value_text", label: "Value", required: true, placeholder: "312" },
      { key: "label", label: "Label", required: true, placeholder: "Schools" },
      {
        key: "color",
        label: "Colour class",
        placeholder: "bg-[#0B2545]",
      },
      ORDER_FIELD,
    ],
    columns: [
      { key: "value_text", label: "Value" },
      { key: "label", label: "Label" },
      { key: "color", label: "Colour" },
      { key: "sort_order", label: "Order" },
    ],
    defaultValues: { value_text: "", label: "", color: "bg-[#0B2545]", sort_order: 0 },
  },
  {
    key: "curriculum",
    label: "Curriculum",
    entity: "basic_curriculum",
    title: "Curriculum Subjects",
    subtitle: "The subject grid in the Curriculum section",
    fields: [
      { key: "area", label: "Subject area", required: true },
      { key: "grades", label: "Grades", placeholder: "3–8" },
      { key: "desc", label: "Description", type: "textarea" },
      { key: "icon", label: "Icon", placeholder: "📝" },
      ORDER_FIELD,
    ],
    columns: [
      { key: "icon", label: "", render: (v: string) => <span className="text-xl">{v}</span> },
      { key: "area", label: "Area" },
      { key: "grades", label: "Grades" },
      { key: "sort_order", label: "Order" },
    ],
    defaultValues: { area: "", grades: "", desc: "", icon: "", sort_order: 0 },
  },
  {
    key: "initiatives",
    label: "Initiatives",
    entity: "basic_initiatives",
    title: "Key Initiatives",
    subtitle: "The programme cards in the Key Initiatives section",
    fields: [
      { key: "title", label: "Title", required: true },
      { key: "desc", label: "Description", type: "textarea" },
      { key: "icon", label: "Icon", placeholder: "📖" },
      { key: "status", label: "Status", placeholder: "Active" },
      {
        key: "color",
        label: "Icon colour class",
        placeholder: "bg-teal-500",
      },
      ORDER_FIELD,
    ],
    columns: [
      { key: "icon", label: "", render: (v: string) => <span className="text-xl">{v}</span> },
      { key: "title", label: "Title" },
      { key: "status", label: "Status" },
      { key: "color", label: "Colour" },
      { key: "sort_order", label: "Order" },
    ],
    defaultValues: { title: "", desc: "", icon: "", status: "", color: "bg-teal-500", sort_order: 0 },
  },
  {
    key: "support",
    label: "Support Cards",
    entity: "basic_support",
    title: "Support Cards",
    subtitle: "The cards in the Support & Resources section",
    fields: [
      { key: "icon", label: "Icon", placeholder: "📄" },
      { key: "title", label: "Title", required: true },
      { key: "desc", label: "Description", type: "textarea" },
      ORDER_FIELD,
    ],
    columns: [
      { key: "icon", label: "", render: (v: string) => <span className="text-xl">{v}</span> },
      { key: "title", label: "Title" },
      { key: "sort_order", label: "Order" },
    ],
    defaultValues: { icon: "", title: "", desc: "", sort_order: 0 },
  },
  {
    key: "support_contact",
    label: "Support Contact",
    entity: "basic_support_contact",
    title: "Support Contact Panel",
    subtitle: "The helpdesk panel beside the support cards",
    fields: [
      { key: "heading", label: "Heading" },
      { key: "body", label: "Body", type: "textarea" },
      { key: "phone_label", label: "Phone label" },
      { key: "phone_value", label: "Phone value" },
      { key: "email_label", label: "Email label" },
      { key: "email_value", label: "Email value" },
      { key: "office_label", label: "Office label" },
      { key: "office_value", label: "Office value" },
      { key: "button_label", label: "Button label" },
      { key: "button_href", label: "Button link" },
      ORDER_FIELD,
    ],
    columns: [
      { key: "heading", label: "Heading" },
      { key: "phone_value", label: "Phone" },
      { key: "email_value", label: "Email" },
    ],
    defaultValues: {
      heading: "",
      body: "",
      phone_label: "",
      phone_value: "",
      email_label: "",
      email_value: "",
      office_label: "",
      office_value: "",
      button_label: "",
      button_href: "/contact",
      sort_order: 1,
    },
  },
  {
    key: "faq",
    label: "FAQ",
    entity: "basic_faq",
    title: "FAQ",
    subtitle: "The expandable questions at the foot of the page",
    fields: [
      { key: "q", label: "Question", type: "textarea", required: true },
      { key: "a", label: "Answer", type: "textarea", required: true },
      ORDER_FIELD,
    ],
    columns: [
      { key: "q", label: "Question" },
      { key: "sort_order", label: "Order" },
    ],
    defaultValues: { q: "", a: "", sort_order: 0 },
  },
];

export default function BasicEducationManager() {
  const [active, setActive] = useState(TABS[0].key);
  const tab = TABS.find((t) => t.key === active) || TABS[0];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0B2545]">Basic Education Page</h1>
        <p className="text-sm text-gray-600 mt-1">
          Every section of the public Basic Education page (<code>/basic</code>), one tab per
          section. Changes appear on the site once saved.
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
