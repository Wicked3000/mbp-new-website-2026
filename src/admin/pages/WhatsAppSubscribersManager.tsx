import Crud from "@/admin/components/Crud";

const CHANNELS = [
  "Official announcements",
  "Parent and guardian updates",
  "Teacher updates",
  "FODE and distance learning",
];

export default function WhatsAppSubscribersManager() {
  return (
    <Crud
      entity="whatsapp_subscribers"
      title="WhatsApp Subscribers"
      subtitle="Manage numbers receiving official education updates."
      fields={[
        {
          key: "phone",
          label: "WhatsApp number",
          type: "text",
          placeholder: "+675 7XXX XXXX",
          required: true,
        },
        {
          key: "source",
          label: "Updates channel",
          type: "select",
          options: CHANNELS,
          required: true,
        },
      ]}
      columns={[
        {
          key: "phone",
          label: "WhatsApp number",
          render: (value) => <span className="font-bold text-[#0B2545]">{value}</span>,
        },
        {
          key: "source",
          label: "Updates channel",
          render: (value) => (
            <span className="text-xs bg-teal-50 text-teal-700 px-2 py-1 rounded-full font-semibold">
              {value}
            </span>
          ),
        },
        {
          key: "created_at",
          label: "Subscribed",
          render: (value) => (value ? new Date(value).toLocaleDateString() : "Local fallback"),
        },
      ]}
      defaultValues={{ phone: "", source: CHANNELS[0] }}
    />
  );
}
