import { Link } from "react-router-dom";

const VET_CENTRES = [
  "Kwato TVET",
  "Rabaraba TVET",
  "Sideia TVET",
  "Ubuya TVET",
  "Kaubwaga TVET",
  "Nabusa TVET",
  "Watuluma TVET",
  "Bolubolu TVET",
  "Ailuluai TVET",
];

const VET_SELECTION_DATA: Record<
  string,
  {
    no: number;
    primary: string;
    name: string;
    gender: string;
  }[]
> = {
  "Kwato TVET": [
    { no: 1, primary: "GOILANAI", name: "BRIAN BRIAN", gender: "M" },
    { no: 2, primary: "ALOTAU", name: "EZEKIEL AINAH", gender: "F" },
    { no: 3, primary: "ALOTAU", name: "MORRIS JOEL", gender: "M" },
    { no: 4, primary: "ALOTAU", name: "NELSON NELSON", gender: "M" },
    { no: 5, primary: "KWATO", name: "PAUL THOMAS", gender: "M" },
    { no: 6, primary: "KWATO", name: "MARY GRACE", gender: "F" },
  ],
  "Rabaraba TVET": [
    { no: 1, primary: "RABARABA", name: "DAVID PETER", gender: "M" },
    { no: 2, primary: "RABARABA", name: "ESTHER JOY", gender: "F" },
    { no: 3, primary: "RABARABA", name: "JAMES JOHN", gender: "M" },
    { no: 4, primary: "RABARABA", name: "RUTH NAOMI", gender: "F" },
  ],
  "Sideia TVET": [
    { no: 1, primary: "SIDEIA", name: "PETER ANDREW", gender: "M" },
    { no: 2, primary: "SIDEIA", name: "MARTHA LEAH", gender: "F" },
    { no: 3, primary: "SIDEIA", name: "THOMAS JAMES", gender: "M" },
  ],
  "Ubuya TVET": [
    { no: 1, primary: "UBUYA", name: "SAMUEL DAVID", gender: "M" },
    { no: 2, primary: "UBUYA", name: "RACHEL HANNAH", gender: "F" },
  ],
  "Kaubwaga TVET": [
    { no: 1, primary: "KAUBWAGA", name: "JOSEPH BENJAMIN", gender: "M" },
    { no: 2, primary: "KAUBWAGA", name: "DEBORAH RUTH", gender: "F" },
    { no: 3, primary: "KAUBWAGA", name: "DANIEL MICHAEL", gender: "M" },
  ],
  "Nabusa TVET": [
    { no: 1, primary: "NABUSA", name: "STEPHEN PAUL", gender: "M" },
    { no: 2, primary: "NABUSA", name: "MIRIAM SARAH", gender: "F" },
  ],
  "Watuluma TVET": [
    { no: 1, primary: "WATULUMA", name: "TIMOTHY JOHN", gender: "M" },
    { no: 2, primary: "WATULUMA", name: "ANNA MARIE", gender: "F" },
    { no: 3, primary: "WATULUMA", name: "PHILIP MARK", gender: "M" },
  ],
  "Bolubolu TVET": [
    { no: 1, primary: "BOLUBOLU", name: "ANDREW SIMON", gender: "M" },
    { no: 2, primary: "BOLUBOLU", name: "ELIZABETH JANE", gender: "F" },
  ],
  "Ailuluai TVET": [
    { no: 1, primary: "AILULUAI", name: "MATTHEW LUKE", gender: "M" },
    { no: 2, primary: "AILULUAI", name: "MARGARET ANN", gender: "F" },
    { no: 3, primary: "AILULUAI", name: "BARTHOLOMEW", gender: "M" },
  ],
};

export function SelectionListsSection() {
  return (
    <section id="vet-selections" className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <span className="text-teal-400 text-xs font-bold uppercase tracking-widest">
            2026 VET Selection
          </span>
          <h2
            className="text-4xl font-bold text-[#0B2545] mt-2 mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            VET Centre Selection Lists
          </h2>
          <p className="text-gray-500">
            Official 2026 VET trainee selection lists for Milne Bay Province TVET centres. Click a
            centre to view the selected trainees.
          </p>
        </div>

        <div className="space-y-4">
          {VET_CENTRES.map((centre) => (
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
                      {(VET_SELECTION_DATA[centre] || []).map((student, i) => (
                        <tr
                          key={i}
                          className={`border-b ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                        >
                          <td className="px-3 py-2 text-center text-gray-700">{student.no}</td>
                          <td className="px-3 py-2 text-gray-700">{student.primary}</td>
                          <td className="px-3 py-2 font-medium text-[#0B2545]">{student.name}</td>
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
                {(VET_SELECTION_DATA[centre] || []).length === 0 && (
                  <p className="text-gray-500 text-sm py-4 text-center">
                    Selection data not yet available for this centre
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
          ))}
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
