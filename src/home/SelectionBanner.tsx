import { Link } from "react-router-dom";

export function SelectionBanner() {
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
