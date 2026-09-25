import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/admin/components/Toast";

const KEYS = [
  { k: "site_phone", label: "Phone" },
  { k: "site_email", label: "Email" },
  { k: "site_hours", label: "Office Hours" },
  { k: "site_address", label: "Address" },
  { k: "helpdesk_phone", label: "Helpdesk Phone" },
  { k: "helpdesk_email", label: "Helpdesk Email" },
  { k: "emergency_note", label: "Emergency Note" },
];

export default function SettingsManager() {
  const toast = useToast();
  const [vals, setVals] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    api
      .settings()
      .then((d) => setVals(d || {}))
      .finally(() => setLoading(false));
  }, []);
  async function save() {
    setSaving(true);
    try {
      for (const { k } of KEYS) {
        await api.updateSetting(k, vals[k] || "");
      }
      toast.success("Settings saved successfully");
    } catch (e: any) {
      toast.error(e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }
  if (loading) return <div className="text-sm text-gray-500">Loading…</div>;
  return (
    <div className="space-y-4 max-w-3xl">
      <div>
        <h1
          className="text-2xl font-bold text-[#0B2545]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Site Settings
        </h1>
        <p className="text-sm text-gray-500">
          Header contact strip, footer address, helpdesk - stored in <code>site_settings</code>{" "}
          table.
        </p>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        {KEYS.map(({ k, label }) => (
          <div key={k}>
            <label className="text-xs font-bold uppercase tracking-widest text-gray-600">
              {label} - <span className="font-mono normal-case">{k}</span>
            </label>
            <input
              value={vals[k] || ""}
              onChange={(e) => setVals({ ...vals, [k]: e.target.value })}
              className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 outline-none"
            />
          </div>
        ))}
        <button
          onClick={save}
          disabled={saving}
          className="bg-[#0B2545] text-white font-bold px-6 py-3 rounded-full text-sm disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
