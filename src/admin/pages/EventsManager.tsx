"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/admin/components/Toast";

type Row = {
  id: number;
  month: string;
  day: string;
  title: string;
  event_time: string;
  cat: string;
  color: string;
};

function monthFromDate(v: string) {
  if (!v) return "";
  const d = new Date(v);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
}
function dayFromDate(v: string) {
  if (!v) return "";
  const d = new Date(v);
  if (isNaN(d.getTime())) return "";
  return String(d.getDate()).padStart(2, "0");
}
function toInputFromMonthDay(month: string, day: string) {
  if (!month || !day) return "";
  const m = month.slice(0, 3);
  const map: Record<string, string> = {
    JAN: "01",
    FEB: "02",
    MAR: "03",
    APR: "04",
    MAY: "05",
    JUN: "06",
    JUL: "07",
    AUG: "08",
    SEP: "09",
    OCT: "10",
    NOV: "11",
    DEC: "12",
  };
  const mm = map[m.toUpperCase()] || "01";
  const dd = String(day).padStart(2, "0");
  const yyyy = new Date().getFullYear();
  return `${yyyy}-${mm}-${dd}`;
}

export default function EventsManager() {
  const toast = useToast();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Row | null>(null);
  const [form, setForm] = useState({
    month: "OCT",
    day: "07",
    title: "",
    event_time: "",
    cat: "Examinations",
    color: "bg-[#0B2545]",
  });

  async function load() {
    setLoading(true);
    try {
      const d = await api.list("events");
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
        month: editing.month,
        day: editing.day,
        title: editing.title,
        event_time: editing.event_time,
        cat: editing.cat,
        color: editing.color,
      });
    else
      setForm({
        month: "OCT",
        day: "07",
        title: "",
        event_time: "",
        cat: "Examinations",
        color: "bg-[#0B2545]",
      });
  }, [editing]);

  const filtered = rows.filter(
    (r) => !q || `${r.title} ${r.cat}`.toLowerCase().includes(q.toLowerCase()),
  );

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title) {
      toast.error("Title required");
      return;
    }
    const payload = { ...form };
    try {
      if (editing) {
        await api.update("events", editing.id, payload);
        toast.success("Event updated successfully");
      } else {
        await api.create("events", payload);
        toast.success("Event created successfully");
      }
      setEditing(null);
      setForm({
        month: "OCT",
        day: "07",
        title: "",
        event_time: "",
        cat: "Examinations",
        color: "bg-[#0B2545]",
      });
      await load();
    } catch (err: any) {
      toast.error(err.message || "Save failed");
    }
  }
  async function del(id: number) {
    if (!confirm("Delete?")) return;
    try {
      await api.remove("events", id);
      toast.success("Event deleted");
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
            Upcoming Events
          </h1>
          <p className="text-sm text-gray-500">Calendar section - use date picker for month/day.</p>
        </div>
        <div className="flex gap-2">
          <input
            id="event-search"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search..."
            aria-label="Search events"
            className="px-4 py-2.5 rounded-full border border-gray-200 bg-white text-sm w-56"
          />
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setForm({
                month: "OCT",
                day: "07",
                title: "",
                event_time: "",
                cat: "Examinations",
                color: "bg-[#0B2545]",
              });
              document.getElementById("event-form")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="bg-[#0B2545] text-white text-sm font-bold px-5 py-2.5 rounded-full"
          >
            + Add Event
          </button>
        </div>
      </div>

      <div
        className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
        aria-busy={loading}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <caption className="sr-only">Upcoming events</caption>
            <thead>
              <tr className="bg-[#0B2545] text-white text-left">
                <th scope="col" className="px-4 py-3">
                  Date
                </th>
                <th scope="col" className="px-4 py-3">
                  Title
                </th>
                <th scope="col" className="px-4 py-3">
                  Time
                </th>
                <th scope="col" className="px-4 py-3">
                  Cat
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
                    No events
                  </td>
                </tr>
              )}
              {filtered.map((r, i) => (
                <tr key={r.id} className={`border-b ${i % 2 === 0 ? "bg-white" : "bg-[#F8F6F1]"}`}>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {r.month} {r.day}
                  </td>
                  <td className="px-4 py-3 max-w-[260px] truncate">{r.title}</td>
                  <td className="px-4 py-3">{r.event_time}</td>
                  <td className="px-4 py-3">{r.cat}</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      type="button"
                      aria-label={`Edit event ${r.title}`}
                      onClick={() => setEditing(r)}
                      className="text-xs font-bold bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full mr-1"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      aria-label={`Delete event ${r.title}`}
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
        id="event-form"
        aria-labelledby="event-form-heading"
        onSubmit={submit}
        className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 id="event-form-heading" className="font-bold text-[#0B2545]">
            {editing ? "Edit" : "Add"} - Event
          </h2>
          {editing && (
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setForm({
                  month: "OCT",
                  day: "07",
                  title: "",
                  event_time: "",
                  cat: "Examinations",
                  color: "bg-[#0B2545]",
                });
              }}
              className="text-xs font-bold bg-gray-100 px-3 py-1.5 rounded-full"
            >
              Cancel
            </button>
          )}
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="sm:col-span-3">
            <label
              htmlFor="event-pick-date"
              className="text-xs font-bold uppercase tracking-widest text-gray-600"
            >
              Pick date (sets month/day)
            </label>
            <input
              id="event-pick-date"
              type="date"
              value={toInputFromMonthDay(form.month, form.day)}
              aria-describedby="event-pick-date-hint"
              onChange={(e) =>
                setForm({
                  ...form,
                  month: monthFromDate(e.target.value),
                  day: dayFromDate(e.target.value),
                })
              }
              className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 outline-none text-sm"
            />
            <div id="event-pick-date-hint" className="text-xs text-gray-500 mt-1">
              Selected: {form.month} {form.day}
            </div>
          </div>

          <div>
            <label
              htmlFor="event-month"
              className="text-xs font-bold uppercase tracking-widest text-gray-600"
            >
              Month
            </label>
            <select
              id="event-month"
              value={form.month}
              onChange={(e) => setForm({ ...form, month: e.target.value })}
              className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm"
            >
              {[
                "JAN",
                "FEB",
                "MAR",
                "APR",
                "MAY",
                "JUN",
                "JUL",
                "AUG",
                "SEP",
                "OCT",
                "NOV",
                "DEC",
              ].map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="event-day"
              className="text-xs font-bold uppercase tracking-widest text-gray-600"
            >
              Day
            </label>
            <input
              id="event-day"
              value={form.day}
              onChange={(e) => setForm({ ...form, day: e.target.value })}
              placeholder="07"
              className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="event-category"
              className="text-xs font-bold uppercase tracking-widest text-gray-600"
            >
              Category
            </label>
            <select
              id="event-category"
              value={form.cat}
              onChange={(e) => setForm({ ...form, cat: e.target.value })}
              className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm"
            >
              {["Examinations", "Governance", "Co-Curricular", "Results", "Sports", "Other"].map(
                (c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ),
              )}
            </select>
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="event-title"
              className="text-xs font-bold uppercase tracking-widest text-gray-600"
            >
              Title *
            </label>
            <input
              id="event-title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              placeholder="Event title"
              className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 text-sm"
            />
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="event-time"
              className="text-xs font-bold uppercase tracking-widest text-gray-600"
            >
              Time / Venue *
            </label>
            <input
              id="event-time"
              value={form.event_time}
              onChange={(e) => setForm({ ...form, event_time: e.target.value })}
              required
              placeholder="8:00 AM - All Centres"
              className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="event-color"
              className="text-xs font-bold uppercase tracking-widest text-gray-600"
            >
              Badge color
            </label>
            <input
              id="event-color"
              value={form.color}
              onChange={(e) => setForm({ ...form, color: e.target.value })}
              placeholder="bg-[#0B2545]"
              className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 text-sm"
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
