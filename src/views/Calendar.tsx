"use client";

import { useMemo, useState } from "react";

import { useEntity } from "@/hooks/useDynamic";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PageHero, { NAVY_HERO } from "@/components/PageHero";
import Reveal from "@/components/Reveal";

type EventRow = {
  id?: number | string;
  month: string;
  day: string;
  title: string;
  event_time: string;
  cat: string;
  color: string;
};

const FALLBACK_EVENTS: EventRow[] = [
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

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function monthNumber(value: string) {
  const normalized = value.trim().toLowerCase();
  return MONTHS.findIndex((month) => month.toLowerCase().startsWith(normalized.slice(0, 3)));
}

export default function CalendarPage() {
  const currentYear = new Date().getFullYear();
  const [viewMonth, setViewMonth] = useState(new Date().getMonth());
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const { data, loading } = useEntity("events", FALLBACK_EVENTS);

  const events = data as EventRow[];
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(events.map((event) => event.cat).filter(Boolean)))],
    [events],
  );
  const filteredEvents = useMemo(
    () =>
      events.filter((event) => {
        const matchesCategory = category === "All" || event.cat === category;
        const text = `${event.title} ${event.event_time} ${event.cat}`.toLowerCase();
        return matchesCategory && (!query || text.includes(query.toLowerCase()));
      }),
    [category, events, query],
  );
  const sortedEvents = useMemo(
    () =>
      [...filteredEvents].sort(
        (left, right) =>
          monthNumber(left.month) - monthNumber(right.month) ||
          Number(left.day) - Number(right.day),
      ),
    [filteredEvents],
  );
  const daysInMonth = new Date(currentYear, viewMonth + 1, 0).getDate();
  const leadingDays = new Date(currentYear, viewMonth, 1).getDay();
  const calendarCells = [
    ...Array.from({ length: leadingDays }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];
  const monthEvents = sortedEvents.filter((event) => monthNumber(event.month) === viewMonth);

  function changeMonth(direction: number) {
    setViewMonth((month) => (month + direction + MONTHS.length) % MONTHS.length);
  }

  return (
    <div
      className="min-h-screen bg-[#F8F6F1]"
      style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif" }}
    >
      <SiteHeader />
      <PageHero
        theme={NAVY_HERO}
        image="/assets/education_programs/map/milne_bay_map.jpg"
        imageAlt=""
        imageOpacity={20}
        eyebrow="Education Calendar"
        title={`${currentYear} Full Calendar`}
        lead="Examination dates, governance meetings, school activities, and term operations."
      />

      <main id="main-content" className="max-w-7xl mx-auto px-4 py-10 sm:py-14">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-7">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => changeMonth(-1)}
              className="w-11 h-11 rounded-full border border-gray-200 bg-white font-bold text-[#0B2545] hover:border-[#0D9488]"
              aria-label="Previous month"
            >
              ‹
            </button>
            <h2
              className="text-2xl sm:text-3xl font-bold text-[#0B2545] min-w-52 text-center"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {MONTHS[viewMonth]} {currentYear}
            </h2>
            <button
              type="button"
              onClick={() => changeMonth(1)}
              className="w-11 h-11 rounded-full border border-gray-200 bg-white font-bold text-[#0B2545] hover:border-[#0D9488]"
              aria-label="Next month"
            >
              ›
            </button>
            <button
              type="button"
              onClick={() => setViewMonth(new Date().getMonth())}
              className="ml-2 text-sm font-bold text-[#0D9488] hover:text-[#0B2545]"
            >
              Today
            </button>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              id="calendar-search"
              type="search"
              aria-label="Search events"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search events..."
              className="rounded-full border border-gray-200 bg-white px-5 py-3 text-sm outline-none focus:border-[#0D9488]"
            />
            <select
              id="calendar-filter"
              aria-label="Filter events by category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="rounded-full border border-gray-200 bg-white px-5 py-3 text-sm outline-none focus:border-[#0D9488]"
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item === "All" ? "All categories" : item}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="grid grid-cols-7 border-b border-gray-100 bg-[#F8F6F1]">
            {WEEKDAYS.map((day) => (
              <div
                key={day}
                className="px-2 py-3 text-center text-xs font-bold uppercase tracking-wider text-gray-500"
              >
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {calendarCells.map((day, index) => {
              const dayEvents = day ? monthEvents.filter((event) => Number(event.day) === day) : [];
              return (
                <div
                  key={day ?? `empty-${index}`}
                  className={`min-h-28 sm:min-h-36 border-b border-r border-gray-100 p-2 ${
                    day ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  {day && (
                    <>
                      <div
                        className={`w-7 h-7 grid place-items-center rounded-full text-sm font-bold ${
                          day === new Date().getDate() && viewMonth === new Date().getMonth()
                            ? "bg-[#0D9488] text-white"
                            : "text-gray-600"
                        }`}
                      >
                        {day}
                      </div>
                      <div className="mt-2 space-y-1.5">
                        {dayEvents.map((event) => (
                          <div
                            key={`${event.id ?? event.title}-${event.day}`}
                            className={`${event.color} ${
                              event.color.includes("text-") ? "" : "text-white"
                            } rounded-lg px-2 py-1.5 text-[10px] font-bold leading-tight`}
                          >
                            <div>{event.title}</div>
                            {event.event_time && (
                              <div className="opacity-80 font-medium mt-0.5">
                                {event.event_time}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <section className="mt-12">
          <Reveal className="flex items-end justify-between gap-4 mb-6">
            <div>
              <span className="text-[#0D9488] text-xs font-bold uppercase tracking-widest">
                Schedule
              </span>
              <h2
                className="text-3xl font-bold text-[#0B2545] mt-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                All Calendar Events
              </h2>
            </div>
            <span className="text-sm text-gray-500">
              {filteredEvents.length} {filteredEvents.length === 1 ? "event" : "events"}
            </span>
          </Reveal>
          {loading && <div className="text-gray-500">Loading calendar...</div>}
          {!loading && sortedEvents.length === 0 && (
            <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center text-gray-500">
              No events match your search.
            </div>
          )}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {sortedEvents.map((event) => (
              <article
                key={`${event.id ?? event.title}-${event.month}-${event.day}`}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="w-14 h-14 rounded-xl bg-[#F8F6F1] border border-gray-100 grid place-items-center text-center leading-none">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#0D9488]">
                      {event.month}
                    </span>
                    <span className="text-xl font-bold text-[#0B2545]">{event.day}</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0D9488]">
                    {event.cat}
                  </span>
                </div>
                <h3 className="font-bold text-[#0B2545] mt-4">{event.title}</h3>
                <p className="text-sm text-gray-500 mt-2">{event.event_time}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
