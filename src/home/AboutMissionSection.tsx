import { Link } from "react-router-dom";

export function AboutMissionSection() {
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
