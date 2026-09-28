import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import {
  DashboardIcon,
  ProgramsIcon,
  SchoolIcon,
  SelectionsIcon,
  MessagesIcon,
  WhatsAppIcon,
  DownloadsIcon,
  SettingsIcon,
} from "@/admin/components/icons";
import { ToastProvider } from "@/admin/components/Toast";

const NAV = [
  { label: "Dashboard", icon: DashboardIcon, to: "/admin" },
  // The home page's own sections - hero, quick links, stats, programs, news,
  // notices, events, leadership, districts, partners - are tabs on the Home Page
  // manager rather than entries here. Their routes still exist.
  { label: "Home Page", icon: SettingsIcon, to: "/admin/home" },
  { label: "Basic Education Page", icon: ProgramsIcon, to: "/admin/basic-education" },
  { label: "Post Primary Page", icon: ProgramsIcon, to: "/admin/post-primary" },
  { label: "VET Page", icon: ProgramsIcon, to: "/admin/vet" },
  { label: "FODE Page", icon: ProgramsIcon, to: "/admin/fode" },
  { label: "Schools", icon: SchoolIcon, to: "/admin/schools" },
  { label: "Selections", icon: SelectionsIcon, to: "/admin/selections" },
  { label: "Messages", icon: MessagesIcon, to: "/admin/messages" },
  { label: "WhatsApp Subscribers", icon: WhatsAppIcon, to: "/admin/whatsapp-subscribers" },
  { label: "Downloads", icon: DownloadsIcon, to: "/admin/downloads" },
  { label: "Settings", icon: SettingsIcon, to: "/admin/settings" },
] as const;

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  const nav = useNavigate();
  const user = api.user();
  const sidebarRef = useRef<HTMLElement>(null);
  const sidebarCloseRef = useRef<HTMLButtonElement>(null);
  const menuToggleRef = useRef<HTMLButtonElement>(null);

  const closeSidebar = useCallback((restoreFocus = false) => {
    setOpen(false);
    if (restoreFocus) menuToggleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    sidebarCloseRef.current?.focus();
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeSidebar(true);
        return;
      }
      if (event.key !== "Tab" || !sidebarRef.current) return;
      const focusable = sidebarRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;
      const inside = !!active && sidebarRef.current?.contains(active);
      if (event.shiftKey && (!inside || active === first)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && inside && active === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, closeSidebar]);

  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#F1F5F9] flex">
        {/* sidebar */}
        <aside
          ref={sidebarRef}
          id="admin-sidebar"
          aria-label="Admin navigation"
          {...(open ? ({ role: "dialog", "aria-modal": true } as const) : {})}
          className={`bg-[#07192E] text-white w-[260px] shrink-0 flex flex-col fixed lg:static inset-y-0 left-0 z-40 transition-transform ${
            open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="px-5 py-5 border-b border-white/10 flex items-center gap-3">
            <img loading="lazy" decoding="async"
              src="/assets/logo/mbp-logo-bg-removed.png"
              className="w-9 h-9 bg-white rounded-full p-1 object-contain"
              alt="MBP Education logo"
            />
            <div>
              <div className="font-bold text-sm leading-none">MBP Education</div>
              <div className="text-[#C9A84C] text-[11px] font-bold uppercase tracking-widest">
                Admin Panel
              </div>
            </div>
            <button
              ref={sidebarCloseRef}
              type="button"
              aria-label="Close navigation menu"
              onClick={() => closeSidebar(true)}
              className="lg:hidden ml-auto w-8 h-8 rounded-full bg-white/10 grid place-items-center"
            >
              ✕
            </button>
          </div>
          <div className="px-3 py-3 flex-1 overflow-auto">
            <div className="text-[11px] font-bold uppercase tracking-widest text-white/40 px-3 mb-2">
              Manage
            </div>
            <nav className="space-y-1">
              {NAV.map((n) => {
                const active =
                  loc.pathname === n.to || (n.to !== "/admin" && loc.pathname.startsWith(n.to));
                const Icon = n.icon as React.ComponentType<{
                  className?: string;
                }>;
                return (
                  <Link
                    key={n.to}
                    to={n.to}
                    aria-current={active ? "page" : undefined}
                    onClick={() => {
                      closeSidebar(false);
                      requestAnimationFrame(() => document.getElementById("main-content")?.focus());
                    }}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      active
                        ? "bg-[#0D9488] text-white shadow"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon className="w-5 h-5 shrink-0 opacity-90" />
                    {n.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="p-4 border-t border-white/10">
            <div className="bg-white/5 rounded-xl p-3 flex items-center gap-3">
              <div
                aria-hidden="true"
                className="w-9 h-9 rounded-full bg-[#C9A84C] text-[#07192E] grid place-items-center font-bold"
              >
                {user?.username?.[0]?.toUpperCase() || "A"}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold truncate">{user?.username || "admin"}</div>
                <div className="text-xs text-white/60 truncate">{user?.role || "super_admin"}</div>
              </div>
              <button
                type="button"
                onClick={() => {
                  api.logout();
                  nav("/admin/login");
                }}
                className="text-xs font-bold bg-white text-[#07192E] px-3 py-1.5 rounded-full hover:bg-[#C9A84C]"
              >
                Logout
              </button>
            </div>
            <Link
              to="/"
              className="mt-3 flex items-center justify-center gap-2 text-xs font-semibold text-white/70 hover:text-white"
            >
              ← Back to Site
            </Link>
          </div>
        </aside>

        {/* overlay */}
        {open && (
          <div
            aria-hidden="true"
            onClick={() => closeSidebar(true)}
            className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          />
        )}

        <div className="flex-1 min-w-0 flex flex-col">
          <header className="bg-white border-b border-gray-100 sticky top-0 z-20">
            <div className="px-4 sm:px-6 py-3 flex items-center gap-3">
              <button
                ref={menuToggleRef}
                type="button"
                aria-label="Open navigation menu"
                aria-expanded={open}
                aria-controls="admin-sidebar"
                onClick={() => setOpen(!open)}
                className="lg:hidden w-10 h-10 rounded-xl border border-gray-200 grid place-items-center"
              >
                ☰
              </button>
              <div className="hidden sm:block">
                <div
                  className="text-[#0B2545] font-bold leading-none"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Admin Dashboard
                </div>
                <div className="text-xs text-gray-500">Manage dynamic content - XAMPP / MySQL</div>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-full">
                  <span
                    aria-hidden="true"
                    className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"
                  />
                  DB: {(import.meta as any).env?.VITE_API_BASE || "http://localhost/mbp-api"}{" "}
                  <span className="opacity-50">(falls back to local)</span>
                </span>
                <Link
                  to="/"
                  className="hidden sm:inline-flex bg-[#0B2545] text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-[#163663]"
                >
                  View Site
                </Link>
              </div>
            </div>
          </header>
          <main id="main-content" tabIndex={-1} className="p-4 sm:p-6 flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
