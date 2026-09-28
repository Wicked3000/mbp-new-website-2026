import { useState } from "react";
import Crud from "@/admin/components/Crud";

// Every section of the public VET page (/vet) in one admin page, one tab per
// section. Mirrors BasicEducationManager and PostPrimaryManager.
//
// Selection lists are absent on purpose: the API keeps selection_students
// admin-only because it holds trainees' names, and the trainee rows are
// managed through /admin/selections. The centre names in the accordion are
// place data, so those are editable here.

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
    entity: "vet_section_headings",
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
    entity: "vet_hero",
    title: "Page Hero",
    subtitle: "The banner at the top of the VET page",
    fields: [
      { key: "eyebrow", label: "Eyebrow", placeholder: "Program 03 - Vocational Education" },
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
    entity: "vet_overview",
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
    entity: "vet_overview_cards",
    title: "Overview Cards",
    subtitle: "The four icon cards beside the overview text",
    fields: [
      { key: "icon", label: "Icon", placeholder: "🔧" },
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
    entity: "vet_overview_features",
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
    entity: "vet_overview_stats",
    title: "Overview Stats",
    subtitle: "The four coloured statistic tiles",
    fields: [
      { key: "value_text", label: "Value", required: true, placeholder: "6" },
      { key: "label", label: "Label", required: true, placeholder: "Training Centres" },
      { key: "color", label: "Colour class", placeholder: "bg-[#0D9488]" },
      ORDER,
    ],
    columns: [
      { key: "value_text", label: "Value" },
      { key: "label", label: "Label" },
      { key: "color", label: "Colour" },
      { key: "sort_order", label: "Order" },
    ],
    defaultValues: { value_text: "", label: "", color: "bg-[#0D9488]", sort_order: 0 },
  },
  {
    key: "programs",
    label: "Trade Programs",
    entity: "vet_programs",
    title: "Trade Programs",
    subtitle: "The certificate course cards",
    fields: [
      { key: "code", label: "Code", required: true, placeholder: "CPC10120" },
      { key: "name", label: "Name", required: true },
      { key: "level", label: "Level", placeholder: "NC1" },
      { key: "duration", label: "Duration", placeholder: "6 months" },
      { key: "trades", label: "Trades", type: "textarea" },
      { key: "icon", label: "Icon", placeholder: "🔨" },
      { key: "color", label: "Icon colour class", placeholder: "bg-amber-500" },
      ORDER,
    ],
    columns: [
      iconCol,
      { key: "name", label: "Program" },
      { key: "code", label: "Code" },
      { key: "level", label: "Level" },
      { key: "sort_order", label: "Order" },
    ],
    defaultValues: {
      code: "",
      name: "",
      duration: "",
      level: "NC1",
      trades: "",
      icon: "",
      color: "bg-amber-500",
      sort_order: 0,
    },
  },
  {
    key: "centres",
    label: "Training Centres",
    entity: "vet_centres",
    title: "Training Centres",
    subtitle: "The centre cards in the Training Network section",
    fields: [
      { key: "name", label: "Centre name", required: true },
      { key: "district", label: "District" },
      {
        key: "status",
        label: "Status",
        type: "select",
        options: ["Operational", "Opening 2026", "Planned"],
      },
      { key: "programs", label: "Programs", type: "textarea" },
      { key: "capacity", label: "Capacity", placeholder: "300" },
      { key: "facilities", label: "Facilities", type: "textarea" },
      { key: "icon", label: "Icon", placeholder: "🏢" },
      ORDER,
    ],
    columns: [
      iconCol,
      { key: "name", label: "Centre" },
      { key: "district", label: "District" },
      { key: "status", label: "Status" },
      { key: "capacity", label: "Capacity" },
      { key: "sort_order", label: "Order" },
    ],
    defaultValues: {
      name: "",
      district: "",
      status: "Operational",
      programs: "",
      capacity: "",
      facilities: "",
      icon: "",
      sort_order: 0,
    },
  },
  {
    key: "centre_names",
    label: "Selection Centres",
    entity: "vet_centre_names",
    title: "Selection List Centre Names",
    subtitle: "The centre headings in the VET selection accordion",
    fields: [{ key: "name", label: "Centre name", required: true, placeholder: "Kwato TVET" }, ORDER],
    columns: [
      { key: "name", label: "Centre" },
      { key: "sort_order", label: "Order" },
    ],
    defaultValues: { name: "", sort_order: 0 },
  },
  {
    key: "partners",
    label: "Industry Partners",
    entity: "vet_partners",
    title: "Industry Partners",
    subtitle: "The partner cards in the Industry Partnerships section",
    fields: [
      { key: "name", label: "Organisation", required: true },
      { key: "sector", label: "Sector", placeholder: "Mining" },
      { key: "programs", label: "Programs", type: "textarea" },
      { key: "icon", label: "Icon", placeholder: "⛏️" },
      ORDER,
    ],
    columns: [
      iconCol,
      { key: "name", label: "Organisation" },
      { key: "sector", label: "Sector" },
      { key: "sort_order", label: "Order" },
    ],
    defaultValues: { name: "", sector: "", programs: "", icon: "", sort_order: 0 },
  },
  {
    key: "apprenticeship",
    label: "Apprenticeship",
    entity: "vet_apprenticeship",
    title: "Apprenticeship & Traineeship",
    subtitle:
      "The callout under the partner grid. Icon, heading and body come from the first row.",
    fields: [
      { key: "icon", label: "Icon", placeholder: "🎓" },
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
    defaultValues: { icon: "🎓", heading: "", body: "", bullet: "", sort_order: 0 },
  },
  {
    key: "initiatives",
    label: "Initiatives",
    entity: "vet_initiatives",
    title: "Key Initiatives",
    subtitle: "The programme cards in the Key Initiatives section",
    fields: [
      { key: "title", label: "Title", required: true },
      { key: "desc", label: "Description", type: "textarea" },
      { key: "icon", label: "Icon", placeholder: "🚚" },
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
    key: "enrolment_steps",
    label: "Enrolment Steps",
    entity: "vet_enrolment_steps",
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
    key: "intake_dates",
    label: "Intake Dates",
    entity: "vet_intake_dates",
    title: "Intake Dates",
    subtitle: "The 2026 intake date table",
    fields: [
      { key: "label", label: "Label", required: true },
      { key: "date_text", label: "Date", required: true, placeholder: "1 October 2025" },
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
    entity: "vet_support",
    title: "Support Cards",
    subtitle: "The cards in the Support & Resources section",
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
    key: "support_contact",
    label: "Support Contact",
    entity: "vet_support_contact",
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
      ORDER,
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
    entity: "vet_faq",
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

export default function VETManager() {
  const [active, setActive] = useState(TABS[0].key);
  const tab = TABS.find((t) => t.key === active) || TABS[0];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0B2545]">VET Page</h1>
        <p className="text-sm text-gray-600 mt-1">
          Every section of the public VET page (<code>/vet</code>), one tab per section. Trainee
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
