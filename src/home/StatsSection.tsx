import { useEntity } from "@/hooks/useDynamic";
import { STATS } from "./fallbackData";

export function StatsSection() {
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
