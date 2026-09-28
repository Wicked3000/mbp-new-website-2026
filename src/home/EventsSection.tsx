import { Link } from "react-router-dom";
import { useEntity } from "@/hooks/useDynamic";
import Reveal from "@/components/Reveal";

export function EventsSection() {
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
      <Reveal className="max-w-7xl mx-auto">
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
      </Reveal>
    </section>
  );
}
