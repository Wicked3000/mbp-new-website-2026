import Crud from "@/admin/components/Crud";
export default function StatsManager() {
  return (
    <Crud
      entity="stats"
      title="Stats Bar"
      subtitle="4-number stats strip"
      fields={[
        {
          key: "value_text",
          label: "Value",
          required: true,
          placeholder: "312",
        },
        { key: "label", label: "Label", required: true },
        {
          key: "sub",
          label: "Sub",
          required: true,
          placeholder: "Province-wide",
        },
        { key: "sort_order", label: "Order", type: "number" },
      ]}
      columns={[
        { key: "value_text", label: "Value" },
        { key: "label", label: "Label" },
        { key: "sub", label: "Sub" },
      ]}
    />
  );
}
