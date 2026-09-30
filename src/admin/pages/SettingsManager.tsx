"use client";

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
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [pwBusy, setPwBusy] = useState(false);
  const [pwError, setPwError] = useState<{ field: "next" | "confirm"; text: string } | null>(null);
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
  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    if (pw.next.length < 12) {
      setPwError({ field: "next", text: "Use at least 12 characters for the new password" });
      toast.error("Use at least 12 characters for the new password");
      return;
    }
    if (pw.next !== pw.confirm) {
      setPwError({ field: "confirm", text: "The new passwords do not match" });
      toast.error("The new passwords do not match");
      return;
    }
    setPwError(null);
    setPwBusy(true);
    try {
      await api.changePassword(pw.current, pw.next);
      setPw({ current: "", next: "", confirm: "" });
      setPwError(null);
      toast.success("Password updated. Other sessions have been signed out.");
    } catch (err: any) {
      toast.error(err.message || "Password change failed");
    } finally {
      setPwBusy(false);
    }
  }
  if (loading)
    return (
      <div className="text-sm text-gray-500" role="status" aria-live="polite">
        Loading…
      </div>
    );
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
            <label
              htmlFor={`setting-${k}`}
              className="text-xs font-bold uppercase tracking-widest text-gray-600"
            >
              {label} - <span className="font-mono normal-case">{k}</span>
            </label>
            <input
              id={`setting-${k}`}
              name={k}
              value={vals[k] || ""}
              onChange={(e) => setVals({ ...vals, [k]: e.target.value })}
              className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 outline-none"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={save}
          disabled={saving}
          aria-busy={saving}
          className="bg-[#0B2545] text-white font-bold px-6 py-3 rounded-full text-sm disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save Settings"}
        </button>
      </div>

      <section
        aria-labelledby="change-password-heading"
        className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4"
      >
        <div>
          <h2
            id="change-password-heading"
            className="text-lg font-bold text-[#0B2545]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Change Password
          </h2>
          <p id="change-password-hint" className="text-sm text-gray-500">
            At least 12 characters. Changing it signs out every other device.
          </p>
        </div>
        <form
          onSubmit={changePassword}
          aria-busy={pwBusy}
          aria-describedby="change-password-hint"
          className="space-y-4 max-w-sm"
        >
          {(
            [
              {
                key: "current",
                name: "current-password",
                label: "Current password",
                autoComplete: "current-password",
              },
              {
                key: "next",
                name: "new-password",
                label: "New password",
                autoComplete: "new-password",
              },
              {
                key: "confirm",
                name: "confirm-password",
                label: "Confirm new password",
                autoComplete: "new-password",
              },
            ] as const
          ).map(({ key, name, label, autoComplete }) => (
            <div key={key}>
              <label
                htmlFor={`pw-${key}`}
                className="text-xs font-bold uppercase tracking-widest text-gray-600"
              >
                {label}
              </label>
              <input
                id={`pw-${key}`}
                name={name}
                type="password"
                required
                minLength={key === "current" ? undefined : 12}
                aria-invalid={pwError?.field === key || undefined}
                aria-describedby={
                  [
                    key === "current" ? undefined : "change-password-hint",
                    pwError?.field === key ? `pw-${key}-error` : undefined,
                  ]
                    .filter(Boolean)
                    .join(" ") || undefined
                }
                autoComplete={autoComplete}
                value={pw[key]}
                onChange={(e) => {
                  if (pwError) setPwError(null);
                  setPw({ ...pw, [key]: e.target.value });
                }}
                className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 outline-none"
              />
              {pwError?.field === key && (
                <p id={`pw-${key}-error`} className="text-xs font-semibold text-red-600 mt-1.5">
                  {pwError.text}
                </p>
              )}
            </div>
          ))}
          <button
            type="submit"
            disabled={pwBusy}
            aria-busy={pwBusy}
            className="bg-[#0B2545] text-white font-bold px-6 py-3 rounded-full text-sm disabled:opacity-60"
          >
            {pwBusy ? "Updating…" : "Update Password"}
          </button>
        </form>
      </section>
    </div>
  );
}
