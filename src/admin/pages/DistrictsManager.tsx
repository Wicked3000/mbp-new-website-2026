"use client";

import Crud from "@/admin/components/Crud";

export default function DistrictsManager() {
  return (
    <Crud
      entity="districts"
      title="Districts & Schools"
      subtitle="Coverage section thumbnails + BasicEducation district table"
      fields={[
        { key: "name", label: "District name", required: true },
        { key: "capital", label: "District capital", placeholder: "e.g. Alotau / Rabaraba" },
        {
          key: "schools",
          label: "Schools count",
          type: "number",
          required: true,
        },
        {
          key: "type",
          label: "Type",
          type: "select",
          options: ["Urban", "Rural", "Island", "Remote", "Remote Islands", "Island / Coastal"],
          required: true,
        },
        { key: "students", label: "Students (e.g. 6,800+)", required: true },
        {
          key: "img",
          label: "Thumbnail",
          type: "image",
          // Optional: the Coverage card falls back to an icon when unset.
        },
        { key: "sort_order", label: "Order", type: "number" },
      ]}
      columns={[
        {
          key: "img",
          label: "Thumb",
          render: (value) =>
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
      ]}
    />
  );
}
