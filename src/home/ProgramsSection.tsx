"use client";

import Link from "next/link";
import { useEntity } from "@/hooks/useDynamic";
import { PROGRAMS } from "./fallbackData";
import Reveal from "@/components/Reveal";

export function ProgramsSection() {
  const { data } = useEntity("programs", PROGRAMS as any);
  const list = (data as any[]).map((p: any) => ({
    ...p,
    desc: p.description ?? p.desc,
  }));
  return (
    <section className="py-14 sm:py-16 px-4 bg-white" id="programs">
      <Reveal className="max-w-7xl mx-auto">
        {/* A plain block, not the flex row the districts and events sections
            use: those two have a link on the right to justify the row, this one
            has only the heading block, so the flex classes were inert. */}
        <div className="mb-10">
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
            {/* Sits inside the heading block, as in the districts and events
                sections. As a flex sibling it was pushed to the far edge of the
                row and right-aligned, so it read as a column of its own rather
                than as the summary of the heading above it. */}
            <p className="text-gray-500 mt-3 max-w-xl text-[15px] leading-relaxed">
              From early childhood to vocational training, the Division coordinates quality learning
              across all levels in Milne Bay Province -{" "}
              <span className="text-[#0B2545] font-semibold">
                equitable, inclusive, community-driven.
              </span>
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {list.map((p: any) => (
            <Link
              key={p.code}
              href={p.href}
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
      </Reveal>
    </section>
  );
}
