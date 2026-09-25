import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/admin/components/Toast";

export default function MessagesManager() {
  const toast = useToast();
  const [rows, setRows] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const load = () =>
    api
      .list("contact_messages")
      .then(setRows)
      .catch(() => {});
  useEffect(() => {
    load();
  }, []);
  const filtered = rows.filter((r) => {
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (!q) return true;
    return (r.full_name + " " + r.email + " " + r.subject + " " + r.message)
      .toLowerCase()
      .includes(q.toLowerCase());
  });
  async function setStatus(id: any, status: string) {
    try {
      await api.update("contact_messages", id, { status });
      toast.success("Message status updated");
      load();
    } catch (err: any) {
      toast.error(err.message || "Update failed");
    }
  }
  async function del(id: any) {
    if (!confirm("Delete message?")) return;
    try {
      await api.remove("contact_messages", id);
      toast.success("Message deleted");
      load();
    } catch (err: any) {
      toast.error(err.message || "Delete failed");
    }
  }
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-end justify-between">
        <div>
          <h1
            className="text-2xl font-bold text-[#0B2545]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Contact Messages
          </h1>
          <p className="text-sm text-gray-500">
            From /contact form - POST goes to PHP contact.php or local fallback.
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 rounded-full border border-gray-200 bg-white text-sm"
          >
            <option value="all">All status</option>
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
            <option value="archived">Archived</option>
          </select>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search…"
            className="px-4 py-2.5 rounded-full border border-gray-200 bg-white text-sm w-56"
          />
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#0B2545] text-white text-left">
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">From</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-gray-500">
                    No messages
                  </td>
                </tr>
              )}
              {filtered.map((r) => (
                <tr key={r.id} className="border-b odd:bg-white even:bg-[#F8F6F1]">
                  <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">
                    {r.created_at ? new Date(r.created_at).toLocaleDateString() : "-"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-[#0B2545]">{r.full_name}</div>
                    <div className="text-xs text-gray-500">
                      {r.email}
                      {r.phone ? ` • ${r.phone}` : ""}
                    </div>
                    <div className="text-xs text-gray-400">{r.district}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-teal-50 text-teal-700 px-2 py-1 rounded-full font-semibold">
                      {r.category}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-[#0B2545] truncate max-w-[220px]">
                      {r.subject}
                    </div>
                    <div className="text-xs text-gray-600 line-clamp-2 max-w-[260px]">
                      {r.message}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-full ${
                        r.status === "new"
                          ? "bg-amber-100 text-amber-700"
                          : r.status === "replied"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <select
                      value={r.status}
                      onChange={(e) => setStatus(r.id, e.target.value)}
                      className="text-xs border border-gray-200 rounded-full px-2 py-1 bg-white mr-1"
                    >
                      <option value="new">new</option>
                      <option value="read">read</option>
                      <option value="replied">replied</option>
                      <option value="archived">archived</option>
                    </select>
                    <button
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
    </div>
  );
}
