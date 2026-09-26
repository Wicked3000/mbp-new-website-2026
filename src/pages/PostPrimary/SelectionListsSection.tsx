import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { FALLBACK_SELECTION_STUDENTS, type SelectionStudent } from "./selectionListsData";

export function SelectionListsSection() {
  const [students, setStudents] = useState<SelectionStudent[]>(FALLBACK_SELECTION_STUDENTS);

  useEffect(() => {
    let active = true;
    api
      .list("selection_students")
      .then((rows) => {
        if (!active || !rows.length) return;
        setStudents((current) => {
          const managedGrade9 = rows.filter(
            (row: SelectionStudent) => Number(row.grade_level) === 9,
          );
          const managedGrade11 = rows.filter(
            (row: SelectionStudent) => Number(row.grade_level) === 11,
          );
          return [
            ...(managedGrade9.length
              ? managedGrade9
              : current.filter((row) => Number(row.grade_level) === 9)),
            ...(managedGrade11.length
              ? managedGrade11
              : current.filter((row) => Number(row.grade_level) === 11)),
          ];
        });
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const grade9Data = useMemo(() => {
    const grouped: Record<string, SelectionStudent[]> = {};
    students
      .filter((student) => Number(student.grade_level) === 9)
      .sort((a, b) => Number(a.position_no || 0) - Number(b.position_no || 0))
      .forEach((student) => {
        grouped[student.school] = grouped[student.school] || [];
        grouped[student.school].push(student);
      });
    return grouped;
  }, [students]);

  const grade11Data = useMemo(() => {
    const grouped: Record<string, SelectionStudent[]> = {};
    students
      .filter((student) => Number(student.grade_level) === 11)
      .sort((a, b) => Number(a.position_no || 0) - Number(b.position_no || 0))
      .forEach((student) => {
        grouped[student.school] = grouped[student.school] || [];
        grouped[student.school].push(student);
      });
    return grouped;
  }, [students]);

  const grade9Schools = Object.keys(grade9Data).sort((a, b) => a.localeCompare(b));
  const grade11Schools = Object.keys(grade11Data).sort((a, b) => a.localeCompare(b));

  return (
    <section id="selections" className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <span className="text-amber-500 text-xs font-bold uppercase tracking-widest">
            2026 Selection Lists
          </span>
          <h2
            className="text-4xl font-bold text-[#0B2545] mt-2 mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Grade 9 & 11 Placement Lists
          </h2>
          <p className="text-gray-500">
            Official 2026 selection lists for Milne Bay Province. Click a school to view the student
            placement table.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <h3
              className="text-2xl font-bold text-[#0B2545] mb-6 flex items-center gap-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              <span className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                9
              </span>
              Grade 9 Selection List ({grade9Schools.length} Schools)
            </h3>
            <div className="space-y-3">
              {grade9Schools.map((school) => (
                <details
                  key={school}
                  className="group bg-[#F8F6F1] rounded-xl border border-gray-100 overflow-hidden"
                >
                  <summary className="flex items-center justify-between p-4 cursor-pointer list-none">
                    <h4 className="font-semibold text-[#0B2545] pr-8">{school}</h4>
                    <span className="text-amber-500 transition-transform group-open:rotate-180">
                      ▼
                    </span>
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
                          {(grade9Data[school] || []).map((student, i) => (
                            <tr
                              key={i}
                              className={`border-b ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                            >
                              <td className="px-3 py-2 text-center text-gray-700">
                                {student.position_no || "-"}
                              </td>
                              <td className="px-3 py-2 text-gray-700">
                                {student.primary_school || "-"}
                              </td>
                              <td className="px-3 py-2 font-medium text-[#0B2545]">
                                {student.surname}
                              </td>
                              <td className="px-3 py-2 text-gray-700">
                                {student.first_name || "-"}
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
                    {(grade9Data[school] || []).length === 0 && (
                      <p className="text-gray-500 text-sm py-4 text-center">
                        Data not yet available for this school
                      </p>
                    )}
                    <div className="mt-3 text-right">
                      <Link
                        to="/selections"
                        className="text-amber-600 hover:text-amber-800 text-sm font-medium"
                      >
                        View Selection Lists →
                      </Link>
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </div>

          <div>
            <h3
              className="text-2xl font-bold text-[#0B2545] mb-6 flex items-center gap-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              <span className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-sm">
                11
              </span>
              Grade 11 Selection List ({grade11Schools.length} Schools)
            </h3>
            <div className="space-y-3">
              {grade11Schools.map((school) => (
                <details
                  key={school}
                  className="group bg-[#F8F6F1] rounded-xl border border-gray-100 overflow-hidden"
                >
                  <summary className="flex items-center justify-between p-4 cursor-pointer list-none">
                    <h4 className="font-semibold text-[#0B2545] pr-8">{school}</h4>
                    <span className="text-amber-500 transition-transform group-open:rotate-180">
                      ▼
                    </span>
                  </summary>
                  <div className="px-4 pb-4 pt-0 border-t border-gray-200">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-[#163663] text-white text-left">
                            <th className="px-3 py-2 font-semibold">NAME</th>
                            <th className="px-3 py-2 font-semibold w-20">GENDER</th>
                            <th className="px-3 py-2 font-semibold">SLF NO</th>
                            <th className="px-3 py-2 font-semibold">TRANSFERRED FROM</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(grade11Data[school] || []).map((student, i) => (
                            <tr
                              key={i}
                              className={`border-b ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                            >
                              <td className="px-3 py-2 font-medium text-[#0B2545]">
                                {student.student_name || "-"}
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
                              <td className="px-3 py-2 font-mono text-gray-700">
                                {student.slf_no || "-"}
                              </td>
                              <td className="px-3 py-2 text-gray-600">
                                {student.transferred_from || "-"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {(grade11Data[school] || []).length === 0 && (
                      <p className="text-gray-500 text-sm py-4 text-center">
                        Data not yet available for this school
                      </p>
                    )}
                    <div className="mt-3 text-right">
                      <Link
                        to="/selections"
                        className="text-amber-600 hover:text-amber-800 text-sm font-medium"
                      >
                        View Selection Lists →
                      </Link>
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 p-6 bg-amber-50 rounded-xl border border-amber-100 text-center">
          <h3
            className="text-lg font-bold text-[#0B2545] mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Need the complete lists?
          </h3>
          <p className="text-gray-600 mb-4">
            Full PDF downloads with all students for each school are available.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/selections"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-5 py-2.5 rounded transition-colors"
            >
              View Grade 9 Lists
            </Link>
            <Link
              to="/selections"
              className="inline-flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold px-5 py-2.5 rounded transition-colors"
            >
              View Grade 11 Lists
            </Link>
            <Link
              to="/selections"
              className="inline-flex items-center gap-2 border border-amber-500 text-amber-600 hover:bg-amber-50 font-semibold px-5 py-2.5 rounded transition-colors"
            >
              View Summary Tables →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
