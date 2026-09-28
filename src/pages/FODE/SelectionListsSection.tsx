import { Link } from "react-router-dom";
import { useEntity } from "@/hooks/useDynamic";

const FODE_CENTRE = "Alotau FODE Centre";

export function SelectionListsSection() {
  const { data: headings } = useEntity("fode_section_headings", []);

  const heading =
    headings.find((h: any) => h.skey === "selections") || {
      eyebrow: "2026 FODE Selection",
      heading: "FODE Student Enrolment Lists",
      blurb: "Official 2026 FODE student enrolment list for the main Alotau FODE Centre. Students enrolled in Grade 10/12 upgrade programs.",
    };

  return (
    <section id="fode-selections" className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <span className="text-teal-400 text-xs font-bold uppercase tracking-widest">
            {heading.eyebrow}
          </span>
          <h2
            className="text-4xl font-bold text-[#0B2545] mt-2 mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {heading.heading}
          </h2>
          <p className="text-gray-500">
            {heading.blurb ||
              "Official 2026 FODE student enrolment list for the main Alotau FODE Centre. Students enrolled in Grade 10/12 upgrade programs."}
          </p>
        </div>

        <div className="space-y-4">
          <details className="group bg-[#F8F6F1] rounded-xl border border-gray-100 overflow-hidden">
            <summary className="flex items-center justify-between p-4 cursor-pointer list-none">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center text-teal-600 font-bold text-lg">
                  🏢
                </span>
                <h4 className="font-semibold text-[#0B2545] pr-8">{FODE_CENTRE}</h4>
              </div>
              <span className="text-amber-500 transition-transform group-open:rotate-180">▼</span>
            </summary>
            <div className="px-4 pb-4 pt-0 border-t border-gray-200">
              <p className="text-gray-600 text-sm py-4">
                Student names are not published on this site. Enrolment figures for the Alotau
                FODE Centre are released by the Division once each intake is confirmed.
              </p>
              <div className="mt-3 text-right">
                <Link
                  to="/selections"
                  className="text-teal-600 hover:text-teal-800 text-sm font-medium"
                >
                  View School Selection Figures →
                </Link>
              </div>
            </div>
          </details>
        </div>

        <div className="mt-10 p-6 bg-teal-50 rounded-xl border border-teal-100 text-center">
          <h3
            className="text-lg font-bold text-[#0B2545] mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            FODE Enrolment Information
          </h3>
          <p className="text-gray-600 mb-4">
            The Alotau FODE Centre is the main provincial centre. Additional correspondence sites
            across the 4 districts support remote learners.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/selections"
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-5 py-2.5 rounded transition-colors"
            >
              View FODE Selection Lists
            </Link>
            <Link
              to="#centres"
              className="inline-flex items-center gap-2 border border-teal-500 text-teal-600 hover:bg-teal-50 font-semibold px-5 py-2.5 rounded transition-colors"
            >
              View All Centres →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
