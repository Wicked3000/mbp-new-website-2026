import { Link, useLocation } from "react-router-dom";
import { useState, useMemo } from "react";
import { MAIN_NAV, SEARCH_SUGGESTIONS } from "@/components/siteNav";

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const location = useLocation();

  const searchSuggestions = useMemo(() => {
    if (!query) return [];
    return SEARCH_SUGGESTIONS.filter((s) =>
      s.label.toLowerCase().includes(query.toLowerCase()),
    ).slice(0, 5);
  }, [query]);

  return (
    <>
      <div className="bg-[#07192E] text-white text-[13px] py-2 px-4 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex gap-5 items-center">
            <span className="flex items-center gap-1.5 opacity-90">
              <span className="opacity-60" aria-hidden="true">
                📞
              </span>{" "}
              +675 641 1234
            </span>
            <span className="hidden sm:flex items-center gap-1.5 opacity-90">
              <span className="opacity-60" aria-hidden="true">
                ✉️
              </span>{" "}
              info@mbpeducation.gov.pg
            </span>
          </div>
          <div className="flex gap-4 items-center opacity-80 text-xs">
            <span className="hidden md:inline">Mon – Fri: 8:00am – 4:30pm</span>
            <span className="hidden sm:block opacity-30" aria-hidden="true">
              |
            </span>
            <a href="#" className="hover:text-[#C9A84C] transition-colors font-medium">
              NDoE Portal
            </a>
            <a href="#" className="hover:text-[#C9A84C] transition-colors font-medium">
              TSC Online
            </a>
          </div>
        </div>
      </div>

      <header className="bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b border-gray-100 sticky top-0 z-50 shadow-[0_2px_20px_rgba(11,37,69,0.06)]">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/assets/logo/mbp-logo-bg-removed.png"
              alt="Milne Bay Province Division of Education"
              className="w-12 h-12 shrink-0 object-contain group-hover:scale-105 transition-transform duration-300"
            />
            <div className="leading-tight">
              <div
                className="text-[#0B2545] font-bold text-[16px] tracking-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Milne Bay Province
              </div>
              <div className="text-[#0D9488] text-[11px] font-bold uppercase tracking-[0.14em]">
                Division of Education
              </div>
            </div>
          </Link>

          <nav aria-label="Primary" className="hidden lg:flex items-center gap-1">
            {MAIN_NAV.map((link) => {
              const active =
                location.pathname === link.href ||
                (link.href !== "/" && location.pathname.startsWith(link.href));
              return (
                <Link
                  key={link.label}
                  to={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`px-3.5 py-2 text-[13.5px] font-semibold rounded-full transition-all ${
                    active
                      ? "text-white bg-[#0B2545] shadow-sm"
                      : "text-gray-600 hover:text-[#0B2545] hover:bg-gray-50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
              aria-expanded={searchOpen}
              aria-controls="site-search-panel"
              className={`hidden sm:inline-flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-full border transition-colors shadow-sm ${
                searchOpen
                  ? "bg-[#0B2545] text-white border-[#0B2545]"
                  : "bg-white text-[#0B2545] border-gray-200 hover:bg-gray-50 hover:border-gray-300"
              }`}
            >
              <span className="text-[14px]" aria-hidden="true">
                ⌕
              </span>{" "}
              Search
            </button>
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
              aria-expanded={searchOpen}
              aria-controls="site-search-panel"
              className="sm:hidden w-10 h-10 rounded-full bg-white border border-gray-200 text-[#0B2545] grid place-items-center hover:bg-gray-50 transition-colors"
            >
              <span aria-hidden="true">⌕</span>
            </button>
            <Link
              to="/contact"
              className="hidden sm:inline-flex items-center gap-2 bg-[#0D9488] text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-[#0b7a6e] transition-colors shadow-sm"
            >
              Get Help
            </Link>
            <button
              className="lg:hidden p-2.5 rounded-xl text-gray-600 hover:text-[#0B2545] hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              aria-controls="site-mobile-menu"
            >
              <span className="text-lg leading-none" aria-hidden="true">
                {menuOpen ? "✕" : "☰"}
              </span>
            </button>
          </div>
        </div>

        {searchOpen && (
          <div
            id="site-search-panel"
            className="border-t border-gray-100 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
          >
            <div className="max-w-3xl mx-auto px-4 py-4">
              <div className="flex rounded-2xl overflow-hidden bg-gray-50 border border-gray-200 p-1.5 gap-1.5 focus-within:bg-white focus-within:border-[#0D9488] focus-within:ring-2 focus-within:ring-[#0D9488]/20 transition-all">
                <div className="flex-1 relative flex items-center">
                  <span className="absolute left-3.5 text-gray-400" aria-hidden="true">
                    ⌕
                  </span>
                  <input
                    type="search"
                    aria-label="Search the site"
                    placeholder="Search term dates, schools, forms…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    autoFocus
                    className="w-full pl-9 pr-4 py-2.5 text-sm text-gray-800 bg-transparent outline-none placeholder:text-gray-400"
                  />
                </div>
                <Link
                  to={query ? "/selections" : "#news"}
                  onClick={() => setSearchOpen(false)}
                  className="bg-[#0B2545] hover:bg-[#0D9488] text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors shrink-0 shadow-sm inline-flex items-center justify-center"
                >
                  Search
                </Link>
                <button
                  onClick={() => setSearchOpen(false)}
                  aria-label="Close search"
                  className="w-10 h-10 rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-[#0B2545] grid place-items-center shrink-0"
                >
                  <span aria-hidden="true">✕</span>
                </button>
              </div>
              <p className="sr-only" role="status">
                {searchSuggestions.length > 0
                  ? `${searchSuggestions.length} search suggestion${searchSuggestions.length === 1 ? "" : "s"} available.`
                  : ""}
              </p>
              {searchSuggestions.length > 0 && (
                <nav
                  aria-label="Search suggestions"
                  className="mt-3 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
                >
                  {searchSuggestions.map((s) => (
                    <Link
                      key={s.label}
                      to={s.to}
                      onClick={() => {
                        setQuery("");
                        setSearchOpen(false);
                      }}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 border-b last:border-b-0 border-gray-50"
                    >
                      <span className="text-gray-400" aria-hidden="true">
                        ⌕
                      </span>{" "}
                      {s.label}
                    </Link>
                  ))}
                </nav>
              )}
            </div>
          </div>
        )}

        {menuOpen && (
          <nav
            id="site-mobile-menu"
            aria-label="Primary"
            className="lg:hidden border-t border-gray-100 bg-white px-4 py-3"
          >
            <div className="grid gap-1">
              {MAIN_NAV.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  aria-current={location.pathname === link.href ? "page" : undefined}
                  className={`block py-2.5 px-3 text-sm font-medium rounded-lg border ${
                    location.pathname === link.href
                      ? "bg-[#0B2545] text-white border-[#0B2545]"
                      : "text-gray-700 border-transparent hover:bg-gray-50 hover:text-[#0D9488]"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setSearchOpen(true);
                }}
                className="mt-2 w-full text-center bg-white border border-gray-200 text-[#0B2545] font-semibold py-2.5 rounded-full hover:bg-gray-50 flex items-center justify-center gap-2"
              >
                <span aria-hidden="true">⌕</span> Search
              </button>
            </div>
          </nav>
        )}
      </header>
    </>
  );
}
