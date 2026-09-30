"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/admin/components/Toast";

type Row = {
  id: number;
  notice_date: string;
  title: string;
  is_published: number;
};

function toInputDate(v: string) {
  if (!v) return "";
  // v is like "Sep 22" or "2026-09-22" or full date
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
  // try parse "Sep 22" -> assume current year
  const curYear = new Date().getFullYear();
  let d: Date | null = null;
  if (/^[A-Za-z]{3}\s+\d{1,2}$/.test(v.trim())) {
    d = new Date(`${v} ${curYear}`);
  } else {
    d = new Date(v);
  }
  if (!d || isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}
function toShortDisplay(v: string) {
  if (!v) return "";
  const d = new Date(v);
  if (isNaN(d.getTime())) return v;
  const m = d.toLocaleDateString("en-US", { month: "short" });
  const day = d.getDate();
  return `${m} ${String(day).padStart(2, "0")}`;
}

export default function NoticesManager() {
  const toast = useToast();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Row | null>(null);
  const [form, setForm] = useState({
    notice_date: "",
    title: "",
    is_published: 1,
  });

  async function load() {
    setLoading(true);
    try {
      const d = await api.list("notices");
      setRows(d as Row[]);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);
  useEffect(() => {
    if (editing)
      setForm({
        notice_date: editing.notice_date,
        title: editing.title,
        is_published: editing.is_published,
      });
    else setForm({ notice_date: "", title: "", is_published: 1 });
  }, [editing]);

  const filtered = rows.filter(
    (r) => !q || `${r.title} ${r.notice_date}`.toLowerCase().includes(q.toLowerCase()),
  );

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.notice_date || !form.title) {
      toast.error("Date and title required");
      return;
    }
    try {
      const payload = { ...form, is_published: Number(form.is_published) };
      if (editing) {
        await api.update("notices", editing.id, payload);
        toast.success("Notice updated successfully");
      } else {
        await api.create("notices", payload);
        toast.success("Notice created successfully");
      }
      setEditing(null);
      setForm({ notice_date: "", title: "", is_published: 1 });
      await load();
    } catch (err: any) {
      toast.error(err.message || "Save failed");
    }
  }
  async function del(id: number) {
    if (!confirm("Delete?")) return;
    try {
      await api.remove("notices", id);
      toast.success("Notice deleted");
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
            Notice Board
          </h1>
          <p className="text-sm text-gray-500">Right column notices on home - use date picker.</p>
        </div>
        <div className="flex gap-2">
          <input
            id="notice-search"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search..."
            aria-label="Search notices"
            className="px-4 py-2.5 rounded-full border border-gray-200 bg-white text-sm w-56"
          />
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setForm({ notice_date: "", title: "", is_published: 1 });
              document.getElementById("notice-form")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="bg-[#0B2545] text-white text-sm font-bold px-5 py-2.5 rounded-full"
          >
            + Add Notice
          </button>
        </div>
      </div>

      <div
        className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
        aria-busy={loading}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <caption className="sr-only">Notice board notices</caption>
            <thead>
              <tr className="bg-[#0B2545] text-white text-left">
                <th scope="col" className="px-4 py-3">
                  Date
                </th>
                <th scope="col" className="px-4 py-3">
                  Title
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
                  <td colSpan={4} className="px-4 py-10 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-gray-500">
                    No notices
                  </td>
                </tr>
              )}
              {filtered.map((r, i) => (
                <tr key={r.id} className={`border-b ${i % 2 === 0 ? "bg-white" : "bg-[#F8F6F1]"}`}>
                  <td className="px-4 py-3 whitespace-nowrap">{r.notice_date}</td>
                  <td className="px-4 py-3 max-w-[320px] truncate">{r.title}</td>
                  <td className="px-4 py-3">{r.is_published ? "yes" : "no"}</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      type="button"
                      aria-label={`Edit notice ${r.title}`}
                      onClick={() => setEditing(r)}
                      className="text-xs font-bold bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full mr-1"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      aria-label={`Delete notice ${r.title}`}
                      onClick={() => del(r.id)}
                      className="text-xs font-bold bg-red-50 text-red-600 px-3 py-1.5 rounded-full"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <form
        id="notice-form"
        aria-labelledby="notice-form-heading"
        onSubmit={submit}
        className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 id="notice-form-heading" className="font-bold text-[#0B2545]">
            {editing ? "Edit" : "Add"} - Notice
          </h2>
          {editing && (
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setForm({ notice_date: "", title: "", is_published: 1 });
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
              htmlFor="notice-date"
              className="text-xs font-bold uppercase tracking-widest text-gray-600"
            >
              Date *
            </label>
            <input
              id="notice-date"
              type="date"
              value={toInputDate(form.notice_date)}
              aria-describedby="notice-date-hint"
              onChange={(e) =>
                setForm({
                  ...form,
                  notice_date: toShortDisplay(e.target.value),
                })
              }
              required
              className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 outline-none text-sm"
            />
            <div id="notice-date-hint" className="text-xs text-gray-500 mt-1">
              Pick from calendar - saved as "{form.notice_date || "..."}"
            </div>
          </div>
          <div>
            <label
              htmlFor="notice-published"
              className="text-xs font-bold uppercase tracking-widest text-gray-600"
            >
              Published
            </label>
            <select
              id="notice-published"
              value={form.is_published}
              onChange={(e) => setForm({ ...form, is_published: Number(e.target.value) })}
              className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm"
            >
              <option value={1}>1 - Published</option>
              <option value={0}>0 - Draft</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="notice-title"
              className="text-xs font-bold uppercase tracking-widest text-gray-600"
            >
              Title *
            </label>
            <textarea
              id="notice-title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              rows={2}
              placeholder="Notice title"
              className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 outline-none text-sm"
            />
          </div>
        </div>
        <button
          type="submit"
          className="bg-[#0D9488] text-white font-bold px-6 py-3 rounded-full text-sm"
        >
          {editing ? "Update" : "Create"}
        </button>
      </form>
    </div>
  );
}
