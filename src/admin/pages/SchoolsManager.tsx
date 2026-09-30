"use client";

import { useMemo } from "react";
import Crud from "@/admin/components/Crud";
import { useEntity } from "@/hooks/useDynamic";

const DISTRICT_FALLBACK = [
  "Alotau",
  "Samarai-Murua",
  "Esa'ala",
  "Kiriwina-Goodenough",
  "Huhu",
  "Rabaruana",
  "Losuia",
  "Dobu",
];

export default function SchoolsManager() {
  // Options come from the districts table so the list cannot drift out of sync
  // with what the Coverage section shows.
  const { data } = useEntity("districts", DISTRICT_FALLBACK.map((name, i) => ({ name })) as any);
  const districtOptions = useMemo(() => {
    const names = (data as any[]).map((d) => d?.name).filter(Boolean);
    return names.length ? names : DISTRICT_FALLBACK;
  }, [data]);
  // The district pages match a school on district_id when it is set, so the
  // foreign key has to be editable or it silently goes stale when a school is
  // moved by name. Kept as a separate field rather than derived inside Crud,
  // which has no notion of two columns that must agree.
  const districtIdOptions = useMemo(() => {
    const pairs = (data as any[])
      .filter((d) => d?.id != null && d?.name)
      .map((d) => ({ label: d.name, value: String(d.id) }));
    return pairs.length ? pairs : [];
  }, [data]);

  return (
    <Crud
      entity="schools"
      title="Schools"
      subtitle="Shown on each district page and in the school directory"
      defaultValues={{
        level: "Primary",
        type: "Provincial Primary",
        category: "Government",
        day_boarding: "Day",
        enrolled: 0,
        capacity: 0,
      }}
      fields={[
        { key: "name", label: "School name", required: true },
        { key: "district", label: "District", type: "select", options: districtOptions, required: true },
        {
          key: "district_id",
          label: "District ID",
          type: "select",
          options: districtIdOptions,
          // Must name the same district as the field above. The district pages
          // match on this when it is set, so the two disagreeing puts the
          // school in the wrong place, or in two places.
        },
        {
          key: "type",
          label: "School type",
          type: "select",
          options: [
            "Provincial Primary",
            "Provincial High",
            "National High",
            "Primary",
            "Elementary",
            "Secondary",
            "Technical",
            "Specialist",
          ],
          required: true,
        },
        {
          key: "level",
          label: "Level",
          type: "select",
          options: ["Primary", "Elementary", "Secondary", "Upper Secondary", "Combined"],
          required: true,
        },
        { key: "code", label: "School code / registration no." },
        { key: "established", label: "Year established", type: "number" },
        {
          key: "category",
          label: "Category",
          type: "select",
          options: ["Government", "Denominational", "Private", "Approved National", "Community"],
        },
        { key: "day_boarding", label: "Day / boarding", type: "select", options: ["Day", "Boarding", "Day & Boarding"] },

        { key: "capacity", label: "Capacity", type: "number" },
        { key: "enrolled", label: "Total students", type: "number" },
        { key: "male", label: "Male students", type: "number" },
        { key: "female", label: "Female students", type: "number" },
        { key: "day_students", label: "Day students", type: "number" },
        { key: "boarders", label: "Boarders", type: "number" },

        { key: "teachers", label: "Total teachers", type: "number" },
        { key: "teachers_male", label: "Teachers (male)", type: "number" },
        { key: "teachers_female", label: "Teachers (female)", type: "number" },
        { key: "untrained_teachers", label: "Untrained teachers", type: "number" },
        { key: "staff", label: "Total non-teaching staff", type: "number" },
        { key: "admin_officers", label: "Administrative officers", type: "number" },
        { key: "support_staff", label: "Support staff", type: "number" },
        { key: "principal", label: "Principal" },
        { key: "head_teacher", label: "Head teacher" },

        { key: "classrooms", label: "Number of classrooms", type: "number" },
        { key: "land_hectares", label: "Land area (hectares)", type: "number" },
        { key: "has_library", label: "Library", type: "select", options: ["Yes", "No"] },
        { key: "has_computer_lab", label: "Computer lab", type: "select", options: ["Yes", "No"] },
        { key: "has_science_lab", label: "Science lab", type: "select", options: ["Yes", "No"] },
        { key: "has_sports_field", label: "Sports field", type: "select", options: ["Yes", "No"] },
        { key: "has_boarding", label: "Boarding facilities", type: "select", options: ["Yes", "No"] },

        { key: "streams", label: "Streams / subjects offered", type: "textarea" },
        { key: "exam_centre", label: "Exam centre" },
        { key: "extracurricular", label: "Extra-curricular activities", type: "textarea" },

        { key: "contact_person", label: "Public contact person" },
        { key: "contact", label: "Phone", required: true },
        { key: "alt_phone", label: "Alternate phone" },
        { key: "email", label: "Email" },
        { key: "location", label: "Township / locality" },
        { key: "address", label: "Full postal address", type: "textarea" },
        { key: "lat", label: "Latitude", type: "number", placeholder: "-10.3456789" },
        { key: "lng", label: "Longitude", type: "number", placeholder: "150.1745000" },

        { key: "transport", label: "School transport", type: "textarea" },
        { key: "uniform", label: "Uniform requirements", type: "textarea" },
        { key: "fees", label: "Fees / funding", type: "textarea" },
        { key: "img", label: "Photo", type: "image" },
        { key: "notes", label: "Additional notes", type: "textarea" },
      ]}
      columns={[
        {
          key: "img",
          label: "Photo",
          render: (v) =>
            v ? (
              <img loading="lazy" decoding="async" src={v} alt="" className="h-10 w-16 rounded object-cover" />
            ) : (
              <span className="text-xs text-gray-400">None</span>
            ),
        },
        { key: "name", label: "School" },
        { key: "district", label: "District" },
        { key: "type", label: "Type" },
        {
          key: "enrolled",
          label: "Students (M / F)",
          render: (v, row) => (
            <span className="whitespace-nowrap">
              {v ?? 0}
              <span className="text-gray-400">
                {" "}
                ({row?.male ?? 0} / {row?.female ?? 0})
              </span>
            </span>
          ),
        },
        {
          key: "teachers",
          label: "Teachers / Staff",
          render: (v, row) => (
            <span className="whitespace-nowrap">
              {v ?? 0}
              <span className="text-gray-400"> / {row?.staff ?? 0}</span>
            </span>
          ),
        },
        {
          key: "lat",
          label: "Map",
          render: (v, row) =>
            v != null && row?.lng != null ? (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${row.lat},${row.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-[#0D9488] hover:underline"
              >
                Open ↗
              </a>
            ) : (
              <span className="text-xs text-gray-400">No coords</span>
            ),
        },
      ]}
    />
  );
}
