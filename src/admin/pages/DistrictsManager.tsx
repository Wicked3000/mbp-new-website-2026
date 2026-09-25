import Crud from "@/admin/components/Crud";
export default function DistrictsManager() {
  return (
    <Crud
      entity="districts"
      title="Districts & Schools"
      subtitle="Coverage section + BasicEducation schools table"
      fields={[
        { key: "name", label: "District name", required: true },
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
      ]}
      columns={[
        { key: "name", label: "Name" },
        { key: "schools", label: "Schools" },
        { key: "type", label: "Type" },
        { key: "students", label: "Students" },
      ]}
    />
  );
}
