import { execute } from "@server/db";
import { fail, ok, readJson } from "@server/http";
import { requireAuth } from "@server/auth";

/**
 * POST /api/selections/students/bulk
 *
 * Ported from server/app.js:603-649.
 *
 * This table holds minors' names, SLF numbers and gender, which is why it is
 * absent from PUBLIC_READ and why the route is admin-only.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Row = {
  grade_level?: unknown;
  school?: unknown;
  position_no?: unknown;
  primary_school?: unknown;
  surname?: unknown;
  first_name?: unknown;
  gender?: unknown;
  student_name?: unknown;
  slf_no?: unknown;
  transferred_from?: unknown;
};

type Body = { rows?: Row[] };

export async function POST(request: Request) {
  const auth = await requireAuth(request);
  if (!auth.ok) return fail(auth.status, auth.error);

  const parsed = await readJson<Body>(request);
  if (!parsed.ok) return parsed.response;

  const rows = Array.isArray(parsed.value.rows) ? parsed.value.rows : [];
  if (!rows.length) return fail(400, "No student rows provided");

  const values = rows
    .map((row) => ({
      grade_level: Number(row.grade_level),
      school: String(row.school || "").trim(),
      position_no:
        row.position_no === "" || row.position_no == null ? null : Number(row.position_no),
      primary_school: String(row.primary_school || "").trim(),
      surname: String(row.surname || "").trim(),
      first_name: String(row.first_name || "").trim(),
      gender: String(row.gender || "").trim(),
      student_name: String(row.student_name || "").trim(),
      slf_no: String(row.slf_no || "").trim(),
      transferred_from: String(row.transferred_from || "").trim(),
    }))
    .filter((row) => (row.grade_level === 9 || row.grade_level === 11) && row.school);

  if (!values.length) return fail(400, "Rows must include a grade level and school");

  // Cap the batch so one request cannot pin the connection pool on a huge paste
  // of pasted-together CSV rows.
  const CHUNK = 500;
  let count = 0;
  for (let i = 0; i < values.length; i += CHUNK) {
    const chunk = values.slice(i, i + CHUNK);
    const placeholders = chunk.map(() => "(?,?,?,?,?,?,?,?,?,?)").join(",");
    const params = chunk.flatMap((row) => [
      row.grade_level,
      row.school,
      row.position_no,
      row.primary_school,
      row.surname,
      row.first_name,
      row.gender,
      row.student_name,
      row.slf_no,
      row.transferred_from,
    ]);
    await execute(
      "INSERT INTO selection_students (grade_level, school, position_no, primary_school, surname, first_name, gender, student_name, slf_no, transferred_from) " +
        `VALUES ${placeholders}`,
      params,
    );
    count += chunk.length;
  }

  return ok({ ok: true, count });
}
