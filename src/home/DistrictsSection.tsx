import { Link } from "react-router-dom";
import { useEntity } from "@/hooks/useDynamic";
import Reveal from "@/components/Reveal";

export function DistrictsSection() {
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
      <Reveal className="max-w-7xl mx-auto">
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
      </Reveal>
    </section>
  );
}
