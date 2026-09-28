import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { useEntity } from "@/hooks/useDynamic";

// Centre names are place data and safe to publish; the trainee rows are not.
const CENTRE_NAMES_FALLBACK = [
  { name: "Kwato TVET" },
  { name: "Rabaraba TVET" },
  { name: "Sideia TVET" },
  { name: "Ubuya TVET" },
  { name: "Kaubwaga TVET" },
  { name: "Nabusa TVET" },
  { name: "Watuluma TVET" },
  { name: "Bolubolu TVET" },
  { name: "Ailuluai TVET" },
];

type VetTrainee = {
  school: string;
  position_no: number | string | null;
  primary_school: string;
  student_name: string;
  gender: string;
};

export function SelectionListsSection() {
  const { data: centreNames } = useEntity("vet_centre_names", CENTRE_NAMES_FALLBACK);
  const { data: headings } = useEntity("vet_section_headings", []);
  // Trainees come from the API, which restricts selection_students to
  // authenticated admins. There is deliberately no bundled copy: the accordion
  // shows its "not yet available" message until an admin adds rows.
  const [trainees, setTrainees] = useState<VetTrainee[]>([]);

  useEffect(() => {
    let active = true;
    api
      .list("selection_students")
      .then((rows) => {
        if (!active) return;
        const vet = (Array.isArray(rows) ? rows : []).filter(
          (row: any) => /TVET/i.test(String(row.school || "")),
        );
        setTrainees(vet);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const heading =
    headings.find((h: any) => h.skey === "selections") || {
      eyebrow: "2026 VET Selection",
      heading: "VET Centre Selection Lists",
      blurb: "Official 2026 VET trainee selection lists for Milne Bay Province TVET centres. Click a centre to view the selected trainees.",
    };

  return (
    <section id="vet-selections" className="py-16 px-4 bg-white">
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
              "Official 2026 VET trainee selection lists for Milne Bay Province TVET centres. Click a centre to view the selected trainees."}
          </p>
        </div>

        <div className="space-y-4">
          {centreNames.map((row: any) => {
            const centre = row.name;
            const rows = trainees.filter((t) => t.school === centre);
            return (
            <details
              key={centre}
              className="group bg-[#F8F6F1] rounded-xl border border-gray-100 overflow-hidden"
            >
              <summary className="flex items-center justify-between p-4 cursor-pointer list-none">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center text-teal-600 font-bold text-lg">
                    🏭
                  </span>
                  <h4 className="font-semibold text-[#0B2545] pr-8">{centre}</h4>
                </div>
                <span className="text-amber-500 transition-transform group-open:rotate-180">▼</span>
              </summary>
              <div className="px-4 pb-4 pt-0 border-t border-gray-200">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#0D9488] text-white text-left">
                        <th className="px-3 py-2 font-semibold w-12">NO.</th>
                        <th className="px-3 py-2 font-semibold">PRIMARY SCHOOL</th>
                        <th className="px-3 py-2 font-semibold">NAME</th>
                        <th className="px-3 py-2 font-semibold w-20">GENDER</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((student: VetTrainee, i: number) => (
                        <tr
                          key={i}
                          className={`border-b ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                        >
                          <td className="px-3 py-2 text-center text-gray-700">
                            {student.position_no || "-"}
                          </td>
                          <td className="px-3 py-2 text-gray-700">{student.primary_school}</td>
                          <td className="px-3 py-2 font-medium text-[#0B2545]">
                            {student.student_name}
                          </td>
                          <td className="px-3 py-2 text-center">
                            <span
                              className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                                student.gender === "M"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-pink-100 text-pink-700"
                              }`}
                            >
                              {student.gender}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {rows.length === 0 && (
                  <p className="text-gray-500 text-sm py-4 text-center">
                    Trainee names are not published on this site. Published per-centre placement
                    figures are released by the Division.
                  </p>
                )}
                <div className="mt-3 text-right">
                  <Link
                    to="/selections"
                    className="text-teal-600 hover:text-teal-800 text-sm font-medium"
                  >
                    View Selection Lists →
                  </Link>
                </div>
              </div>
            </details>
            );
          })}
        </div>

        <div className="mt-10 p-6 bg-teal-50 rounded-xl border border-teal-100 text-center">
          <h3
            className="text-lg font-bold text-[#0B2545] mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Need the complete VET selection lists?
          </h3>
          <p className="text-gray-600 mb-4">
            Full PDF downloads with all selected trainees for each VET centre are available.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/selections"
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-5 py-2.5 rounded transition-colors"
            >
              View VET Selection Lists
            </Link>
            <Link
              to="#centres"
              className="inline-flex items-center gap-2 border border-teal-500 text-teal-600 hover:bg-teal-50 font-semibold px-5 py-2.5 rounded transition-colors"
            >
              View Centre Details →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
