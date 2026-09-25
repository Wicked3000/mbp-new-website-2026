import { Routes, Route, Link, useLocation, Navigate } from "react-router-dom";
import { useState, useMemo, useEffect, useCallback } from "react";
import whatsappCartoon from "../assets/whatsapp/whatsapp-cartoon-img.png";
import AboutPage from "./pages/About";
import BasicEducationPage from "./pages/BasicEducation";
import PostPrimaryPage from "./pages/PostPrimary";
import VETPage from "./pages/VET";
import FODEPage from "./pages/FODE";
import ContactPage from "./pages/Contact";
import SelectionsPage from "./pages/Selections";
import NewsPage from "./pages/News";
import NewsDetail from "./pages/NewsDetail";
import AccessibilityPage from "./pages/Accessibility";
import DownloadsPage from "./pages/Downloads";
import CalendarPage from "./pages/Calendar";
import { api } from "@/lib/api";
import { useEntity } from "@/hooks/useDynamic";
import AdminLayout from "@/admin/AdminLayout";
import Login from "@/admin/pages/Login";
import Dashboard from "@/admin/pages/Dashboard";
import HeroManager from "@/admin/pages/HeroManager";
import NewsManager from "@/admin/pages/NewsManager";
import NoticesManager from "@/admin/pages/NoticesManager";
import EventsManager from "@/admin/pages/EventsManager";
import ProgramsManager from "@/admin/pages/ProgramsManager";
import StatsManager from "@/admin/pages/StatsManager";
import DistrictsManager from "@/admin/pages/DistrictsManager";
import LeadershipManager from "@/admin/pages/LeadershipManager";
import SelectionsManager from "@/admin/pages/SelectionsManager";
import MessagesManager from "@/admin/pages/MessagesManager";
import WhatsAppSubscribersManager from "@/admin/pages/WhatsAppSubscribersManager";
import SettingsManager from "@/admin/pages/SettingsManager";
import { QuickLinksManager, PartnersManager, DownloadsManager } from "@/admin/pages/SimpleManagers";

function RequireAuth({ children }: { children: React.ReactNode }) {
  if (!api.isAuthed()) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Basic Education", href: "/basic" },
  { label: "Post Primary", href: "/post" },
  { label: "VET", href: "/vet" },
  { label: "FODE", href: "/fode" },
  { label: "Contact", href: "/contact" },
  { label: "Accessibility", href: "/accessibility" },
];

const QUICK_LINKS = [
  {
    icon: "calendar",
    label: "Term Dates",
    desc: "2026 Academic Calendar",
    href: "/calendar",
  },
  {
    icon: "school",
    label: "School Directory",
    desc: "Find schools in Milne Bay",
    href: "/basic#schools",
  },
  {
    icon: "file",
    label: "Forms & Downloads",
    desc: "Official documents",
    href: "/downloads",
  },
  {
    icon: "phone",
    label: "Emergency Contacts",
    desc: "Helpline & support",
    href: "/contact",
  },
];

const NEWS = [
  {
    tag: "Announcement",
    date: "September 18, 2026",
    title: "Grade 8 and Grade 10 Examination Timetable Released",
    excerpt:
      "The Division of Education has officially released the 2026 examination timetable for all Grade 8 and Grade 10 students across Milne Bay Province.",
    img: "https://images.unsplash.com/photo-1627423896085-e3e694d88e40?w=600&h=380&fit=crop&auto=format",
    color: "bg-[#0D9488]",
  },
  {
    tag: "Programs",
    date: "September 10, 2026",
    title: "New VET Training Centres to Open in Alotau and Samarai",
    excerpt:
      "Two new Vocational Education and Training centres are set to open in Term 4, expanding skills-based learning opportunities for youth across the province.",
    img: "https://images.unsplash.com/photo-1632215861513-130b66fe97f4?w=600&h=380&fit=crop&auto=format",
    color: "bg-[#C9A84C] text-[#0B2545]",
  },
  {
    tag: "Notice",
    date: "August 29, 2026",
    title: "School Subsidy Payment Schedule for Term 4 Now Available",
    excerpt:
      "Head teachers and school boards are advised to collect the Term 4 subsidy payment schedules from the Division office by 5 October 2026.",
    img: "https://images.unsplash.com/photo-1632932693914-89b90ae3d16d?w=600&h=380&fit=crop&auto=format",
    color: "bg-[#0B2545]",
  },
];

const PROGRAMS = [
  {
    code: "01",
    label: "Basic Education",
    level: "Elementary – Grade 8",
    desc: "Providing foundational literacy, numeracy and life skills for all children from Prep through to Grade 8 across Milne Bay.",
    color: "bg-[#0B2545]",
    accent: "bg-teal-500",
    href: "/basic",
    img: "/assets/education_programs/basic/banner.png",
  },
  {
    code: "02",
    label: "Post Primary",
    level: "Grade 9 – Grade 12",
    desc: "Secondary education pathways preparing students for tertiary admission, technical training, and employment in the formal sector.",
    color: "bg-[#163663]",
    accent: "bg-amber-400",
    href: "/post",
    img: "/assets/education_programs/post/banner.png",
  },
  {
    code: "03",
    label: "VET",
    level: "Vocational Education",
    desc: "Skills and trades training for out-of-school youth and adults, delivered through registered VET providers across the province.",
    color: "bg-[#0D9488]",
    accent: "bg-amber-300",
    href: "/vet",
    img: "/assets/education_programs/vet/banner.png",
  },
  {
    code: "04",
    label: "FODE",
    level: "Flexible Open & Distance",
    desc: "Distance and open learning enabling students in remote areas to access quality secondary education without leaving their communities.",
    color: "bg-[#0B2545]",
    accent: "bg-teal-400",
    href: "/fode",
    img: "/assets/education_programs/fode/banner.png",
  },
];

const STATS = [
  { value: "312", label: "Schools", sub: "Province-wide" },
  { value: "48,200+", label: "Students", sub: "Enrolled 2026" },
  { value: "2,140", label: "Teachers", sub: "Qualified staff" },
  { value: "17", label: "Districts", sub: "Covered" },
];

const NOTICES = [
  { date: "Sep 22", title: "PEB Meeting – October 2026 agenda published" },
  { date: "Sep 17", title: "Teacher Relief Grant applications close 30 Sep" },
  { date: "Sep 12", title: "Grade 12 trial exam results now available" },
  { date: "Sep 5", title: "School board compliance audit schedule released" },
  {
    date: "Aug 28",
    title: "Curriculum support materials distributed to all districts",
  },
  { date: "Aug 20", title: "Annual School Sports Carnival registration open" },
];

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const location = useLocation();
  const searchSuggestions = useMemo(() => {
    const all = [
      "Term Dates 2026",
      "School Directory",
      "Grade 8 Exam Timetable",
      "Teacher Relief Grants",
      "VET Centres Alotau",
      "FODE Enrolment",
      "Selection Lists 2026",
      "Contact Helpdesk",
    ];
    if (!query) return [];
    return all.filter((s) => s.toLowerCase().includes(query.toLowerCase())).slice(0, 5);
  }, [query]);

  return (
    <>
      <div className="bg-[#07192E] text-white text-[13px] py-2 px-4 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex gap-5 items-center">
            <span className="flex items-center gap-1.5 opacity-90">
              <span className="opacity-60">📞</span> +675 641 1234
            </span>
            <span className="hidden sm:flex items-center gap-1.5 opacity-90">
              <span className="opacity-60">✉️</span> info@mbpeducation.gov.pg
            </span>
          </div>
          <div className="flex gap-4 items-center opacity-80 text-xs">
            <span className="hidden md:inline">Mon – Fri: 8:00am – 4:30pm</span>
            <span className="hidden sm:block opacity-30">|</span>
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

          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const active =
                location.pathname === link.href ||
                (link.href !== "/" && location.pathname.startsWith(link.href));
              return (
                <Link
                  key={link.label}
                  to={link.href}
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
              className={`hidden sm:inline-flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-full border transition-colors shadow-sm ${
                searchOpen
                  ? "bg-[#0B2545] text-white border-[#0B2545]"
                  : "bg-white text-[#0B2545] border-gray-200 hover:bg-gray-50 hover:border-gray-300"
              }`}
            >
              <span className="text-[14px]">⌕</span> Search
            </button>
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
              className="sm:hidden w-10 h-10 rounded-full bg-white border border-gray-200 text-[#0B2545] grid place-items-center hover:bg-gray-50 transition-colors"
            >
              ⌕
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
            >
              <span className="text-lg leading-none">{menuOpen ? "✕" : "☰"}</span>
            </button>
          </div>
        </div>
        {searchOpen && (
          <div className="border-t border-gray-100 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
            <div className="max-w-3xl mx-auto px-4 py-4">
              <div className="flex rounded-2xl overflow-hidden bg-gray-50 border border-gray-200 p-1.5 gap-1.5 focus-within:bg-white focus-within:border-[#0D9488] focus-within:ring-2 focus-within:ring-[#0D9488]/20 transition-all">
                <div className="flex-1 relative flex items-center">
                  <span className="absolute left-3.5 text-gray-400">⌕</span>
                  <input
                    type="text"
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
                  ✕
                </button>
              </div>
              {searchSuggestions.length > 0 && (
                <div className="mt-3 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
                  {searchSuggestions.map((s) => (
                    <Link
                      key={s}
                      to="/selections"
                      onClick={() => {
                        setQuery("");
                        setSearchOpen(false);
                      }}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 border-b last:border-0 border-gray-50"
                    >
                      <span className="text-gray-400">⌕</span> {s}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        {menuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white px-4 py-3 animate-in">
            <div className="grid gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
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
                <span>⌕</span> Search
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

const HERO_FALLBACK = [
  {
    src: "/assets/slider/mbp-img1.png",
    alt: "Milne Bay students and community learning",
  },
  {
    src: "/assets/slider/mbp-img2.png",
    alt: "Milne Bay Province schools and education",
  },
  {
    src: "/assets/slider/mbp-img3.png",
    alt: "Milne Bay coastal education community",
  },
];

function HeroSection() {
  const { data: slides } = useEntity("hero_slides", HERO_FALLBACK);
  const list = (slides as any[]).filter((s: any) => s.is_active !== 0);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback(
    (dir: number) => {
      if (list.length < 2) return;
      setCurrent((p) => (p + dir + list.length) % list.length);
    },
    [list.length],
  );

  useEffect(() => {
    setCurrent((p) => (list.length ? p % list.length : 0));
  }, [list.length]);

  useEffect(() => {
    if (paused || list.length < 2) return;
    const id = setInterval(() => go(1), 4500);
    return () => clearInterval(id);
  }, [paused, go]);

  return (
    <section
      className="relative overflow-hidden bg-[#07192E]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="Hero slider"
    >
      {/* Slider images */}
      <div className="absolute inset-0">
        {list.map((slide: any, i: number) => (
          <img
            key={slide.src + i}
            src={slide.src}
            alt={slide.alt}
            className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-[1200ms] ease-in-out ${
              i === current ? "opacity-100" : "opacity-0"
            }`}
            loading={i === 0 ? "eager" : "lazy"}
            decoding="async"
          />
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#07192E]/60 via-[#0B2545]/40 to-[#0B2545]/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#07192E]/45 via-transparent to-transparent" />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Controls */}
      <button
        onClick={() => go(-1)}
        aria-label="Previous slide"
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white hover:bg-white hover:text-[#0B2545] transition-colors hidden sm:grid place-items-center"
      >
        ‹
      </button>
      <button
        onClick={() => go(1)}
        aria-label="Next slide"
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white hover:bg-white hover:text-[#0B2545] transition-colors hidden sm:grid place-items-center"
      >
        ›
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {list.map((_: any, i: number) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`transition-all rounded-full ${
              i === current ? "w-8 h-2.5 bg-[#C9A84C]" : "w-2.5 h-2.5 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-14 sm:py-16 lg:py-20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/15 text-[#E2C47A] text-[11px] font-bold uppercase tracking-[0.14em] px-3 py-1.5 rounded-full mb-5">
            <span className="w-2 h-2 rounded-full bg-[#C9A84C] animate-pulse inline-block" />
            Milne Bay Province • Papua New Guinea
          </div>
          <h1
            className="text-[40px] sm:text-[54px] lg:text-[62px] font-bold text-white leading-[0.95] tracking-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Quality Education
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#14B8A6] to-[#C9A84C]">
              for Every Child
            </span>
          </h1>
          <p className="text-blue-100/90 text-[17px] leading-relaxed mt-4 max-w-xl font-light">
            The Division of Education oversees and supports all levels of schooling from
            elementary through post-secondary across{" "}
            <span className="text-white font-semibold">17 districts & 312 schools.</span>
          </p>

          <div className="flex flex-wrap gap-3 mt-8">
            <Link
              to="/basic"
              className="inline-flex items-center gap-2 bg-[#C9A84C] text-[#0B2545] font-bold px-6 py-3 rounded-full hover:bg-[#d4b45e] transition-colors shadow-md"
            >
              Explore Programs →
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur text-white font-semibold px-6 py-3 rounded-full border border-white/20 hover:bg-white hover:text-[#0B2545] transition-colors"
            >
              Contact Division
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

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
function QuickLinksStrip() {
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

function NewsSection() {
  const { data: newsData } = useEntity("news", NEWS as any);
  const { data: noticeData } = useEntity("notices", NOTICES as any);
  const newsList = (newsData as any[]).filter((n: any) => n.is_published !== 0);
  const normNewsAll = newsList.map((n: any, idx: number) => ({
    id: n.id ?? idx + 1,
    tag: n.tag,
    date: n.news_date ?? n.date,
    title: n.title,
    excerpt: n.excerpt,
    img: n.img,
    color: n.tag_color ?? n.color,
    is_previous: (n as any).is_previous ?? 0,
  }));
  const normNews = normNewsAll.filter((n: any) => !n.is_previous);
  const noticeList = (noticeData as any[]).filter((n: any) => n.is_published !== 0);
  const normNotices = noticeList.map((n: any) => ({
    date: n.notice_date ?? n.date,
    title: n.title,
  }));
  return (
    <section className="bg-[#F8F6F1] py-14 sm:py-16 px-4" id="news">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <div className="flex items-end justify-between mb-8 gap-4">
              <div>
                <span className="inline-flex items-center gap-2 text-[#0D9488] text-[11px] font-bold uppercase tracking-[0.14em]">
                  <span className="w-6 h-[2px] bg-[#0D9488] inline-block" /> Latest Updates
                </span>
                <h2
                  className="text-[30px] sm:text-3xl font-bold text-[#0B2545] mt-2 tracking-tight"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  News & Announcements
                </h2>
              </div>
              <Link
                to="/news"
                className="hidden sm:inline-flex items-center gap-1.5 text-sm font-bold text-[#0B2545] hover:text-[#0D9488] transition-colors border border-gray-200 hover:border-[#0D9488]/30 bg-white px-4 py-2 rounded-full"
              >
                View All <span aria-hidden>→</span>
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {normNews[0] && (
                <Link
                  to={`/news/${normNews[0].id}`}
                  className="sm:col-span-2 bg-white rounded-[18px] overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col sm:flex-row"
                >
                  <div className="relative sm:w-[52%] h-56 sm:h-auto bg-[#0B2545] overflow-hidden shrink-0">
                    <img
                      src={normNews[0].img}
                      alt={normNews[0].title}
                      className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700"
                    />
                    <span
                      className={`${normNews[0].color} absolute top-3 left-3 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm`}
                    >
                      {normNews[0].tag}
                    </span>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <span className="text-gray-400 text-xs font-medium">
                      {normNews[0].date} • 2 min read
                    </span>
                    <h3
                      className="text-xl font-bold text-[#0B2545] mt-2 mb-2 leading-snug group-hover:text-[#0D9488] transition-colors"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {normNews[0].title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                      {normNews[0].excerpt}
                    </p>
                    <span className="inline-flex items-center gap-1.5 mt-4 text-sm font-bold text-[#C9A84C] group-hover:text-[#0B2545] transition-colors">
                      Read More{" "}
                      <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                    </span>
                  </div>
                </Link>
              )}

              {normNews.slice(1).map((n: any) => (
                <Link
                  key={n.title + n.id}
                  to={`/news/${n.id}`}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="relative h-40 bg-[#0B2545] overflow-hidden">
                    <img
                      src={n.img}
                      alt={n.title}
                      className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700"
                    />
                    <span
                      className={`absolute top-2.5 left-2.5 ${
                        n.color.includes("text") ? n.color : n.color + " text-white"
                      } text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm`}
                    >
                      {n.tag}
                    </span>
                  </div>
                  <div className="p-4">
                    <span className="text-gray-400 text-xs">{n.date}</span>
                    <h3
                      className="text-[15px] font-bold text-[#0B2545] mt-1 mb-1.5 leading-snug group-hover:text-[#0D9488] transition-colors line-clamp-2"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {n.title}
                    </h3>
                    <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">
                      {n.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="text-[#C9A84C] text-[11px] font-bold uppercase tracking-[0.14em]">
                  Updates
                </span>
                <h2
                  className="text-[30px] font-bold text-[#0B2545] tracking-tight"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Notice Board
                </h2>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {normNotices.map((n: any, i: number) => (
                <Link
                  key={n.title + i}
                  to="/selections"
                  className={`flex gap-4 px-5 py-4 hover:bg-[#F8F6F1] transition-colors group ${
                    i < normNotices.length - 1 ? "border-b border-gray-100" : ""
                  }`}
                >
                  <div className="shrink-0">
                    <div className="bg-[#0B2545] group-hover:bg-[#0D9488] text-white text-[11px] font-bold px-2.5 py-2 rounded-lg w-[58px] text-center leading-tight transition-colors">
                      {n.date}
                    </div>
                  </div>
                  <p className="text-[13.5px] text-gray-700 leading-snug group-hover:text-[#0B2545] transition-colors font-medium line-clamp-2">
                    {n.title}
                  </p>
                </Link>
              ))}
              <div className="px-5 py-3.5 bg-[#F8F6F1] border-t border-gray-100 flex items-center justify-between">
                <Link
                  to="/selections"
                  className="text-sm font-bold text-[#0D9488] hover:text-[#0B2545] transition-colors"
                >
                  View All Notices →
                </Link>
                <span className="text-xs text-gray-400">{normNotices.length} notices</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SelectionBanner() {
  return (
    <section className="px-4 py-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="rounded-[18px] bg-gradient-to-r from-[#0B2545] via-[#163663] to-[#0D9488] p-[1px]">
          <div className="rounded-[17px] bg-gradient-to-r from-[#0B2545] via-[#163663] to-[#0D9488] px-6 py-5 flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex w-12 h-12 rounded-xl bg-white text-[#0B2545] items-center justify-center text-xl shadow-sm">
                🎓
              </div>
              <div>
                <div
                  className="text-white font-bold leading-tight flex flex-wrap items-center gap-2"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  <span>2026 Grade 9 & 11 Selections are Live</span>
                  <span className="bg-[#C9A84C] text-[#0B2545] text-xs font-bold px-2 py-1 rounded-full">
                    NEW
                  </span>
                </div>
                <div className="text-blue-100 text-sm mt-1">
                  Search placements by school, district or student name: official provincial lists.
                </div>
              </div>
            </div>
            <div className="flex gap-3 shrink-0">
              <Link
                to="/selections"
                className="bg-white text-[#0B2545] font-bold px-5 py-2.5 rounded-full hover:bg-[#C9A84C] transition-colors shadow-sm text-sm"
              >
                View Selections →
              </Link>
              <Link
                to="/downloads"
                className="hidden sm:inline-flex items-center bg-white/10 border border-white/20 text-white font-semibold px-5 py-2.5 rounded-full hover:bg-white hover:text-[#0B2545] transition-colors text-sm"
              >
                Download PDF
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProgramsSection() {
  const { data } = useEntity("programs", PROGRAMS as any);
  const list = (data as any[]).map((p: any) => ({
    ...p,
    desc: p.description ?? p.desc,
  }));
  return (
    <section className="py-14 sm:py-16 px-4 bg-white" id="programs">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
          <div>
            <span className="inline-flex items-center gap-2 text-[#0D9488] text-[11px] font-bold uppercase tracking-[0.14em]">
              <span className="w-6 h-[2px] bg-[#0D9488] inline-block" /> What We Oversee
            </span>
            <h2
              className="text-[32px] sm:text-4xl font-bold text-[#0B2545] mt-2 tracking-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Education Programs
            </h2>
          </div>
          <p className="text-gray-500 max-w-xl text-[15px] leading-relaxed lg:text-right">
            From early childhood to vocational training, the Division coordinates quality learning
            across all levels in Milne Bay Province -{" "}
            <span className="text-[#0B2545] font-semibold">
              equitable, inclusive, community-driven.
            </span>
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {list.map((p: any) => (
            <Link
              key={p.code}
              to={p.href}
              className="rounded-[18px] overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col group"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={p.img}
                  alt={p.label}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span
                    className={`${p.accent} text-[#0B2545] text-[11px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-full inline-flex items-center shadow-md`}
                  >
                    {p.label}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 flex items-end gap-2">
                  <span
                    className="text-white text-[42px] font-bold leading-none tracking-tight drop-shadow-lg"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {p.code}
                  </span>
                  <span className="text-white/80 text-[11px] font-bold uppercase tracking-widest mb-1.5 drop-shadow">
                    {p.level.split("–")[0]?.trim() || p.level}
                  </span>
                </div>
                <span className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-white text-[#0B2545] grid place-items-center shadow-md group-hover:bg-[#C9A84C] transition-colors">
                  →
                </span>
              </div>
              <div
                className={`${p.color} p-5 flex-1 flex flex-col text-white relative overflow-hidden`}
              >
                <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/[0.06] group-hover:scale-125 transition-transform duration-700" />
                <div className="relative">
                  <div className="text-white/60 text-[11px] font-bold uppercase tracking-widest">
                    {p.level}
                  </div>
                  <p className="text-white/90 text-[13.5px] leading-relaxed mt-2 line-clamp-3">
                    {p.desc}
                  </p>
                  <div className="inline-flex items-center gap-1.5 mt-4 text-xs font-bold tracking-wide text-white group-hover:text-[#C9A84C] transition-colors">
                    Learn More{" "}
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  const { data } = useEntity("stats", STATS as any);
  const list = (data as any[]).map((s: any) => ({
    value: s.value_text ?? s.value,
    label: s.label,
    sub: s.sub,
  }));
  return (
    <section className="relative py-12 sm:py-14 px-4 overflow-hidden">
      <img
        src="/assets/background-img-stats/background-login.png"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-[#07192E]/75" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0B2545]/60 via-[#0B2545]/30 to-[#0D9488]/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
      <div className="max-w-7xl mx-auto relative">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-x-0 lg:divide-x divide-white/10">
          {list.map((s: any) => (
            <div key={s.label} className="py-2">
              <div
                className="text-[34px] sm:text-[42px] font-bold text-[#C9A84C] leading-none tracking-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {s.value}
              </div>
              <div className="text-white font-bold mt-2 tracking-wide">{s.label}</div>
              <div className="text-[#7fb3d1] text-xs font-semibold uppercase tracking-widest mt-1">
                {s.sub}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutMissionSection() {
  return (
    <section className="bg-[#F8F6F1] py-16 px-4" id="about">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 relative">
            <div className="rounded-[22px] overflow-hidden shadow-[0_20px_60px_rgba(11,37,69,0.12)] border border-white">
              <img
                src="https://images.unsplash.com/photo-1671883240914-22753874f0de?w=800&h=560&fit=crop&auto=format"
                alt="Milne Bay students"
                className="w-full h-[380px] object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-3 sm:right-4 bg-white rounded-2xl p-4 shadow-xl border border-gray-100 hidden sm:flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-xl bg-[#0D9488] text-white grid place-items-center text-2xl font-bold"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                25+
              </div>
              <div>
                <div className="text-[#0B2545] font-bold leading-tight">Years of service</div>
                <div className="text-gray-500 text-xs">Serving Milne Bay communities</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 lg:pl-6">
            <span className="inline-flex items-center gap-2 text-[#0D9488] text-[11px] font-bold uppercase tracking-[0.14em]">
              <span className="w-6 h-[2px] bg-[#0D9488] inline-block" /> Our Mission
            </span>
            <h2
              className="text-[32px] sm:text-4xl font-bold text-[#0B2545] mt-3 leading-[1.1] tracking-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Empowering Communities <span className="text-[#0D9488]">Through Education</span>
            </h2>
            <p className="text-gray-600 leading-relaxed mt-4 text-[15px]">
              The Milne Bay Province Division of Education is committed to delivering equitable,
              quality education to every child and young person from the islands of Samarai to the
              highlands of Alotau.
            </p>
            <p className="text-gray-600 leading-relaxed mt-3 text-[15px]">
              We work in partnership with teachers, parents, community leaders, and national
              agencies to build a generation of capable, informed, and resilient citizens of Papua
              New Guinea.
            </p>

            <div className="grid sm:grid-cols-2 gap-3 mt-6">
              {[
                "Inclusive & equitable access",
                "Qualified teachers in every school",
                "Community-led improvement",
                "Safe learning environments",
              ].map((t) => (
                <div
                  key={t}
                  className="flex items-center gap-2.5 bg-white border border-gray-100 rounded-xl px-3.5 py-3 shadow-sm"
                >
                  <span className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 grid place-items-center text-sm">
                    ✓
                  </span>
                  <span className="text-sm font-semibold text-[#0B2545]">{t}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 mt-8">
              <Link
                to="/about"
                className="bg-[#0B2545] text-white font-bold px-6 py-3 rounded-full hover:bg-[#163663] transition-colors shadow-sm text-sm inline-flex items-center gap-2"
              >
                Our Programs <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#07192E] text-white pt-14 pb-6 px-4" id="contact">
      <div className="max-w-7xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/assets/logo/mbp-logo-bg-removed.png"
                alt="Milne Bay Province Division of Education"
                className="w-10 h-10 shrink-0 object-contain bg-white rounded-full p-1"
              />
              <div>
                <div
                  className="font-bold text-sm tracking-tight"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Milne Bay Province
                </div>
                <div className="text-[#0D9488] text-xs font-bold uppercase tracking-widest">
                  Division of Education
                </div>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Committed to quality education for all children and young people across Milne Bay
              Province, Papua New Guinea.
            </p>
            <div className="mt-4 flex gap-2">
              <span className="w-8 h-8 rounded-full bg-white/5 border border-white/10 grid place-items-center text-xs hover:bg-white hover:text-[#07192E] transition-colors cursor-pointer">
                f
              </span>
              <span className="w-8 h-8 rounded-full bg-white/5 border border-white/10 grid place-items-center text-xs hover:bg-white hover:text-[#07192E] transition-colors cursor-pointer">
                𝕏
              </span>
              <span className="w-8 h-8 rounded-full bg-white/5 border border-white/10 grid place-items-center text-xs hover:bg-white hover:text-[#07192E] transition-colors cursor-pointer">
                ▶
              </span>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-xs uppercase tracking-[0.14em] text-[#C9A84C] mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-gray-400 text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/selections"
                  className="text-[#C9A84C] text-sm font-semibold hover:text-white transition-colors"
                >
                  Selections 2026 →
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-xs uppercase tracking-[0.14em] text-[#C9A84C] mb-4">
              Related Agencies
            </h4>
            <ul className="space-y-2.5">
              {[
                "National Dept. of Education",
                "Teaching Service Commission",
                "National Library of PNG",
                "Flexible Open Distance Ed.",
                "TVET Authority",
              ].map((l) => (
                <li key={l}>
                  <a href="#" className="text-gray-400 text-sm hover:text-white transition-colors">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-xs uppercase tracking-[0.14em] text-[#C9A84C] mb-4">
              Contact Us
            </h4>
            <div className="space-y-3 text-sm text-gray-400">
              <div>
                <div className="text-white font-semibold mb-0.5 text-xs uppercase tracking-widest">
                  Office Address
                </div>
                Division of Education, Alotau, Milne Bay Province, PNG
              </div>
              <div>
                <div className="text-white font-semibold mb-0.5 text-xs uppercase tracking-widest">
                  Phone
                </div>
                <a href="tel:+6756411234" className="hover:text-white">
                  +675 641 1234
                </a>
              </div>
              <div>
                <div className="text-white font-semibold mb-0.5 text-xs uppercase tracking-widest">
                  Email
                </div>
                <a href="mailto:info@mbpeducation.gov.pg" className="hover:text-white">
                  info@mbpeducation.gov.pg
                </a>
              </div>
              <div>
                <div className="text-white font-semibold mb-0.5 text-xs uppercase tracking-widest">
                  Office Hours
                </div>
                Mon – Fri: 8:00am – 4:30pm
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm">
          <span className="text-gray-500 text-xs">
            © 2026 Milne Bay Province Division of Education. All rights reserved.
          </span>
          <div className="flex gap-5 text-xs">
            <a href="#" className="text-gray-500 hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors">
              Terms of Use
            </a>
            <Link to="/accessibility" className="text-gray-500 hover:text-white transition-colors">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function EventsSection() {
  const FALLBACK_EVENTS = [
    {
      month: "OCT",
      day: "07",
      title: "Grade 8 National Examinations",
      event_time: "8:00 AM • All Centres",
      cat: "Examinations",
      color: "bg-[#0B2545]",
    },
    {
      month: "OCT",
      day: "14",
      title: "PEB Quarterly Meeting in Alotau",
      event_time: "9:00 AM • Provincial HQ",
      cat: "Governance",
      color: "bg-[#0D9488]",
    },
    {
      month: "NOV",
      day: "03",
      title: "School Sports Carnival 2026",
      event_time: "All Day • Alotau Oval",
      cat: "Co-Curricular",
      color: "bg-[#C9A84C] text-[#0B2545]",
    },
    {
      month: "DEC",
      day: "05",
      title: "Grade 10 & 12 Results Release",
      event_time: "Online & School Noticeboards",
      cat: "Results",
      color: "bg-[#163663]",
    },
  ];
  const { data } = useEntity("events", FALLBACK_EVENTS as any);
  const events = (data as any[]).map((e: any) => ({
    ...e,
    time: e.event_time ?? e.time,
  }));
  return (
    <section className="py-14 sm:py-16 px-4 bg-white" id="events">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
          <div>
            <span className="inline-flex items-center gap-2 text-[#0D9488] text-[11px] font-bold uppercase tracking-[0.14em]">
              <span className="w-6 h-[2px] bg-[#0D9488] inline-block" /> Calendar
            </span>
            <h2
              className="text-[32px] sm:text-4xl font-bold text-[#0B2545] mt-2 tracking-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Upcoming Events
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl text-[15px] leading-relaxed">
              Key dates for examinations, governance, sports and term operations.
            </p>
          </div>
          <Link
            to="/calendar"
            className="hidden sm:inline-flex items-center gap-2 border border-gray-200 bg-white text-[#0B2545] font-bold px-5 py-2.5 rounded-full hover:border-[#0D9488] hover:text-[#0D9488] transition-colors text-sm"
          >
            View Full Calendar →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {events.map((e) => (
            <div
              key={e.title}
              className="rounded-2xl border border-gray-100 bg-[#F8F6F1] p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 rounded-xl bg-white border border-gray-100 shadow-sm grid place-items-center text-center leading-none">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#0D9488]">
                    {e.month}
                  </span>
                  <span
                    className="text-xl font-bold text-[#0B2545]"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {e.day}
                  </span>
                </div>
                <span
                  className={`${e.color} ${
                    e.color.includes("text-") ? "" : "text-white"
                  } text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full`}
                >
                  {e.cat}
                </span>
              </div>
              <h3 className="font-bold text-[#0B2545] leading-snug group-hover:text-[#0D9488] transition-colors">
                {e.title}
              </h3>
              <p className="text-gray-500 text-xs mt-2 flex items-center gap-1.5">🕒 {e.time}</p>
              <Link
                to="/calendar"
                className="inline-flex items-center gap-1 mt-4 text-xs font-bold text-[#0B2545] group-hover:text-[#0D9488]"
              >
                Details <span className="group-hover:translate-x-0.5 transition-transform">→</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LeadershipSection() {
  const { data } = useEntity("leadership", []);
  const leader = (data as any[])[0];
  return (
    <section className="py-14 sm:py-16 px-4 bg-[#F8F6F1]">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5">
            <div className="relative rounded-[22px] overflow-hidden shadow-[0_20px_60px_rgba(11,37,69,0.12)] border border-white bg-white">
              <img
                src={
                  leader?.photo ||
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=900&fit=crop&auto=format"
                }
                alt={leader?.name || "Provincial Education Advisor"}
                className="w-full h-[460px] object-cover object-top"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#07192E] via-[#07192E]/60 to-transparent p-6">
                <div
                  className="text-white font-bold text-lg leading-tight"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {leader?.name || "Dr. John K. Boro"}
                </div>
                <div className="text-[#C9A84C] text-xs font-bold uppercase tracking-widest">
                  {leader?.title || "Provincial Education Advisor"}
                </div>
                <div className="text-blue-100 text-xs mt-1">
                  {leader?.bio
                    ? leader.bio.slice(0, 60) + "…"
                    : "25+ years • PhD Educational Administration, UPNG"}
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-7 lg:pl-6">
            <span className="inline-flex items-center gap-2 text-[#0D9488] text-[11px] font-bold uppercase tracking-[0.14em]">
              <span className="w-6 h-[2px] bg-[#0D9488] inline-block" /> Leadership
            </span>
            <h2
              className="text-[32px] sm:text-4xl font-bold text-[#0B2545] mt-3 leading-[1.1] tracking-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              A Message from the Advisor
            </h2>
            <div className="mt-6 relative">
              <span className="absolute -top-4 -left-2 text-6xl text-[#0D9488]/15 font-serif">
                “
              </span>
              <p className="text-gray-700 leading-relaxed text-[16px] relative">
                Education is the tide that lifts every island. In Milne Bay, we reach children by
                boat, by foot and by radio, ensuring no learner is left behind, whether in urban
                Alotau or remote Samarai-Murua. Our commitment is simple: qualified teachers, safe
                schools, and community partnership in every district.
              </p>
            </div>
            <p className="text-gray-600 leading-relaxed mt-4 text-[15px]">
              Under the Tuition Fee Free policy and Standards-Based Curriculum, we continue to
              expand access while lifting quality, from vernacular early learning to Grade 12
              pathways, VET skills, and FODE distance learning.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link
                to="/about"
                className="bg-[#0B2545] text-white font-bold px-6 py-3 rounded-full hover:bg-[#163663] transition-colors shadow-sm text-sm"
              >
                Meet the Team →
              </Link>
              <Link
                to="/contact"
                className="bg-white border border-gray-200 text-[#0B2545] font-bold px-6 py-3 rounded-full hover:border-[#0D9488] hover:text-[#0D9488] transition-colors text-sm"
              >
                Contact the Office
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-4 text-center border-t border-gray-200 pt-6">
              {[
                { v: "312", l: "Schools" },
                { v: "48k+", l: "Students" },
                { v: "17", l: "Districts" },
              ].map((s) => (
                <div key={s.l}>
                  <div
                    className="text-2xl font-bold text-[#0B2545]"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {s.v}
                  </div>
                  <div className="text-xs font-bold uppercase tracking-widest text-gray-500">
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DistrictsSection() {
  const FALLBACK = [
    { name: "Alotau", schools: 42, type: "Urban" },
    { name: "Samarai-Murua", schools: 22, type: "Island" },
    { name: "Esa'ala", schools: 15, type: "Island" },
    { name: "Kiriwina-Goodenough", schools: 18, type: "Island" },
    { name: "Huhu", schools: 21, type: "Rural" },
    { name: "Rabaruana", schools: 28, type: "Rural" },
    { name: "Losuia", schools: 17, type: "Island" },
    { name: "Dobu", schools: 16, type: "Island" },
  ];
  const { data } = useEntity("districts", FALLBACK as any);
  const districts = (data as any[]).slice(0, 8);
  return (
    <section className="py-14 sm:py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
          <div>
            <span className="inline-flex items-center gap-2 text-[#0D9488] text-[11px] font-bold uppercase tracking-[0.14em]">
              <span className="w-6 h-[2px] bg-[#0D9488] inline-block" /> Coverage
            </span>
            <h2
              className="text-[32px] sm:text-4xl font-bold text-[#0B2545] mt-2 tracking-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Every District, Every Learner
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl text-[15px] leading-relaxed">
              312 schools across 17 districts, from mainland highlands to remote atolls. Find a
              school near you.
            </p>
          </div>
          <Link
            to="/basic#schools"
            className="inline-flex items-center gap-2 bg-[#0B2545] text-white font-bold px-5 py-2.5 rounded-full hover:bg-[#163663] transition-colors text-sm shadow-sm"
          >
            School Directory →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {districts.map((d) => (
            <Link
              key={d.name}
              to="/basic#schools"
              className="group rounded-2xl border border-gray-100 bg-[#F8F6F1] p-5 hover:bg-white hover:shadow-lg hover:border-[#0D9488]/20 hover:-translate-y-1 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#0B2545] text-white grid place-items-center text-sm group-hover:bg-[#0D9488] transition-colors">
                  🏫
                </div>
                <span className="text-xs font-bold uppercase tracking-wider bg-white border border-gray-100 px-2 py-1 rounded-full text-gray-600">
                  {d.type}
                </span>
              </div>
              <div className="mt-4 font-bold text-[#0B2545] group-hover:text-[#0D9488] transition-colors">
                {d.name}
              </div>
              <div className="text-sm text-gray-500">
                {d.schools} schools • {d.schools * 110}+ students
              </div>
              <div className="mt-3 text-xs font-bold text-[#0B2545] group-hover:text-[#0D9488] flex items-center gap-1">
                View schools{" "}
                <span className="group-hover:translate-x-0.5 transition-transform">→</span>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-6 rounded-2xl bg-[#0B2545] text-white p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-white/10 grid place-items-center">🗺️</span>
            <div>
              <div className="font-bold">Need help locating a school?</div>
              <div className="text-blue-200 text-sm">
                Search by district, level, or name with contact details and enrolment info.
              </div>
            </div>
          </div>
          <Link
            to="/basic#schools"
            className="bg-[#C9A84C] text-[#0B2545] font-bold px-5 py-2.5 rounded-full hover:bg-[#d4b45e] transition-colors text-sm shrink-0"
          >
            Find a School
          </Link>
        </div>
      </div>
    </section>
  );
}

function PartnersSection() {
  const FALLBACK_PARTNERS = [
    "National Dept. of Education",
    "Teaching Service Commission",
    "TVET Authority",
    "UNICEF PNG",
    "Australia PNG Partnership",
    "World Bank",
  ];
  const { data } = useEntity(
    "partners",
    FALLBACK_PARTNERS.map((n, i) => ({ id: i + 1, name: n })) as any,
  );
  const partners = (data as any[])
    .map((partner: any) =>
      typeof partner === "string"
        ? { id: partner, name: partner, logo: "" }
        : { ...partner, logo: partner.logo ?? partner.img ?? "" },
    )
    .sort((left: any, right: any) => (left.sort_order ?? 0) - (right.sort_order ?? 0));
  return (
    <section className="py-10 px-4 bg-[#F8F6F1] border-y border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="text-xs font-bold uppercase tracking-[0.14em] text-gray-500">
            Trusted partners & agencies
          </div>
          <div className="text-xs text-gray-400">Working together for quality education</div>
        </div>
        <div className="partner-marquee overflow-hidden" aria-label="Trusted partner logos">
          <div className="partner-marquee-track">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex shrink-0 gap-3 pr-3" aria-hidden={copy === 1}>
                {partners.map((partner: any) => {
                  const initials = partner.name
                    .split(/\s+/)
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((word: string) => word[0])
                    .join("")
                    .toUpperCase();
                  return (
                    <div
                      key={partner.id ?? partner.name}
                      className="w-52 h-28 rounded-2xl bg-white border border-gray-100 flex flex-col items-center justify-center gap-2 p-3 text-center hover:shadow-md hover:border-[#0D9488]/20 transition-all group"
                    >
                      {partner.logo ? (
                        <img
                          src={partner.logo}
                          alt={`${partner.name} logo`}
                          className="h-11 w-full object-contain transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <div className="h-11 w-11 rounded-xl bg-[#F8F6F1] border border-gray-100 grid place-items-center text-sm font-bold text-[#0B2545]">
                          {initials}
                        </div>
                      )}
                      <div className="text-[11px] font-bold text-gray-600 group-hover:text-[#0B2545] leading-tight">
                        {partner.name}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function HelpCTASection() {
  const [phone, setPhone] = useState("");
  const [channel, setChannel] = useState("Official announcements");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function subscribe(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      await api.subscribeWhatsApp(phone, channel);
      setPhone("");
      setChannel("");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="py-14 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="rounded-[22px] bg-[#0B2545] overflow-hidden relative">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "22px 22px",
            }}
          />
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-[#0D9488]/20 blur-2xl" />
          <div className="relative grid lg:grid-cols-2 gap-8 p-8 sm:p-10">
            <div>
              <span className="inline-flex items-center gap-2 bg-white/10 border border-white/15 text-[#C9A84C] text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                Support
              </span>
              <h2
                className="text-3xl font-bold text-white mt-3 leading-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Stay connected to education updates
              </h2>
              <p className="text-blue-100/80 mt-3 leading-relaxed">
                Subscribe your WhatsApp number to receive official announcements, school updates,
                examination information, and Division notices.
              </p>
              <p className="text-blue-100/70 mt-3 text-sm leading-relaxed">
                Choose the channel that best matches your needs. We will add your number to the
                appropriate Division WhatsApp channel or group.
              </p>
              <div className="relative mt-7 overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-[#164e72]/70 via-white/5 to-[#0D9488]/20 p-3 shadow-2xl">
                <div className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-[#C9A84C]/20 blur-2xl" />
                <div className="pointer-events-none absolute -bottom-12 -left-8 h-36 w-36 rounded-full bg-[#0D9488]/30 blur-2xl" />
                <div className="relative flex items-center justify-center">
                  <img
                    src={whatsappCartoon}
                    alt="Person holding a phone with WhatsApp"
                    className="h-64 w-full object-contain object-bottom drop-shadow-[0_20px_18px_rgba(0,0,0,0.28)] sm:h-72"
                  />
                </div>
                <span className="relative mt-1 block text-center text-[10px] font-bold uppercase tracking-[0.28em] text-[#C9A84C]">
                  Milne Bay, connected
                </span>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <div className="text-lg font-bold text-[#0B2545]">Join WhatsApp updates</div>
              <p className="text-sm text-gray-500 mt-1">
                Enter your mobile number to subscribe to official education updates.
              </p>
              <form onSubmit={subscribe} className="mt-5 space-y-4">
                <div>
                  <label
                    htmlFor="whatsapp-phone"
                    className="text-xs font-bold uppercase tracking-widest text-gray-600"
                  >
                    WhatsApp number
                  </label>
                  <input
                    id="whatsapp-phone"
                    type="tel"
                    inputMode="tel"
                    required
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="+675 7XXX XXXX"
                    className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20"
                  />
                </div>
                <div>
                  <label
                    htmlFor="whatsapp-channel"
                    className="text-xs font-bold uppercase tracking-widest text-gray-600"
                  >
                    Updates channel
                  </label>
                  <select
                    id="whatsapp-channel"
                    value={channel}
                    onChange={(event) => setChannel(event.target.value)}
                    required
                    className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-[#0D9488]"
                  >
                    <option value="">Select a channel</option>
                    <option>Official announcements</option>
                    <option>Parent and guardian updates</option>
                    <option>Teacher updates</option>
                    <option>FODE and distance learning</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full bg-[#0D9488] text-white font-bold px-6 py-3 rounded-full hover:bg-[#0b7a6e] transition-colors text-sm disabled:opacity-60"
                >
                  {status === "loading" ? "Subscribing..." : "Subscribe to WhatsApp updates"}
                </button>
                <div aria-live="polite" className="min-h-5 text-sm font-semibold">
                  {status === "success" && (
                    <p className="text-emerald-700">
                      You are subscribed. Thank you for staying connected.
                    </p>
                  )}
                  {status === "error" && (
                    <p className="text-red-600">
                      We could not save your subscription right now. Please try again.
                    </p>
                  )}
                </div>
              </form>
              <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Avg. response
                within 24 hours • Mon–Fri 8am–4:30pm
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HomePage() {
  return (
    <div
      className="min-h-screen bg-[#F8F6F1]"
      style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif" }}
    >
      <Header />
      <HeroSection />
      <QuickLinksStrip />
      <StatsSection />
      <ProgramsSection />
      <AboutMissionSection />
      <SelectionBanner />
      <NewsSection />
      <EventsSection />
      <LeadershipSection />
      <DistrictsSection />
      <PartnersSection />
      <HelpCTASection />
      <Footer />
    </div>
  );
}

function NotFoundPage() {
  return (
    <div
      className="min-h-screen bg-[#F8F6F1]"
      style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif" }}
    >
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-24 text-center">
        <div
          className="text-7xl font-bold text-[#C9A84C]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          404
        </div>
        <h1
          className="text-3xl font-bold text-[#0B2545] mt-3"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Page not found
        </h1>
        <p className="text-gray-500 mt-3 mb-7">
          The page you requested is unavailable or has moved.
        </p>
        <Link
          to="/"
          className="inline-flex bg-[#0B2545] text-white font-bold px-6 py-3 rounded-full"
        >
          Return Home
        </Link>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/basic" element={<BasicEducationPage />} />
      <Route path="/post" element={<PostPrimaryPage />} />
      <Route path="/vet" element={<VETPage />} />
      <Route path="/fode" element={<FODEPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/accessibility" element={<AccessibilityPage />} />
      <Route path="/downloads" element={<DownloadsPage />} />
      <Route path="/calendar" element={<CalendarPage />} />
      <Route path="/selections" element={<SelectionsPage />} />
      <Route path="/news" element={<NewsPage />} />
      <Route path="/news/:id" element={<NewsDetail />} />

      <Route path="/admin/login" element={<Login />} />
      <Route
        path="/admin"
        element={
          <RequireAuth>
            <AdminLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="hero" element={<HeroManager />} />
        <Route path="news" element={<NewsManager />} />
        <Route path="notices" element={<NoticesManager />} />
        <Route path="events" element={<EventsManager />} />
        <Route path="programs" element={<ProgramsManager />} />
        <Route path="stats" element={<StatsManager />} />
        <Route path="districts" element={<DistrictsManager />} />
        <Route path="leadership" element={<LeadershipManager />} />
        <Route path="selections" element={<SelectionsManager />} />
        <Route path="messages" element={<MessagesManager />} />
        <Route path="whatsapp-subscribers" element={<WhatsAppSubscribersManager />} />
        <Route path="quicklinks" element={<QuickLinksManager />} />
        <Route path="partners" element={<PartnersManager />} />
        <Route path="downloads" element={<DownloadsManager />} />
        <Route path="settings" element={<SettingsManager />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
