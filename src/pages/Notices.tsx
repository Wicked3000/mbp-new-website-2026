import { Link } from "react-router-dom";
import { useState, useMemo } from "react";
import { useEntity } from "@/hooks/useDynamic";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const FALLBACK_NOTICES = [
  {
    id: 1,
    notice_date: "Sep 22",
    title: "PEB Meeting – October 2026 agenda published",
    is_published: 1,
  },
  {
    id: 2,
    notice_date: "Sep 17",
    title: "Teacher Relief Grant applications close 30 Sep",
    is_published: 1,
  },
  {
    id: 3,
    notice_date: "Sep 12",
    title: "Grade 12 trial exam results now available",
    is_published: 1,
  },
  {
    id: 4,
    notice_date: "Sep 5",
    title: "School board compliance audit schedule released",
    is_published: 1,
  },
  {
    id: 5,
    notice_date: "Aug 28",
    title: "Curriculum support materials distributed to all districts",
    is_published: 1,
  },
  {
    id: 6,
    notice_date: "Aug 20",
    title: "Annual School Sports Carnival registration open",
    is_published: 1,
  },
];

// notice_date is stored as a short display string ("Sep 22") or a full date, so
// resolve bare month/day strings against the current year before sorting.
function noticeTime(value: unknown) {
  const v = String(value ?? "").trim();
  if (!v) return 0;
  if (/^\d{4}-\d{2}-\d{2}/.test(v)) {
    const d = new Date(v);
    return isNaN(d.getTime()) ? 0 : d.getTime();
  }
  if (/^[A-Za-z]{3,9}\s+\d{1,2}$/.test(v)) {
    const d = new Date(`${v} ${new Date().getFullYear()}`);
    return isNaN(d.getTime()) ? 0 : d.getTime();
  }
  const d = new Date(v);
  return isNaN(d.getTime()) ? 0 : d.getTime();
}

export default function NoticesPage() {
  const [q, setQ] = useState("");

  const { data } = useEntity("notices", FALLBACK_NOTICES as any);

  const notices = useMemo(() => {
    const list = (data as any[]).filter((n: any) => n.is_published !== 0);
    return list
      .map((n: any, i: number) => ({ ...n, id: n.id ?? i + 1 }))
      .sort((a: any, b: any) => noticeTime(b.notice_date) - noticeTime(a.notice_date));
  }, [data]);

  const filtered = notices.filter(
    (n: any) => !q || `${n.title} ${n.notice_date}`.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div
      className="min-h-screen bg-[#F8F6F1]"
      style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif" }}
    >
      <SiteHeader />

      <section className="relative h-[320px] sm:h-[380px] overflow-hidden bg-[#0B2545]">
        <img decoding="async"
          src="/assets/slider/mbp-img1.jpg"
          alt="Notice Board"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B2545]/90 via-[#0B2545]/70 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 h-full flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-[#C9A84C] text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4 w-fit">
            Official Notices • Milne Bay Education
          </div>
          <h1
            className="text-4xl sm:text-5xl font-bold text-white leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Notice <span className="text-[#14B8A6]">Board</span>
          </h1>
          <p className="text-blue-100 mt-3 max-w-2xl">
            Official notices and announcements from the Division of Education, newest first.
          </p>
          <div className="mt-6 flex gap-3">
            <div className="flex-1 max-w-md relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">⌕</span>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search notices..."
                className="w-full pl-9 pr-4 py-3 rounded-full bg-white text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#0D9488]/30"
              />
            </div>
            <Link
              to="/contact"
              className="hidden sm:inline-flex bg-[#C9A84C] text-[#0B2545] font-bold px-6 py-3 rounded-full text-sm"
            >
              Contact Division
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-end justify-between mb-6 gap-4">
          <h2
            className="text-2xl font-bold text-[#0B2545]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            All Notices
          </h2>
          <span className="text-xs text-gray-400">
            {filtered.length} of {notices.length} notices
          </span>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 text-gray-500">
            No notices found.
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {filtered.map((n: any, i: number) => (
            <div
              key={n.id}
              className={`flex gap-4 px-5 py-4 hover:bg-[#F8F6F1] transition-colors group ${
                i < filtered.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              <div className="shrink-0">
                <div className="bg-[#0B2545] group-hover:bg-[#0D9488] text-white text-[11px] font-bold px-2.5 py-2 rounded-lg w-[58px] text-center leading-tight transition-colors">
                  {n.notice_date}
                </div>
              </div>
              <p className="text-[13.5px] text-gray-700 leading-snug group-hover:text-[#0B2545] transition-colors font-medium">
                {n.title}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <Link to="/" className="bg-[#0B2545] text-white font-bold px-6 py-3 rounded-full text-sm">
            Back to Home
          </Link>
          <Link
            to="/news"
            className="bg-white border border-gray-200 text-[#0B2545] font-bold px-6 py-3 rounded-full text-sm"
          >
            News & Announcements
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
