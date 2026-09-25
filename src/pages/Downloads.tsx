import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { useEntity } from "@/hooks/useDynamic";

function usableFilePath(value: unknown) {
  const path = typeof value === "string" ? value.trim() : "";
  if (!path || path === "#") return "";
  if (/^(https?:\/\/|data:|blob:)/i.test(path)) return path;
  if (/^(\/|\.\/|\.\.\/)/.test(path)) return path;
  if (/^[^/\\?#:\s][^:#\s]*(?:[?#].*)?$/.test(path)) return path;
  return "";
}

function FileTypeIcon({ type }: { type?: string }) {
  const normalizedType = String(type || "").toLowerCase();
  const isPdf = normalizedType === "pdf" || normalizedType.includes("pdf");
  const isExcel = normalizedType.includes("excel") || normalizedType.includes("xls");
  const isWord = normalizedType.includes("doc") || normalizedType.includes("word");
  const label = isPdf ? "PDF" : isExcel ? "XLS" : isWord ? "DOC" : "FILE";
  const color = isPdf ? "text-red-600 bg-red-50" : isExcel ? "text-emerald-700 bg-emerald-50" : isWord ? "text-blue-700 bg-blue-50" : "text-[#0D9488] bg-teal-50";

  return (
    <div className={`w-12 h-14 rounded-xl grid place-items-center ${color}`} aria-label={`${label} file`}>
      <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
        <path d="M14 2v6h6M8 13h8M8 17h5" />
      </svg>
      <span className="sr-only">{label}</span>
    </div>
  );
}

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

function Header({
  menuOpen,
  setMenuOpen,
}: {
  menuOpen: boolean;
  setMenuOpen: (value: boolean) => void;
}) {
  return (
    <>
      <div className="bg-[#0B2545] text-white text-sm py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <span className="opacity-80">+675 641 1234</span>
          <span className="opacity-80">Mon – Fri: 8:00am – 4:30pm</span>
        </div>
      </div>
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/assets/logo/mbp-logo-bg-removed.png"
              alt="Milne Bay Province Division of Education"
              className="w-12 h-12 object-contain"
            />
            <div className="leading-tight">
              <div
                className="text-[#0B2545] font-bold text-base"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Milne Bay Province
              </div>
              <div className="text-[#0D9488] text-xs font-semibold uppercase tracking-widest">
                Division of Education
              </div>
            </div>
          </Link>
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="px-3 py-2 text-sm font-medium rounded text-gray-700 hover:text-[#0D9488] hover:bg-gray-50"
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/downloads"
              className="px-3 py-2 text-sm font-bold rounded text-white bg-[#0B2545]"
            >
              Downloads
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              to="/contact"
              className="hidden sm:inline-flex bg-[#0D9488] text-white text-sm font-semibold px-4 py-2 rounded hover:bg-[#0b7a6e]"
            >
              Get Help
            </Link>
            <button
              className="lg:hidden p-2 text-gray-600"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white px-4 py-3">
            {[...NAV_LINKS, { label: "Downloads", href: "/downloads" }].map((link) => (
              <Link
                key={link.label}
                to={link.href}
                onClick={() => setMenuOpen(false)}
                className="block py-2 text-sm font-medium text-gray-700 border-b border-gray-50"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </header>
    </>
  );
}

function PageHero() {
  return (
    <section className="relative overflow-hidden bg-[#0B2545]">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-20">
        <span className="text-[#C9A84C] text-xs font-bold uppercase tracking-widest">
          Official Resources
        </span>
        <h1
          className="text-4xl sm:text-5xl font-bold text-white mt-3"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Forms & Downloads
        </h1>
        <p className="text-blue-100 text-lg leading-relaxed max-w-2xl mt-4">
          Access official Division handbooks, forms, policies, and other public resources.
        </p>
      </div>
    </section>
  );
}

function DownloadsSection() {
  const { data, loading } = useEntity("downloads", []);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const categories = useMemo(
    () => [
      "All",
      ...Array.from(new Set((data as any[]).map((item) => item.category).filter(Boolean))),
    ],
    [data],
  );
  const downloads = (data as any[]).filter((item) => {
    const matchesCategory = category === "All" || item.category === category;
    const text =
      `${item.name || ""} ${item.category || ""} ${item.description || ""}`.toLowerCase();
    return matchesCategory && (!query || text.includes(query.toLowerCase()));
  });

  return (
    <section className="py-14 sm:py-16 px-4 bg-[#F8F6F1]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-8">
          <div>
            <span className="text-[#0D9488] text-xs font-bold uppercase tracking-widest">
              Document Library
            </span>
            <h2
              className="text-3xl sm:text-4xl font-bold text-[#0B2545] mt-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Available Downloads
            </h2>
            <p className="text-gray-500 mt-3">Select an available file to download or view it.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search downloads..."
              className="rounded-full border border-gray-200 bg-white px-5 py-3 text-sm outline-none focus:border-[#0D9488]"
            />
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="rounded-full border border-gray-200 bg-white px-5 py-3 text-sm outline-none focus:border-[#0D9488]"
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading && <div className="text-center py-12 text-gray-500">Loading downloads...</div>}
        {!loading && downloads.length === 0 && (
          <div className="text-center py-14 bg-white rounded-2xl border border-gray-100 text-gray-500">
            No downloads are currently available.
          </div>
        )}
        <div className="grid md:grid-cols-2 gap-6">
          {downloads.map((item) => {
            const filePath = usableFilePath(item.file_path);
            return (
              <article
                key={item.id ?? item.name}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-lg transition-shadow flex flex-col"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="inline-flex bg-teal-50 text-[#0D9488] text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
                      {item.category || "General"}
                    </span>
                    <h3
                      className="text-xl font-bold text-[#0B2545] mt-3"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {item.name || "Untitled document"}
                    </h3>
                  </div>
                  <FileTypeIcon type={item.type} />
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mt-3 flex-1">
                  {item.description || "No description has been provided for this document."}
                </p>
                {item.type && (
                  <div className="text-xs font-semibold text-gray-500 mt-4">
                    {item.type}
                    {item.size_text ? ` • ${item.size_text}` : ""}
                  </div>
                )}
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-3">
                  <FileTypeIcon type={item.type} />
                  <div>
                    <div className="text-sm font-bold text-[#0B2545]">{item.type || "Document"}</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {filePath ? "Ready to download or view" : "File not available"}
                    </div>
                  </div>
                </div>
                {filePath ? (
                  <a
                    href={filePath}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex items-center justify-center gap-2 bg-[#0D9488] text-white font-bold px-5 py-3 rounded-full text-sm hover:bg-[#0b7a6e] transition-colors"
                  >
                    Download / View →
                  </a>
                ) : (
                  <div className="mt-5 text-center text-sm font-semibold text-gray-400 bg-gray-50 border border-gray-100 rounded-full px-5 py-3">
                    File not available
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#07192E] text-white py-8 px-4 text-sm text-gray-400">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 text-center">
        <span>© 2026 Milne Bay Province Division of Education</span>
        <div className="flex gap-4">
          <Link to="/" className="hover:text-white">
            Home
          </Link>
          <Link to="/contact" className="hover:text-white">
            Contact
          </Link>
          <Link to="/accessibility" className="hover:text-white">
            Accessibility
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default function DownloadsPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif" }}>
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <PageHero />
      <DownloadsSection />
      <Footer />
    </div>
  );
}
