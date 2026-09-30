"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/admin/components/Toast";

type Field = {
  key: string;
  label: string;
  type?: "text" | "textarea" | "select" | "number" | "image" | "file" | "date";
  /**
   * Select choices. A plain string is both the label and the stored value; a
   * {label, value} pair is needed when the value must be something other than
   * the visible text, such as an empty string for "not scoped to a programme".
   */
  options?: (string | { label: string; value: string })[];
  placeholder?: string;
  required?: boolean;
};

export default function Crud({
  entity,
  title,
  subtitle,
  fields,
  columns,
  defaultValues,
}: {
  entity: string;
  title: string;
  subtitle?: string;
  fields: Field[];
  columns: {
    key: string;
    label: string;
    render?: (v: any, row: any) => any;
  }[];
  defaultValues?: any;
}) {
  const toast = useToast();
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState<any>(defaultValues || {});
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [invalidField, setInvalidField] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const d = await api.list(entity);
      setRows(d);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, [entity]);
  useEffect(() => {
    if (editing) setForm(editing);
    else setForm(defaultValues || {});
  }, [editing, defaultValues]);

  const filtered = rows.filter(
    (r) => !q || Object.values(r).join(" ").toLowerCase().includes(q.toLowerCase()),
  );

  const rowName = (row: any) => {
    const key = columns[0]?.key;
    const value = key ? row[key] : undefined;
    const text = value == null ? "" : String(value).trim();
    return text || (row.id != null ? `record ${row.id}` : "record");
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const missingFile = fields.find(
        (field) =>
          (field.type === "image" || field.type === "file") && field.required && !form[field.key],
      );
      if (missingFile) {
        setInvalidField(missingFile.key);
        throw new Error(`${missingFile.label} is required`);
      }
      setInvalidField(null);
      const payload = { ...form };
      fields
        .filter((f) => f.type === "number")
        .forEach((f) => {
          if (payload[f.key] !== "" && payload[f.key] != null)
            payload[f.key] = Number(payload[f.key]);
        });
      if (editing?.id) {
        await api.update(entity, editing.id, payload);
        toast.success(`${title} updated successfully`);
      } else {
        await api.create(entity, payload);
        toast.success(`${title} created successfully`);
      }
      setEditing(null);
      setForm(defaultValues || {});
      await load();
    } catch (err: any) {
      toast.error(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }
  async function del(id: any) {
    if (!confirm("Delete this item?")) return;
    try {
      await api.remove(entity, id);
      toast.success(`${title} deleted`);
      await load();
    } catch (err: any) {
      toast.error(err.message || "Delete failed");
    }
  }

  async function uploadImage(fieldKey: string, event: React.ChangeEvent<HTMLInputElement>) {
    const input = event.target;
    const file = input.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      input.value = "";
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast.error("Image is too large - maximum 8MB");
      input.value = "";
      return;
    }
    setUploadingField(fieldKey);
    try {
      const url = await api.upload(file);
      setForm((current: any) => ({ ...current, [fieldKey]: url }));
      toast.success("Image uploaded successfully");
    } catch (error: any) {
      toast.error(error.message || "Image upload failed");
    } finally {
      setUploadingField(null);
      input.value = "";
    }
  }

  async function uploadFile(fieldKey: string, event: React.ChangeEvent<HTMLInputElement>) {
    const input = event.target;
    const file = input.files?.[0];
    if (!file) return;
    if (!/\.(pdf|doc|docx|xls|xlsx|csv|txt)$/i.test(file.name)) {
      toast.error("Please select a PDF, Word, Excel, CSV, or TXT file");
      input.value = "";
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      toast.error("File is too large - maximum 25MB");
      input.value = "";
      return;
    }
    setUploadingField(fieldKey);
    try {
      const url = await api.upload(file);
      setForm((current: any) => ({ ...current, [fieldKey]: url }));
      toast.success("File uploaded successfully");
    } catch (error: any) {
      toast.error(error.message || "File upload failed");
    } finally {
      setUploadingField(null);
      input.value = "";
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1
            className="text-2xl font-bold text-[#0B2545]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {title}
          </h1>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        <div className="flex gap-2">
          <input
            id={`search-${entity}`}
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search…"
            aria-label={`Search ${title}`}
            className="px-4 py-2.5 rounded-full border border-gray-200 bg-white text-sm w-56 focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 outline-none"
          />
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setForm(defaultValues || {});
              document.getElementById(`form-${entity}`)?.scrollIntoView({ behavior: "smooth" });
            }}
            className="bg-[#0B2545] text-white text-sm font-bold px-5 py-2.5 rounded-full hover:bg-[#163663]"
          >
            + Add
          </button>
        </div>
      </div>

      <div
        className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
        aria-busy={loading}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <caption className="sr-only">{title} records</caption>
            <thead>
              <tr className="bg-[#0B2545] text-white text-left">
                {columns.map((c) => (
                  <th key={c.key} scope="col" className="px-4 py-3 font-semibold whitespace-nowrap">
                    {c.label}
                  </th>
                ))}
                <th scope="col" className="px-4 py-3 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={columns.length + 1} className="px-4 py-10 text-center text-gray-500">
                    Loading…
                  </td>
                </tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={columns.length + 1} className="px-4 py-10 text-center text-gray-500">
                    No records
                  </td>
                </tr>
              )}
              {filtered.map((r, i) => (
                <tr
                  key={r.id ?? i}
                  className={`border-b ${i % 2 === 0 ? "bg-white" : "bg-[#F8F6F1]"}`}
                >
                  {columns.map((c) => (
                    <td key={c.key} className="px-4 py-3 text-gray-700 max-w-[260px] truncate">
                      {c.render ? c.render((r as any)[c.key], r) : String((r as any)[c.key] ?? "")}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      type="button"
                      aria-label={`Edit ${rowName(r)}`}
                      onClick={() => setEditing(r)}
                      className="text-xs font-bold bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full hover:bg-amber-200 mr-1"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      aria-label={`Delete ${rowName(r)}`}
                      onClick={() => del(r.id)}
                      className="text-xs font-bold bg-red-50 text-red-600 px-3 py-1.5 rounded-full hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 bg-[#F8F6F1] border-t border-gray-100 text-xs text-gray-500 flex justify-between">
          <span>
            {filtered.length} of {rows.length} records
          </span>
          <span>
            Entity: <code className="bg-white px-1 rounded border">{entity}</code> - stored in MySQL
            + local fallback
          </span>
        </div>
      </div>

      <form
        id={`form-${entity}`}
        aria-labelledby={`form-${entity}-heading`}
        onSubmit={submit}
        className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 id={`form-${entity}-heading`} className="font-bold text-[#0B2545]">
            {editing ? "Edit" : "Add"} - {title}
          </h2>
          {editing && (
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setForm(defaultValues || {});
              }}
              className="text-xs font-bold bg-gray-100 px-3 py-1.5 rounded-full"
            >
              Cancel
            </button>
          )}
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {fields.map((f) => (
            <div
              key={f.key}
              className={
                f.type === "textarea" || f.type === "image" || f.type === "file"
                  ? "sm:col-span-2"
                  : ""
              }
            >
              <label
                htmlFor={`field-${entity}-${f.key}`}
                className="text-xs font-bold uppercase tracking-widest text-gray-600"
              >
                {f.label} {f.required && <span className="text-red-500">*</span>}
              </label>
              {f.type === "file" ? (
                <div className="mt-1">
                  <input
                    id={`field-${entity}-${f.key}`}
                    type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt"
                    disabled={uploadingField === f.key}
                    aria-invalid={invalidField === f.key || undefined}
                    aria-describedby={
                      invalidField === f.key ? `error-${entity}-${f.key}` : undefined
                    }
                    onChange={(event) => {
                      setInvalidField(null);
                      uploadFile(f.key, event);
                    }}
                    className="w-full text-sm file:mr-3 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:bg-[#0B2545] file:text-white file:font-bold hover:file:bg-[#163663] disabled:opacity-60 border border-gray-200 rounded-xl px-3 py-1.5 bg-white"
                  />
                  <div className="text-xs text-gray-500 mt-2">
                    Choose PDF, Word, Excel, CSV, or TXT up to 25MB.
                  </div>
                  {invalidField === f.key && (
                    <p
                      id={`error-${entity}-${f.key}`}
                      className="text-xs font-semibold text-red-600 mt-2"
                    >
                      {f.label} is required
                    </p>
                  )}
                  {uploadingField === f.key && (
                    <div className="text-xs font-bold text-[#0D9488] mt-2" role="status">
                      Uploading file...
                    </div>
                  )}
                  {form[f.key] && (
                    <a
                      href={form[f.key]}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block text-xs font-semibold text-[#0D9488] mt-2 hover:underline"
                    >
                      View selected file
                    </a>
                  )}
                </div>
              ) : f.type === "image" ? (
                <div className="mt-1 flex flex-col sm:flex-row gap-4 items-start">
                  <div className="flex-1 w-full">
                    <input
                      id={`field-${entity}-${f.key}`}
                      type="file"
                      accept="image/*"
                      disabled={uploadingField === f.key}
                      aria-invalid={invalidField === f.key || undefined}
                      aria-describedby={
                        invalidField === f.key ? `error-${entity}-${f.key}` : undefined
                      }
                      onChange={(event) => {
                        setInvalidField(null);
                        uploadImage(f.key, event);
                      }}
                      className="w-full text-sm file:mr-3 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:bg-[#0B2545] file:text-white file:font-bold hover:file:bg-[#163663] disabled:opacity-60 border border-gray-200 rounded-xl px-3 py-1.5 bg-white"
                    />
                    <div className="text-xs text-gray-500 mt-2">
                      Choose JPG, PNG, GIF, or WEBP up to 8MB.
                    </div>
                    {invalidField === f.key && (
                      <p
                        id={`error-${entity}-${f.key}`}
                        className="text-xs font-semibold text-red-600 mt-2"
                      >
                        {f.label} is required
                      </p>
                    )}
                    {uploadingField === f.key && (
                      <div className="text-xs font-bold text-[#0D9488] mt-2" role="status">
                        Uploading image...
                      </div>
                    )}
                  </div>
                  {form[f.key] && (
                    <div className="w-full sm:w-56 shrink-0">
                      <img loading="lazy" decoding="async"
                        src={form[f.key]}
                        alt={`Selected preview for ${f.label}`}
                        className="w-full h-32 object-cover rounded-xl border border-gray-200 bg-[#F8F6F1]"
                      />
                      <div className="text-xs font-semibold text-emerald-700 mt-2">
                        Image selected
                      </div>
                    </div>
                  )}
                </div>
              ) : f.type === "textarea" ? (
                <textarea
                  id={`field-${entity}-${f.key}`}
                  value={form[f.key] ?? ""}
                  onChange={(e) => {
                    setInvalidField(null);
                    setForm({ ...form, [f.key]: e.target.value });
                  }}
                  rows={3}
                  placeholder={f.placeholder}
                  required={f.required}
                  className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 outline-none text-sm"
                />
              ) : f.type === "date" ? (
                <div>
                  <input
                    id={`field-${entity}-${f.key}`}
                    type="text"
                    value={form[f.key] ?? ""}
                    onChange={(e) => {
                      setInvalidField(null);
                      setForm({ ...form, [f.key]: e.target.value });
                    }}
                    placeholder={f.placeholder ?? "15 January 2026"}
                    required={f.required}
                    aria-describedby={`hint-${entity}-${f.key}`}
                    className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 outline-none text-sm"
                  />
                  {/* Not a native date input: these tables store the value as
                      the site displays it, which a date input cannot hold. */}
                  <p
                    id={`hint-${entity}-${f.key}`}
                    className="text-xs text-gray-500 mt-1.5"
                  >
                    As displayed on the site, e.g. 15 January 2026
                  </p>
                </div>
              ) : f.type === "select" ? (
                <select
                  id={`field-${entity}-${f.key}`}
                  value={form[f.key] ?? ""}
                  onChange={(e) => {
                    setInvalidField(null);
                    setForm({ ...form, [f.key]: e.target.value });
                  }}
                  className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 outline-none"
                >
                  <option value="">Select</option>
                  {f.options?.map((o) => {
                    const value = typeof o === "string" ? o : o.value;
                    const text = typeof o === "string" ? o : o.label;
                    return (
                      <option key={value} value={value}>
                        {text}
                      </option>
                    );
                  })}
                </select>
              ) : (
                <input
                  id={`field-${entity}-${f.key}`}
                  // Kept a text input for dates: these tables store the value as
                  // displayed on the site ("15 January 2026"), which a native
                  // date input cannot hold. The hint below says so.
                  type={f.type === "number" ? "number" : "text"}
                  value={form[f.key] ?? ""}
                  onChange={(e) => {
                    setInvalidField(null);
                    setForm({ ...form, [f.key]: e.target.value });
                  }}
                  placeholder={f.placeholder}
                  required={f.required}
                  className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 outline-none text-sm"
                />
              )}
            </div>
          ))}
        </div>
        <button
          type="submit"
          disabled={saving}
          aria-busy={saving}
          className="bg-[#0D9488] hover:bg-[#0b7a6e] text-white font-bold px-6 py-3 rounded-full text-sm disabled:opacity-60"
        >
          {saving ? "Saving…" : editing ? "Update" : "Create"}
        </button>
      </form>
    </div>
  );
}
