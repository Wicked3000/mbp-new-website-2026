import { Link } from "react-router-dom";
import { useEntity } from "@/hooks/useDynamic";
import { useDistrictCount } from "@/hooks/useDistricts";
import Reveal from "@/components/Reveal";
import { STATS_FALLBACK } from "@/data/fallbacks";

export function LeadershipSection() {
  const { data } = useEntity("leadership", []);
  const leader = (data as any[])[0];
  const districtCount = useDistrictCount();
  const { data: stats } = useEntity("stats", STATS_FALLBACK as any);
  const byLabel = (label: string) => {
    const row = (stats as any[]).find((s: any) => s.label === label);
    return row?.value_text ?? row?.value;
  };
  return (
    <section className="py-14 sm:py-16 px-4 bg-[#F8F6F1]">
      <Reveal className="max-w-7xl mx-auto">
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
              {/* Schools, students and districts, from the stats table and the
                  districts count. These three were typed in here, and had
                  already drifted: the district figure was a hand-entered
                  number, and the student figure was rounded differently from
                  the one the rest of the site uses. */}
              {[
                { v: byLabel("Schools") ?? "312", l: "Schools" },
                { v: byLabel("Students") ?? "48,200+", l: "Students" },
                { v: String(districtCount), l: "Districts" },
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
      </Reveal>
    </section>
  );
}
