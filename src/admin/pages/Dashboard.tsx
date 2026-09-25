import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api
      .dashboard()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);
  if (loading) return <div className="text-sm text-gray-500">Loading…</div>;
  const cards = [
    {
      label: "News",
      value: data?.news,
      to: "/admin/news",
      color: "bg-[#0B2545]",
    },
    {
      label: "Notices",
      value: data?.notices,
      to: "/admin/notices",
      color: "bg-[#163663]",
    },
    {
      label: "Events",
      value: data?.events,
      to: "/admin/events",
      color: "bg-[#0D9488]",
    },
    {
      label: "New Messages",
      value: data?.messages_new,
      to: "/admin/messages",
      color: "bg-amber-500 text-[#0B2545]",
    },
    {
      label: "Total Messages",
      value: data?.messages_total,
      to: "/admin/messages",
      color: "bg-[#0B2545]",
    },
    {
      label: "Districts",
      value: data?.districts,
      to: "/admin/districts",
      color: "bg-teal-600",
    },
  ];
  return (
    <div className="space-y-6">
      <div>
        <h1
          className="text-2xl font-bold text-[#0B2545]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Overview
        </h1>
        <p className="text-sm text-gray-500">
          Dynamic sections managed via MySQL - edit and publish instantly.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            to={c.to}
            className={`${
              c.color.includes("text-") ? c.color : c.color + " text-white"
            } rounded-2xl p-5 flex items-center justify-between hover:shadow-lg transition-shadow`}
          >
            <div>
              <div
                className="text-3xl font-bold leading-none"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {c.value ?? "-"}
              </div>
              <div className="text-xs font-bold uppercase tracking-widest opacity-80 mt-1">
                {c.label}
              </div>
            </div>
            <span className="w-10 h-10 rounded-full bg-white/20 grid place-items-center">→</span>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="font-bold text-[#0B2545] mb-3">Quick Actions</div>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              {
                to: "/admin/news",
                label: "Add News",
                desc: "Publish announcement",
              },
              {
                to: "/admin/notices",
                label: "Add Notice",
                desc: "Notice board item",
              },
              {
                to: "/admin/events",
                label: "Add Event",
                desc: "Calendar entry",
              },
              {
                to: "/admin/hero",
                label: "Update Slider",
                desc: "Hero images",
              },
            ].map((a) => (
              <Link
                key={a.label}
                to={a.to}
                className="rounded-xl border border-gray-100 bg-[#F8F6F1] p-4 hover:bg-white hover:border-[#0D9488]/30 hover:shadow transition-all"
              >
                <div className="font-bold text-[#0B2545] text-sm">{a.label}</div>
                <div className="text-xs text-gray-500">{a.desc}</div>
                <div className="text-xs font-bold text-[#0D9488] mt-2">Manage →</div>
              </Link>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="font-bold text-[#0B2545]">Recent Messages</div>
            <Link to="/admin/messages" className="text-xs font-bold text-[#0D9488]">
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {(data?.recent_messages || []).length === 0 && (
              <div className="text-sm text-gray-500 py-6 text-center bg-[#F8F6F1] rounded-xl">
                No messages yet
              </div>
            )}
            {(data?.recent_messages || []).map((m: any) => (
              <div
                key={m.id}
                className="flex gap-3 p-3 rounded-xl bg-[#F8F6F1] border border-gray-100"
              >
                <div className="w-8 h-8 rounded-full bg-[#0B2545] text-white grid place-items-center text-xs font-bold shrink-0">
                  {m.full_name?.[0] || "?"}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold text-[#0B2545] truncate">
                    {m.subject || m.full_name}
                  </div>
                  <div className="text-xs text-gray-600 truncate">{m.message}</div>
                  <div className="text-[11px] text-gray-400">
                    {m.email} • {new Date(m.created_at).toLocaleDateString()}
                  </div>
                </div>
                <span
                  className={`shrink-0 text-[11px] font-bold px-2 py-1 rounded-full h-fit ${
                    m.status === "new" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {m.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
        <div className="font-bold text-[#0B2545]">XAMPP Setup Checklist</div>
        <ol className="list-decimal ml-5 mt-2 text-sm text-gray-700 space-y-1">
          <li>Start Apache + MySQL in XAMPP Control Panel</li>
          <li>
            Import{" "}
            <code className="bg-white px-1 py-0.5 rounded border">
              backend/database/mbp_education.sql
            </code>{" "}
            in phpMyAdmin (http://localhost/phpmyadmin)
          </li>
          <li>
            Copy <code className="bg-white px-1 py-0.5 rounded border">backend/api</code> →{" "}
            <code className="bg-white px-1 py-0.5 rounded border">C:\xampp\htdocs\mbp-api</code>
          </li>
          <li>
            Set{" "}
            <code className="bg-white px-1 py-0.5 rounded border">
              VITE_API_BASE=http://localhost/mbp-api
            </code>{" "}
            in .env (already default)
          </li>
          <li>
            Test{" "}
            <code className="bg-white px-1 py-0.5 rounded border">
              http://localhost/mbp-api/health.php
            </code>
          </li>
        </ol>
      </div>
    </div>
  );
}
