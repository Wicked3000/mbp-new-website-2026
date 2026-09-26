import { Link } from "react-router-dom";

const FODE_CENTRE = "Alotau FODE Centre";

const FODE_SELECTION_DATA = {
  "Alotau FODE Centre": [
    {
      no: 1,
      primary: "LELEHOA",
      surname: "EMASI",
      firstName: "TAIMO",
      gender: "F",
    },
    {
      no: 2,
      primary: "LELEHOA",
      surname: "JOHN",
      firstName: "MADNEY",
      gender: "F",
    },
    {
      no: 3,
      primary: "LELEHOA",
      surname: "KAILELEDI",
      firstName: "WINNIEFRED",
      gender: "F",
    },
    {
      no: 4,
      primary: "LELEHOA",
      surname: "OWEN",
      firstName: "ROSEANN",
      gender: "F",
    },
    {
      no: 5,
      primary: "LELEHOA",
      surname: "RICHARD",
      firstName: "HINALEBONAI",
      gender: "F",
    },
    {
      no: 6,
      primary: "LELEHOA",
      surname: "TOMMY",
      firstName: "MORRIS",
      gender: "M",
    },
    {
      no: 7,
      primary: "RABE",
      surname: "BRADFORD",
      firstName: "EMBELLINA",
      gender: "F",
    },
  ],
};

export function SelectionListsSection() {
  return (
    <section id="fode-selections" className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <span className="text-teal-400 text-xs font-bold uppercase tracking-widest">
            2026 FODE Selection
          </span>
          <h2
            className="text-4xl font-bold text-[#0B2545] mt-2 mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            FODE Student Enrolment Lists
          </h2>
          <p className="text-gray-500">
            Official 2026 FODE student enrolment list for the main Alotau FODE Centre. Students
            enrolled in Grade 10/12 upgrade programs.
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
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#0B2545] text-white text-left">
                      <th className="px-3 py-2 font-semibold w-12">NO.</th>
                      <th className="px-3 py-2 font-semibold">PRIMARY SCHOOL</th>
                      <th className="px-3 py-2 font-semibold">SURNAME</th>
                      <th className="px-3 py-2 font-semibold">FIRST NAME</th>
                      <th className="px-3 py-2 font-semibold w-20">GENDER</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(FODE_SELECTION_DATA[FODE_CENTRE] || []).map((student, i) => (
                      <tr key={i} className={`border-b ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                        <td className="px-3 py-2 text-center text-gray-700">{student.no}</td>
                        <td className="px-3 py-2 text-gray-700">{student.primary}</td>
                        <td className="px-3 py-2 font-medium text-[#0B2545]">{student.surname}</td>
                        <td className="px-3 py-2 text-gray-700">{student.firstName}</td>
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
            across the 17 districts support remote learners.
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
