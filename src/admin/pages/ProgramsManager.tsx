"use client";

import Crud from "@/admin/components/Crud";
export default function ProgramsManager() {
  return (
    <Crud
      entity="programs"
      title="Education Programs"
      subtitle="4 program cards"
      fields={[
        { key: "code", label: "Code", required: true, placeholder: "01" },
        { key: "label", label: "Label", required: true },
        {
          key: "level",
          label: "Level",
          required: true,
          placeholder: "Elementary – Grade 8",
        },
        {
          key: "description",
          label: "Description",
          type: "textarea",
          required: true,
        },
        { key: "color", label: "Color class", placeholder: "bg-[#0B2545]" },
        { key: "accent", label: "Accent class", placeholder: "bg-teal-500" },
        { key: "href", label: "Link href", placeholder: "/basic" },
        {
          key: "img",
          label: "Program image",
          type: "image",
          required: true,
        },
        { key: "sort_order", label: "Order", type: "number" },
      ]}
      columns={[
        { key: "code", label: "Code" },
        { key: "label", label: "Label" },
        { key: "level", label: "Level" },
        { key: "sort_order", label: "Order" },
      ]}
    />
  );
}
