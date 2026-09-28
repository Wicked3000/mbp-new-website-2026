import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/admin/components/Toast";
import Crud from "@/admin/components/Crud";

const QUICK_ICONS = [
  {
    value: "calendar",
    label: "Calendar",
    svg: (cls: string) => (
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M16 2v4M8 2v4M3 9h18" />
      </svg>
    ),
  },
  {
    value: "school",
    label: "School",
    svg: (cls: string) => (
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path d="M12 3L3 8l9 4 9-4-9-5Z" />
        <path d="M7 11v6l5 2 5-2v-6" />
      </svg>
    ),
  },
  {
    value: "file",
    label: "File",
    svg: (cls: string) => (
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" />
        <path d="M14 2v6h6" />
      </svg>
    ),
  },
  {
    value: "phone",
    label: "Phone",
    svg: (cls: string) => (
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4 8.81a2 2 0 0 1 2-2.18h3a2 2 0 0 1 2 1.72c.15 1.13.48 2.22.97 3.23a2 2 0 0 1-.57 2.11l-1.4 1.4a16 16 0 0 0 6 6l1.4-1.4a2 2 0 0 1 2.11-.57c1.01.49 2.1.82 3.23.97a2 2 0 0 1 1.72 2Z" />
      </svg>
    ),
  },
  {
    value: "mail",
    label: "Mail",
    svg: (cls: string) => (
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 7l9 6 9-6" />
      </svg>
    ),
  },
  {
    value: "clock",
    label: "Clock",
    svg: (cls: string) => (
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
  },
  {
    value: "search",
    label: "Search",
    svg: (cls: string) => (
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-3.5-3.5" />
      </svg>
    ),
  },
  {
    value: "link",
    label: "Link",
    svg: (cls: string) => (
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path d="M10 13a5 5 0 0 1 7 0l1 1a5 5 0 0 1 0 7 5 5 0 0 1-7 0l-1-1" />
        <path d="M14 11a5 5 0 0 0-7 0l-1 1a5 5 0 0 0 0 7 5 5 0 0 0 7 0l1-1" />
      </svg>
    ),
  },
];

function QuickIconPreview({ name }: { name: string }) {
  const f = QUICK_ICONS.find((x) => x.value === name);
  return f ? f.svg("w-4 h-4") : <span className="w-4 h-4 rounded bg-gray-100" />;
}

export function QuickLinksManager() {
  const toast = useToast();
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({
    icon: "calendar",
    label: "",
    description: "",
    href: "",
    sort_order: 0,
  });

  async function load() {
    setLoading(true);
    try {
      const d = await api.list("quick_links");
      setRows(d as any[]);
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
        icon: editing.icon,
        label: editing.label,
        description: editing.description || editing.desc || "",
        href: editing.href,
        sort_order: editing.sort_order || 0,
      });
    else
      setForm({
        icon: "calendar",
        label: "",
        description: "",
        href: "",
        sort_order: 0,
      });
  }, [editing]);

  const filtered = rows.filter(
    (r) => !q || `${r.label} ${r.description}`.toLowerCase().includes(q.toLowerCase()),
  );

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.label || !form.icon) {
      toast.error("Icon and label required");
      return;
    }
    const payload = { ...form, sort_order: Number(form.sort_order) };
    try {
      if (editing) {
        await api.update("quick_links", editing.id, payload);
        toast.success("Quick link updated");
      } else {
        await api.create("quick_links", payload);
        toast.success("Quick link created");
      }
      setEditing(null);
      setForm({
        icon: "calendar",
        label: "",
        description: "",
        href: "",
        sort_order: 0,
      });
      await load();
    } catch (err: any) {
      toast.error(err.message || "Save failed");
    }
  }
  async function del(id: any) {
    if (!confirm("Delete?")) return;
    try {
      await api.remove("quick_links", id);
      toast.success("Quick link deleted");
      await load();
    } catch (err: any) {
      toast.error(err.message);
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
            Quick Links
          </h1>
          <p className="text-sm text-gray-500">
            Strip below hero - admin selects SVG icon type only
          </p>
        </div>
        <div className="flex gap-2">
          <input
            id="quick-link-search"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search..."
            aria-label="Search quick links"
            className="px-4 py-2.5 rounded-full border border-gray-200 bg-white text-sm w-56"
          />
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setForm({
                icon: "calendar",
                label: "",
                description: "",
                href: "",
                sort_order: 0,
              });
              document.getElementById("ql-form")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="bg-[#0B2545] text-white text-sm font-bold px-5 py-2.5 rounded-full"
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
            <caption className="sr-only">Quick links</caption>
            <thead>
              <tr className="bg-[#0B2545] text-white text-left">
                <th scope="col" className="px-4 py-3">
                  Icon
                </th>
                <th scope="col" className="px-4 py-3">
                  Label
                </th>
                <th scope="col" className="px-4 py-3">
                  Description
                </th>
                <th scope="col" className="px-4 py-3">
                  Href
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
                    No links
                  </td>
                </tr>
              )}
              {filtered.map((r, i) => (
                <tr key={r.id} className={`border-b ${i % 2 === 0 ? "bg-white" : "bg-[#F8F6F1]"}`}>
                  <td className="px-4 py-3">
                    <span
                      aria-hidden="true"
                      className="w-8 h-8 rounded-lg bg-[#0B2545] text-white grid place-items-center"
                    >
                      <QuickIconPreview name={r.icon} />
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-[#0B2545]">
                    {r.label} <span className="text-xs text-gray-400">({r.icon})</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 max-w-[220px] truncate">
                    {r.description || r.desc}
                  </td>
                  <td className="px-4 py-3 text-gray-500 truncate max-w-[160px]">{r.href}</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      type="button"
                      aria-label={`Edit quick link ${r.label}`}
                      onClick={() => setEditing(r)}
                      className="text-xs font-bold bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full mr-1"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      aria-label={`Delete quick link ${r.label}`}
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
        id="ql-form"
        aria-labelledby="ql-form-heading"
        onSubmit={submit}
        className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 id="ql-form-heading" className="font-bold text-[#0B2545]">
            {editing ? "Edit" : "Add"} - Quick Link
          </h2>
          {editing && (
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setForm({
                  icon: "calendar",
                  label: "",
                  description: "",
                  href: "",
                  sort_order: 0,
                });
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
              htmlFor="ql-icon"
              className="text-xs font-bold uppercase tracking-widest text-gray-600"
            >
              Icon - SVG only *
            </label>
            <select
              id="ql-icon"
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              aria-describedby="ql-icon-hint"
              className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 outline-none"
            >
              {QUICK_ICONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label} ({o.value})
                </option>
              ))}
            </select>
            <div id="ql-icon-hint" className="mt-2 flex items-center gap-2 text-xs text-gray-500">
              <span
                aria-hidden="true"
                className="w-8 h-8 rounded-lg bg-[#0B2545] text-white grid place-items-center"
              >
                <QuickIconPreview name={form.icon} />
              </span>
              Preview: {form.icon} - SVG only, no emojis
            </div>
          </div>
          <div>
            <label
              htmlFor="ql-label"
              className="text-xs font-bold uppercase tracking-widest text-gray-600"
            >
              Label *
            </label>
            <input
              id="ql-label"
              value={form.label}
              onChange={(e) => setForm({ ...form, label: e.target.value })}
              required
              placeholder="Term Dates"
              className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="ql-description"
              className="text-xs font-bold uppercase tracking-widest text-gray-600"
            >
              Description *
            </label>
            <input
              id="ql-description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
              placeholder="2026 Academic Calendar"
              className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="ql-href"
              className="text-xs font-bold uppercase tracking-widest text-gray-600"
            >
              Href *
            </label>
            <input
              id="ql-href"
              value={form.href}
              onChange={(e) => setForm({ ...form, href: e.target.value })}
              required
              placeholder="/#news or /basic#schools"
              className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 text-sm"
            />
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="ql-sort-order"
              className="text-xs font-bold uppercase tracking-widest text-gray-600"
            >
              Sort order
            </label>
            <input
              id="ql-sort-order"
              type="number"
              value={form.sort_order}
              onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
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
export function PartnersManager() {
  return (
    <Crud
      entity="partners"
      title="Partners"
      subtitle="Upload and manage trusted partner logos"
      fields={[
        { key: "name", label: "Name", required: true },
        { key: "logo", label: "Partner logo", type: "image", required: true },
        { key: "sort_order", label: "Order", type: "number" },
      ]}
      columns={[
        {
          key: "logo",
          label: "Logo",
          render: (value) =>
            value ? (
              <img loading="lazy" decoding="async" src={value} alt="Partner logo" className="h-9 w-16 object-contain" />
            ) : (
              <span className="text-xs text-gray-400">No logo</span>
            ),
        },
        { key: "name", label: "Name" },
        { key: "sort_order", label: "Order" },
      ]}
    />
  );
}
export function DownloadsManager() {
  return (
    <Crud
      entity="downloads"
      title="Downloads"
      subtitle="Documents & Downloads sections"
      fields={[
        { key: "name", label: "Name", required: true },
        {
          key: "type",
          label: "Type",
          type: "select",
          options: ["PDF", "DOCX", "Excel"],
        },
        { key: "size_text", label: "Size text", placeholder: "2.4 MB" },
        { key: "category", label: "Category", placeholder: "Policy" },
        { key: "description", label: "Description", type: "textarea" },
        { key: "file_path", label: "File", type: "file", required: true },
      ]}
      columns={[
        { key: "name", label: "Name" },
        { key: "type", label: "Type" },
        { key: "category", label: "Cat" },
        { key: "size_text", label: "Size" },
      ]}
    />
  );
}
