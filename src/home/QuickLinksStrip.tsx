import { Link } from "react-router-dom";
import { useEntity } from "@/hooks/useDynamic";
import { QUICK_LINKS } from "./fallbackData";

function QuickLinkIcon({ name }: { name: string }) {
  const n = (name || "").toLowerCase();
  const common = "w-5 h-5";
  if (n === "calendar")
    return (
      <svg
        className={common}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M16 2v4M8 2v4M3 9h18" />
      </svg>
    );
  if (n === "school")
    return (
      <svg
        className={common}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path d="M12 3L3 8l9 4 9-4-9-5Z" />
        <path d="M7 11v6l5 2 5-2v-6" />
        <path d="M7 14l5 2 5-2" />
      </svg>
    );
  if (n === "file")
    return (
      <svg
        className={common}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" />
        <path d="M14 2v6h6" />
        <path d="M9 13h6M9 17h6" />
      </svg>
    );
  if (n === "phone")
    return (
      <svg
        className={common}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4 8.81a2 2 0 0 1 2-2.18h3a2 2 0 0 1 2 1.72c.15 1.13.48 2.22.97 3.23a2 2 0 0 1-.57 2.11l-1.4 1.4a16 16 0 0 0 6 6l1.4-1.4a2 2 0 0 1 2.11-.57c1.01.49 2.1.82 3.23.97a2 2 0 0 1 1.72 2Z" />
      </svg>
    );
  if (n === "mail")
    return (
      <svg
        className={common}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 7l9 6 9-6" />
      </svg>
    );
  if (n === "clock")
    return (
      <svg
        className={common}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    );
  if (n === "search")
    return (
      <svg
        className={common}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-3.5-3.5" />
      </svg>
    );
  if (n === "link")
    return (
      <svg
        className={common}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path d="M10 13a5 5 0 0 1 7 0l1 1a5 5 0 0 1 0 7 5 5 0 0 1-7 0l-1-1" />
        <path d="M14 11a5 5 0 0 0-7 0l-1 1a5 5 0 0 0 0 7 5 5 0 0 0 7 0l1-1" />
      </svg>
    );
  return (
    <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  );
}
export function QuickLinksStrip() {
  const { data } = useEntity("quick_links", QUICK_LINKS as any);
  const links = data as any[];
  const linkHref = (ql: any) =>
    ql.icon === "file" || /download|form/i.test(ql.label || "") ? "/downloads" : ql.href || "/";
  return (
    <section className="bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-gray-100">
          {links.map((ql: any) => (
            <Link
              key={ql.label}
              to={linkHref(ql)}
              className="flex items-center gap-4 px-5 py-6 hover:bg-[#F8F6F1] transition-colors group"
            >
              <div className="w-11 h-11 rounded-xl bg-[#0B2545] group-hover:bg-[#0D9488] text-white flex items-center justify-center shrink-0 transition-colors shadow-sm">
                <QuickLinkIcon name={ql.icon} />
              </div>
              <div className="min-w-0">
                <div className="text-[#0B2545] font-bold text-sm leading-tight group-hover:text-[#0D9488] transition-colors">
                  {ql.label}
                </div>
                <div className="text-gray-500 text-xs truncate">{ql.desc ?? ql.description}</div>
              </div>
              <span className="ml-auto hidden sm:block text-gray-300 group-hover:text-[#0D9488] group-hover:translate-x-1 transition-all">
                →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
