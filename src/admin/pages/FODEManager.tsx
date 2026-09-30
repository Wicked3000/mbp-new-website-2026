"use client";

import { useState } from "react";
import Crud from "@/admin/components/Crud";

// Every section of the public FODE page (/fode) in one admin page, one tab per
// section. Follows the same shape as the other three programme pages.
//
// Selection lists are absent on purpose: the API keeps selection_students
// admin-only because it holds students' names, and those rows are managed
// through /admin/selections.

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
const iconCol = {
  key: "icon",
  label: "",
  render: (v: string) => <span className="text-xl">{v}</span>,
};

const TABS: Tab[] = [
  {
    key: "headings",
    label: "Section Headings",
    entity: "fode_section_headings",
    title: "Section Headings",
    subtitle: "Eyebrow, heading and blurb for each section on the page",
    fields: [
      { key: "skey", label: "Section key", required: true, placeholder: "programs" },
      { key: "eyebrow", label: "Eyebrow" },
      { key: "heading", label: "Heading" },
      { key: "blurb", label: "Blurb", type: "textarea" },
      ORDER,
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
    entity: "fode_hero",
    title: "Page Hero",
    subtitle: "The banner at the top of the FODE page",
    fields: [
      { key: "eyebrow", label: "Eyebrow", placeholder: "Program 04 - FODE" },
      { key: "title", label: "Title", required: true },
      { key: "subtitle", label: "Subtitle" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "banner", label: "Banner image", type: "image" },
      { key: "alt", label: "Image alt text" },
      ORDER,
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
    entity: "fode_overview",
    title: "Overview Text",
    subtitle: "Heading and the two intro paragraphs, plus the Key Features card title",
    fields: [
      { key: "eyebrow", label: "Eyebrow" },
      { key: "heading", label: "Heading" },
      { key: "intro", label: "Intro paragraph", type: "textarea" },
      { key: "body", label: "Second paragraph", type: "textarea" },
      { key: "features_title", label: "Key Features card title" },
      ORDER,
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
    entity: "fode_overview_cards",
    title: "Overview Cards",
    subtitle: "The four icon cards beside the overview text",
    fields: [
      { key: "icon", label: "Icon", placeholder: "📚" },
      { key: "title", label: "Title", required: true },
      { key: "desc", label: "Description", type: "textarea" },
      ORDER,
    ],
    columns: [iconCol, { key: "title", label: "Title" }, { key: "sort_order", label: "Order" }],
    defaultValues: { icon: "", title: "", desc: "", sort_order: 0 },
  },
  {
    key: "features",
    label: "Key Features",
    entity: "fode_overview_features",
    title: "Key Features",
    subtitle: "The tick list inside the Key Features card",
    fields: [{ key: "feature", label: "Feature", type: "textarea", required: true }, ORDER],
    columns: [
      { key: "feature", label: "Feature" },
      { key: "sort_order", label: "Order" },
    ],
    defaultValues: { feature: "", sort_order: 0 },
  },
  {
    key: "stats",
    label: "Overview Stats",
    entity: "fode_overview_stats",
    title: "Overview Stats",
    subtitle: "The four coloured statistic tiles",
    fields: [
      { key: "value_text", label: "Value", required: true, placeholder: "12" },
      { key: "label", label: "Label", required: true, placeholder: "Study Centres" },
      { key: "color", label: "Colour class", placeholder: "bg-[#0B2545]" },
      ORDER,
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
    key: "programs",
    label: "Study Programs",
    entity: "fode_programs",
    title: "Study Programs",
    subtitle: "The learning pathway cards",
    fields: [
      { key: "name", label: "Program name", required: true },
      { key: "level", label: "Level", placeholder: "Grade 10" },
      { key: "duration", label: "Duration", placeholder: "12–18 months" },
      { key: "subjects", label: "Subjects", type: "textarea" },
      { key: "target", label: "Target audience" },
      { key: "icon", label: "Icon", placeholder: "📖" },
      { key: "color", label: "Icon colour class", placeholder: "bg-blue-500" },
      ORDER,
    ],
    columns: [
      iconCol,
      { key: "name", label: "Program" },
      { key: "level", label: "Level" },
      { key: "duration", label: "Duration" },
      { key: "sort_order", label: "Order" },
    ],
    defaultValues: {
      name: "",
      level: "",
      duration: "",
      subjects: "",
      target: "",
      icon: "",
      color: "bg-blue-500",
      sort_order: 0,
    },
  },
  {
    key: "centres",
    label: "Study Centres",
    entity: "fode_centres",
    title: "Study Centres",
    subtitle: "The centre cards in the Study Network section",
    fields: [
      { key: "name", label: "Centre name", required: true },
      { key: "district", label: "District" },
      {
        key: "centre_type",
        label: "Type",
        type: "select",
        options: [
          "Main Centre",
          "Island Centre",
          "Mainland Centre",
          "Remote Centre",
          "Rural Centre",
          "Remote Island",
        ],
      },
      { key: "students", label: "Students", placeholder: "850+" },
      { key: "facilities", label: "Facilities", type: "textarea" },
      { key: "coordinator", label: "Coordinator", placeholder: "Ms. Grace Kila" },
      { key: "icon", label: "Icon", placeholder: "🏢" },
      ORDER,
    ],
    columns: [
      iconCol,
      { key: "name", label: "Centre" },
      { key: "district", label: "District" },
      { key: "centre_type", label: "Type" },
      { key: "coordinator", label: "Coordinator" },
      { key: "sort_order", label: "Order" },
    ],
    defaultValues: {
      name: "",
      district: "",
      centre_type: "Main Centre",
      students: "",
      facilities: "",
      coordinator: "",
      icon: "",
      sort_order: 0,
    },
  },
  {
    key: "delivery",
    label: "Delivery Methods",
    entity: "fode_delivery_methods",
    title: "Delivery Methods",
    subtitle: "The multi-modal learning cards",
    fields: [
      { key: "name", label: "Method name", required: true },
      { key: "desc", label: "Description", type: "textarea" },
      { key: "icon", label: "Icon", placeholder: "📦" },
      { key: "availability", label: "Availability", placeholder: "All Centres" },
      ORDER,
    ],
    columns: [
      iconCol,
      { key: "name", label: "Method" },
      { key: "availability", label: "Availability" },
      { key: "sort_order", label: "Order" },
    ],
    defaultValues: { name: "", desc: "", icon: "", availability: "", sort_order: 0 },
  },
  {
    key: "app",
    label: "Mobile App",
    entity: "fode_app_callout",
    title: "FODE Mobile App Callout",
    subtitle: "The callout under the delivery grid. Icon, heading and body come from the first row.",
    fields: [
      { key: "icon", label: "Icon", placeholder: "📱" },
      { key: "heading", label: "Heading", required: true },
      { key: "body", label: "Body", type: "textarea" },
      { key: "bullet", label: "Bullet", type: "textarea", required: true },
      ORDER,
    ],
    columns: [
      { key: "heading", label: "Heading" },
      { key: "bullet", label: "Bullet" },
      { key: "sort_order", label: "Order" },
    ],
    defaultValues: { icon: "📱", heading: "", body: "", bullet: "", sort_order: 0 },
  },
  {
    key: "enrolment_steps",
    label: "Enrolment Steps",
    entity: "fode_enrolment_steps",
    title: "Enrolment Steps",
    subtitle: "The numbered steps in the How to Enrol section",
    fields: [
      { key: "step", label: "Step number", required: true, placeholder: "01" },
      { key: "title", label: "Title", required: true },
      { key: "desc", label: "Description", type: "textarea" },
      ORDER,
    ],
    columns: [
      { key: "step", label: "Step" },
      { key: "title", label: "Title" },
      { key: "sort_order", label: "Order" },
    ],
    defaultValues: { step: "", title: "", desc: "", sort_order: 0 },
  },
  {
    key: "key_dates",
    label: "Key Dates",
    entity: "fode_key_dates",
    title: "2026 Key Dates",
    subtitle: "The date table beside the enrolment steps",
    fields: [
      { key: "label", label: "Label", required: true },
      { key: "date_text", label: "Date", required: true, placeholder: "15 January 2026" },
      ORDER,
    ],
    columns: [
      { key: "label", label: "Label" },
      { key: "date_text", label: "Date" },
      { key: "sort_order", label: "Order" },
    ],
    defaultValues: { label: "", date_text: "", sort_order: 0 },
  },
  {
    key: "support",
    label: "Support Cards",
    entity: "fode_support",
    title: "Support Cards",
    subtitle: "The cards in the Student Support section",
    fields: [
      { key: "icon", label: "Icon", placeholder: "👨‍🏫" },
      { key: "title", label: "Title", required: true },
      { key: "desc", label: "Description", type: "textarea" },
      ORDER,
    ],
    columns: [iconCol, { key: "title", label: "Title" }, { key: "sort_order", label: "Order" }],
    defaultValues: { icon: "", title: "", desc: "", sort_order: 0 },
  },
  {
    key: "support_contact",
    label: "Support Contact",
    entity: "fode_support_contact",
    title: "Support Contact Panel",
    subtitle: "The helpdesk panel. This page also has a WhatsApp contact row.",
    fields: [
      { key: "heading", label: "Heading" },
      { key: "body", label: "Body", type: "textarea" },
      { key: "phone_label", label: "Phone label" },
      { key: "phone_value", label: "Phone value" },
      { key: "email_label", label: "Email label" },
      { key: "email_value", label: "Email value" },
      { key: "whatsapp_label", label: "WhatsApp label" },
      { key: "whatsapp_value", label: "WhatsApp value" },
      { key: "office_label", label: "Office label" },
      { key: "office_value", label: "Office value" },
      { key: "button_label", label: "Button label" },
      { key: "button_href", label: "Button link" },
      ORDER,
    ],
    columns: [
      { key: "heading", label: "Heading" },
      { key: "phone_value", label: "Phone" },
      { key: "email_value", label: "Email" },
      { key: "whatsapp_value", label: "WhatsApp" },
    ],
    defaultValues: {
      heading: "",
      body: "",
      phone_label: "",
      phone_value: "",
      email_label: "",
      email_value: "",
      whatsapp_label: "",
      whatsapp_value: "",
      office_label: "",
      office_value: "",
      button_label: "",
      button_href: "/contact",
      sort_order: 1,
    },
  },
  {
    key: "initiatives",
    label: "Initiatives",
    entity: "fode_initiatives",
    title: "Key Initiatives",
    subtitle: "The programme cards in the Key Initiatives section",
    fields: [
      { key: "title", label: "Title", required: true },
      { key: "desc", label: "Description", type: "textarea" },
      { key: "icon", label: "Icon", placeholder: "📱" },
      { key: "status", label: "Status", placeholder: "Active" },
      { key: "color", label: "Icon colour class", placeholder: "bg-teal-500" },
      ORDER,
    ],
    columns: [
      iconCol,
      { key: "title", label: "Title" },
      { key: "status", label: "Status" },
      { key: "color", label: "Colour" },
      { key: "sort_order", label: "Order" },
    ],
    defaultValues: { title: "", desc: "", icon: "", status: "", color: "bg-teal-500", sort_order: 0 },
  },
  {
    key: "faq",
    label: "FAQ",
    entity: "fode_faq",
    title: "FAQ",
    subtitle: "The expandable questions at the foot of the page",
    fields: [
      { key: "q", label: "Question", type: "textarea", required: true },
      { key: "a", label: "Answer", type: "textarea", required: true },
      ORDER,
    ],
    columns: [
      { key: "q", label: "Question" },
      { key: "sort_order", label: "Order" },
    ],
    defaultValues: { q: "", a: "", sort_order: 0 },
  },
];

export default function FODEManager() {
  const [active, setActive] = useState(TABS[0].key);
  const tab = TABS.find((t) => t.key === active) || TABS[0];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0B2545]">FODE Page</h1>
        <p className="text-sm text-gray-600 mt-1">
          Every section of the public FODE page (<code>/fode</code>), one tab per section. Student
          selection lists are managed under Selections.
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
