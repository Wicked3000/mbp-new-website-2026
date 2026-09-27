import Crud from "@/admin/components/Crud";
export default function LeadershipManager() {
  return (
    <Crud
      entity="leadership"
      title="Leadership Team"
      subtitle="About page + home advisor section"
      fields={[
        { key: "name", label: "Name", required: true },
        { key: "title", label: "Title", required: true },
        { key: "bio", label: "Bio", type: "textarea", required: true },
        { key: "icon", label: "Icon emoji", placeholder: "👨‍💼" },
        { key: "photo", label: "Photo", type: "image" },
        { key: "sort_order", label: "Order", type: "number" },
      ]}
      columns={[
        { key: "name", label: "Name" },
        { key: "title", label: "Title" },
        { key: "sort_order", label: "Order" },
      ]}
    />
  );
}
