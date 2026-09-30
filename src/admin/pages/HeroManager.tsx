"use client";

import { useEffect, useState, useRef } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/admin/components/Toast";

type Slide = {
  id: number;
  src: string;
  alt: string;
  sort_order: number;
  is_active: number;
};

export default function HeroManager() {
  const toast = useToast();
  const [rows, setRows] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Slide | null>(null);
  const [form, setForm] = useState({
    src: "",
    alt: "",
    sort_order: 0,
    is_active: 1,
  });
  const [preview, setPreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [srcInvalid, setSrcInvalid] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    try {
      const d = await api.list("hero_slides");
      setRows(d as Slide[]);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);
  useEffect(() => {
    if (editing) {
      setForm({
        src: editing.src,
        alt: editing.alt,
        sort_order: editing.sort_order,
        is_active: editing.is_active,
      });
      setPreview(editing.src);
    } else {
      setForm({ src: "", alt: "", sort_order: 0, is_active: 1 });
      setPreview("");
    }
  }, [editing]);

  const filtered = rows.filter(
    (r) => !q || `${r.src} ${r.alt}`.toLowerCase().includes(q.toLowerCase()),
  );

  async function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 8 * 1024 * 1024) {
      toast.error("File too large - max 8MB");
      return;
    }
    setUploading(true);
    try {
      const url = await api.upload(f);
      setForm((prev) => ({ ...prev, src: url }));
      setPreview(url);
      toast.success("Image uploaded from device");
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.src) {
      setSrcInvalid(true);
      toast.error("Please upload an image from your device");
      return;
    }
    setSrcInvalid(false);
    if (!form.alt) {
      toast.error("Alt text required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        sort_order: Number(form.sort_order),
        is_active: Number(form.is_active),
      };
      if (editing) {
        await api.update("hero_slides", editing.id, payload);
        toast.success("Hero slide updated successfully");
      } else {
        await api.create("hero_slides", payload);
        toast.success("Hero slide created successfully");
      }
      setEditing(null);
      setForm({ src: "", alt: "", sort_order: 0, is_active: 1 });
      setPreview("");
      await load();
    } catch (err: any) {
      toast.error(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function del(id: number) {
    if (!confirm("Delete this slide?")) return;
    try {
      await api.remove("hero_slides", id);
      toast.success("Hero slide deleted");
      await load();
    } catch (err: any) {
      toast.error(err.message || "Delete failed");
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
            Hero Slider
          </h1>
          <p className="text-sm text-gray-500">
            3 slides on home hero - drag order via sort_order. Upload images directly from your
            device.
          </p>
        </div>
        <div className="flex gap-2">
          <input
            id="hero-search"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search alt or url"
            aria-label="Search hero slides"
            className="px-4 py-2.5 rounded-full border border-gray-200 bg-white text-sm w-56 focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 outline-none"
          />
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setForm({ src: "", alt: "", sort_order: 0, is_active: 1 });
              setPreview("");
              document.getElementById("hero-form")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="bg-[#0B2545] text-white text-sm font-bold px-5 py-2.5 rounded-full hover:bg-[#163663]"
          >
            + Add Slide
          </button>
        </div>
      </div>

      <div
        className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
        aria-busy={loading}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <caption className="sr-only">Hero slider slides</caption>
            <thead>
              <tr className="bg-[#0B2545] text-white text-left">
                <th scope="col" className="px-4 py-3">
                  Preview
                </th>
                <th scope="col" className="px-4 py-3">
                  Alt
                </th>
                <th scope="col" className="px-4 py-3">
                  Order
                </th>
                <th scope="col" className="px-4 py-3">
                  Active
                </th>
                <th scope="col" className="px-4 py-3 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-gray-500">
                    No slides
                  </td>
                </tr>
              )}
              {filtered.map((r, i) => (
                <tr key={r.id} className={`border-b ${i % 2 === 0 ? "bg-white" : "bg-[#F8F6F1]"}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={r.src}
                        alt={r.alt}
                        className="w-20 h-12 object-cover rounded-lg border border-gray-200"
                        onError={(e) => (e.currentTarget.style.display = "none")}
                      />
                      <span className="text-xs text-gray-500 truncate max-w-[220px]">
                        {r.src.slice(0, 60)}
                        {r.src.length > 60 ? "..." : ""}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-700 max-w-[200px] truncate">{r.alt}</td>
                  <td className="px-4 py-3">{r.sort_order}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-full ${
                        r.is_active
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {r.is_active ? "yes" : "no"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      type="button"
                      aria-label={`Edit hero slide ${r.alt || r.id}`}
                      onClick={() => setEditing(r)}
                      className="text-xs font-bold bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full hover:bg-amber-200 mr-1"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      aria-label={`Delete hero slide ${r.alt || r.id}`}
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
            {filtered.length} of {rows.length} slides
          </span>
          <span>Images stored in MySQL + uploads folder or local fallback</span>
        </div>
      </div>

      <form
        id="hero-form"
        aria-labelledby="hero-form-heading"
        onSubmit={submit}
        className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 id="hero-form-heading" className="font-bold text-[#0B2545]">
            {editing ? "Edit" : "Add"} - Hero Slide
          </h2>
          {editing && (
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setForm({ src: "", alt: "", sort_order: 0, is_active: 1 });
                setPreview("");
              }}
              className="text-xs font-bold bg-gray-100 px-3 py-1.5 rounded-full"
            >
              Cancel
            </button>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label
              htmlFor="hero-image-file"
              className="text-xs font-bold uppercase tracking-widest text-gray-600"
            >
              Image - upload from device *
            </label>
            <div className="mt-1 flex flex-col sm:flex-row gap-3 items-start">
              <div className="flex-1 w-full">
                <input
                  ref={fileRef}
                  id="hero-image-file"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    setSrcInvalid(false);
                    onPickFile(e);
                  }}
                  aria-invalid={srcInvalid || undefined}
                  aria-describedby={srcInvalid ? "hero-image-error" : undefined}
                  className="w-full text-sm file:mr-3 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:bg-[#0B2545] file:text-white file:font-bold hover:file:bg-[#163663] border border-gray-200 rounded-xl px-3 py-1.5 bg-white"
                />
                <div className="text-xs text-gray-500 mt-1">
                  Choose JPG, PNG, WEBP up to 8MB from your computer. Works offline via local
                  preview.
                </div>
                {srcInvalid && (
                  <p id="hero-image-error" className="text-xs font-semibold text-red-600 mt-1">
                    Please upload an image from your device
                  </p>
                )}
                {uploading && (
                  <div className="text-xs font-bold text-[#0D9488] mt-1" role="status">
                    Uploading...
                  </div>
                )}
                {form.src && !form.src.startsWith("data:") && (
                  <div className="text-xs text-gray-500 truncate mt-1">Saved: {form.src}</div>
                )}
              </div>
              <div className="w-full sm:w-48 h-28 rounded-xl border border-gray-200 bg-[#F8F6F1] overflow-hidden grid place-items-center shrink-0">
                {preview ? (
                  <img src={preview} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs text-gray-400">No preview</span>
                )}
              </div>
            </div>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="hero-src"
              className="text-xs font-bold uppercase tracking-widest text-gray-600"
            >
              Image URL (auto-filled after upload)
            </label>
            <input
              id="hero-src"
              value={form.src}
              aria-describedby="hero-src-hint"
              onChange={(e) => {
                setForm({ ...form, src: e.target.value });
                setPreview(e.target.value);
              }}
              placeholder="Will be filled after device upload or paste https://..."
              className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 outline-none"
            />
            <div id="hero-src-hint" className="text-xs text-gray-400 mt-1">
              You can also paste a URL manually, but device upload is preferred.
            </div>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="hero-alt"
              className="text-xs font-bold uppercase tracking-widest text-gray-600"
            >
              Alt text *
            </label>
            <input
              id="hero-alt"
              value={form.alt}
              onChange={(e) => setForm({ ...form, alt: e.target.value })}
              required
              placeholder="Milne Bay students and community learning"
              className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 outline-none text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="hero-sort-order"
              className="text-xs font-bold uppercase tracking-widest text-gray-600"
            >
              Sort order
            </label>
            <input
              id="hero-sort-order"
              type="number"
              value={form.sort_order}
              onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
              className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 outline-none text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="hero-is-active"
              className="text-xs font-bold uppercase tracking-widest text-gray-600"
            >
              Active (1 or 0)
            </label>
            <select
              id="hero-is-active"
              value={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: Number(e.target.value) })}
              className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 outline-none"
            >
              <option value={1}>1 - Active</option>
              <option value={0}>0 - Hidden</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving || uploading}
          aria-busy={saving || uploading}
          className="bg-[#0D9488] hover:bg-[#0b7a6e] text-white font-bold px-6 py-3 rounded-full text-sm disabled:opacity-60"
        >
          {saving ? "Saving..." : editing ? "Update Slide" : "Create Slide"}
        </button>
      </form>
    </div>
  );
}
