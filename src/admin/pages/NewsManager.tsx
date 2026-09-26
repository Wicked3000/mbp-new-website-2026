import { useEffect, useState, useRef } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/admin/components/Toast";

type NewsRow = {
  id: number;
  tag: string;
  tag_color: string;
  news_date: string;
  title: string;
  excerpt: string;
  img: string;
  is_published: number;
  is_previous: number;
};

function toInputDate(v: string) {
  if (!v) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
  const d = new Date(v);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}
function toDisplayDate(v: string) {
  if (!v) return "";
  const d = new Date(v);
  if (isNaN(d.getTime())) return v;
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function NewsManager() {
  const toast = useToast();
  const [rows, setRows] = useState<NewsRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<NewsRow | null>(null);
  const [form, setForm] = useState({
    tag: "Announcement",
    tag_color: "bg-[#0D9488]",
    news_date: "",
    title: "",
    excerpt: "",
    img: "",
    is_published: 1,
    is_previous: 0,
  });
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imgInvalid, setImgInvalid] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    try {
      const d = await api.list("news");
      setRows(d as NewsRow[]);
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
        tag: editing.tag,
        tag_color: editing.tag_color,
        news_date: editing.news_date,
        title: editing.title,
        excerpt: editing.excerpt,
        img: editing.img,
        is_published: editing.is_published,
        is_previous: (editing as any).is_previous ?? 0,
      });
      setPreview(editing.img);
    } else {
      setForm({
        tag: "Announcement",
        tag_color: "bg-[#0D9488]",
        news_date: "",
        title: "",
        excerpt: "",
        img: "",
        is_published: 1,
        is_previous: 0,
      });
      setPreview("");
    }
  }, [editing]);

  const filtered = rows.filter(
    (r) => !q || `${r.title} ${r.tag} ${r.news_date}`.toLowerCase().includes(q.toLowerCase()),
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
      setForm((prev) => ({ ...prev, img: url }));
      setPreview(url);
      if (editing) {
        setRows((prev) => prev.map((r) => (r.id === editing.id ? { ...r, img: url } : r)));
        try {
          await api.update("news", editing.id, {
            tag: form.tag,
            tag_color: form.tag_color,
            news_date: form.news_date,
            title: form.title,
            excerpt: form.excerpt,
            img: url,
            is_published: Number(form.is_published),
            is_previous: Number((form as any).is_previous || 0),
          });
          toast.success("Image uploaded and table refreshed");
          await load();
        } catch (err: any) {
          toast.error(err.message || "Auto-save failed - click Update to save");
        }
      } else {
        toast.success("Image uploaded from device - click Create to save");
      }
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.news_date || !form.excerpt) {
      toast.error("Title, date and excerpt required");
      return;
    }
    if (!form.img) {
      setImgInvalid(true);
      toast.error("Please upload an image from your device");
      return;
    }
    setImgInvalid(false);
    setSaving(true);
    try {
      const payload = {
        ...form,
        is_published: Number(form.is_published),
        is_previous: Number((form as any).is_previous || 0),
      };
      if (editing) {
        await api.update("news", editing.id, payload);
        toast.success(
          editing && (form as any).is_previous
            ? "News moved to Previous"
            : "News updated successfully",
        );
      } else {
        await api.create("news", payload);
        toast.success(
          (form as any).is_previous ? "News created in Previous" : "News created successfully",
        );
      }
      setEditing(null);
      setForm({
        tag: "Announcement",
        tag_color: "bg-[#0D9488]",
        news_date: "",
        title: "",
        excerpt: "",
        img: "",
        is_published: 1,
        is_previous: 0,
      });
      setPreview("");
      await load();
    } catch (err: any) {
      toast.error(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function togglePrevious(row: NewsRow) {
    const next = (row as any).is_previous ? 0 : 1;
    try {
      await api.update("news", row.id, { is_previous: next });
      toast.success(next ? "Moved to Previous News" : "Moved to Latest News");
      await load();
    } catch (err: any) {
      toast.error(err.message || "Move failed");
    }
  }

  async function del(id: number) {
    if (!confirm("Delete this news?")) return;
    try {
      await api.remove("news", id);
      toast.success("News deleted");
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
            News & Announcements
          </h1>
          <p className="text-sm text-gray-500">
            Cards shown in NewsSection on home - upload images from your device.
          </p>
        </div>
        <div className="flex gap-2">
          <input
            id="news-search"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search title or tag"
            aria-label="Search news articles"
            className="px-4 py-2.5 rounded-full border border-gray-200 bg-white text-sm w-56 focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 outline-none"
          />
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setForm({
                tag: "Announcement",
                tag_color: "bg-[#0D9488]",
                news_date: "",
                title: "",
                excerpt: "",
                img: "",
                is_published: 1,
                is_previous: 0,
              });
              setPreview("");
              document.getElementById("news-form")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="bg-[#0B2545] text-white text-sm font-bold px-5 py-2.5 rounded-full hover:bg-[#163663]"
          >
            + Add News
          </button>
        </div>
      </div>

      <div
        className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
        aria-busy={loading}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <caption className="sr-only">News and announcements</caption>
            <thead>
              <tr className="bg-[#0B2545] text-white text-left">
                <th scope="col" className="px-4 py-3">
                  Image
                </th>
                <th scope="col" className="px-4 py-3">
                  Tag
                </th>
                <th scope="col" className="px-4 py-3">
                  Title
                </th>
                <th scope="col" className="px-4 py-3">
                  Date
                </th>
                <th scope="col" className="px-4 py-3">
                  Section
                </th>
                <th scope="col" className="px-4 py-3">
                  Pub
                </th>
                <th scope="col" className="px-4 py-3 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-gray-500">
                    No news
                  </td>
                </tr>
              )}
              {filtered.map((r, i) => (
                <tr key={r.id} className={`border-b ${i % 2 === 0 ? "bg-white" : "bg-[#F8F6F1]"}`}>
                  <td className="px-4 py-3">
                    <img
                      src={r.img}
                      alt={r.title}
                      className="w-16 h-10 object-cover rounded-lg border border-gray-200"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded-full">
                      {r.tag}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700 max-w-[220px] truncate">{r.title}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{r.news_date}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-full ${
                        (r as any).is_previous
                          ? "bg-amber-100 text-amber-700"
                          : "bg-teal-50 text-teal-700"
                      }`}
                    >
                      {(r as any).is_previous ? "Previous" : "Latest"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-full ${
                        r.is_published
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {r.is_published ? "yes" : "no"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      type="button"
                      aria-label={`Move news item ${r.title} to ${(r as any).is_previous ? "Latest News" : "Previous News"}`}
                      onClick={() => togglePrevious(r)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-full mr-1 ${
                        (r as any).is_previous
                          ? "bg-teal-100 text-teal-700 hover:bg-teal-200"
                          : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                      }`}
                    >
                      {(r as any).is_previous ? "To Latest" : "To Previous"}
                    </button>
                    <button
                      type="button"
                      aria-label={`Edit news item ${r.title}`}
                      onClick={() => setEditing(r)}
                      className="text-xs font-bold bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full hover:bg-amber-200 mr-1"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      aria-label={`Delete news item ${r.title}`}
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
            {filtered.length} of {rows.length} articles
          </span>
          <span>Images via device upload - stored in MySQL or uploads folder</span>
        </div>
      </div>

      <form
        id="news-form"
        aria-labelledby="news-form-heading"
        onSubmit={submit}
        className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 id="news-form-heading" className="font-bold text-[#0B2545]">
            {editing ? "Edit" : "Add"} - News
          </h2>
          {editing && (
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setForm({
                  tag: "Announcement",
                  tag_color: "bg-[#0D9488]",
                  news_date: "",
                  title: "",
                  excerpt: "",
                  img: "",
                  is_published: 1,
                  is_previous: 0,
                });
                setPreview("");
              }}
              className="text-xs font-bold bg-gray-100 px-3 py-1.5 rounded-full"
            >
              Cancel
            </button>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="news-tag"
              className="text-xs font-bold uppercase tracking-widest text-gray-600"
            >
              Tag *
            </label>
            <select
              id="news-tag"
              value={form.tag}
              onChange={(e) => setForm({ ...form, tag: e.target.value })}
              className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 outline-none"
            >
              <option>Announcement</option>
              <option>Programs</option>
              <option>Notice</option>
              <option>News</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="news-tag-color"
              className="text-xs font-bold uppercase tracking-widest text-gray-600"
            >
              Tag color class
            </label>
            <input
              id="news-tag-color"
              value={form.tag_color}
              onChange={(e) => setForm({ ...form, tag_color: e.target.value })}
              placeholder="bg-[#0D9488]"
              className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 outline-none text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="news-date"
              className="text-xs font-bold uppercase tracking-widest text-gray-600"
            >
              Date *
            </label>
            <input
              id="news-date"
              type="date"
              value={toInputDate(form.news_date)}
              onChange={(e) => setForm({ ...form, news_date: toDisplayDate(e.target.value) })}
              aria-describedby="news-date-hint"
              required
              className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 outline-none text-sm"
            />
            <div id="news-date-hint" className="text-xs text-gray-500 mt-1">
              Pick from calendar - saved as "{form.news_date || "..."}".
            </div>
          </div>
          <div>
            <label
              htmlFor="news-published"
              className="text-xs font-bold uppercase tracking-widest text-gray-600"
            >
              Published
            </label>
            <select
              id="news-published"
              value={form.is_published}
              onChange={(e) => setForm({ ...form, is_published: Number(e.target.value) })}
              className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 outline-none"
            >
              <option value={1}>1 - Published</option>
              <option value={0}>0 - Draft</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="news-section"
              className="text-xs font-bold uppercase tracking-widest text-gray-600"
            >
              Section
            </label>
            <select
              id="news-section"
              value={(form as any).is_previous}
              onChange={(e) => setForm({ ...form, is_previous: Number(e.target.value) } as any)}
              aria-describedby="news-section-hint"
              className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 outline-none"
            >
              <option value={0}>Latest News</option>
              <option value={1}>Previous News</option>
            </select>
            <div id="news-section-hint" className="text-xs text-gray-500 mt-1">
              Move old news to Previous
            </div>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="news-title"
              className="text-xs font-bold uppercase tracking-widest text-gray-600"
            >
              Title *
            </label>
            <input
              id="news-title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              placeholder="News title"
              className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 outline-none text-sm"
            />
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="news-excerpt"
              className="text-xs font-bold uppercase tracking-widest text-gray-600"
            >
              Excerpt *
            </label>
            <textarea
              id="news-excerpt"
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              required
              rows={3}
              placeholder="Short summary"
              className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 outline-none text-sm"
            />
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="news-image"
              className="text-xs font-bold uppercase tracking-widest text-gray-600"
            >
              Image - upload from device *
            </label>
            <div className="mt-1 flex flex-col sm:flex-row gap-3 items-start">
              <div className="flex-1 w-full">
                <input
                  ref={fileRef}
                  id="news-image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    setImgInvalid(false);
                    onPickFile(e);
                  }}
                  aria-invalid={imgInvalid || undefined}
                  aria-describedby={
                    imgInvalid ? "news-image-hint news-image-error" : "news-image-hint"
                  }
                  className="w-full text-sm file:mr-3 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:bg-[#0B2545] file:text-white file:font-bold hover:file:bg-[#163663] border border-gray-200 rounded-xl px-3 py-1.5 bg-white"
                />
                <div id="news-image-hint" className="text-xs text-gray-500 mt-1">
                  Choose JPG, PNG, WEBP up to 8MB from your computer.
                </div>
                {imgInvalid && (
                  <p id="news-image-error" className="text-xs font-semibold text-red-600 mt-1">
                    Please upload an image from your device
                  </p>
                )}
                {uploading && (
                  <div className="text-xs font-bold text-[#0D9488] mt-1" role="status">
                    Uploading...
                  </div>
                )}
                {form.img && !form.img.startsWith("data:") && (
                  <div className="text-xs text-gray-500 truncate mt-1">
                    Saved: {form.img.slice(0, 70)}
                    {form.img.length > 70 ? "..." : ""}
                  </div>
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
        </div>

        <button
          type="submit"
          disabled={saving || uploading}
          aria-busy={saving || uploading}
          className="bg-[#0D9488] hover:bg-[#0b7a6e] text-white font-bold px-6 py-3 rounded-full text-sm disabled:opacity-60"
        >
          {saving ? "Saving..." : editing ? "Update News" : "Create News"}
        </button>
      </form>
    </div>
  );
}
