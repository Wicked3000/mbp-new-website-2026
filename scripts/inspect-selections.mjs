// Replaces the public selection-list sections with data that is actually
// publishable.
//
// The three programme pages were loading selection_students, which the API
// restricts to authenticated admins because it holds minors' names. A public
// visitor therefore always got an empty table - the "0 Schools" and "not yet
// available" messages. That is correct behaviour on the API, not a bug in it.
//
// What is publishable is the school-level aggregate in selections_grade9 and
// selections_grade11: school, district, type, capacity, placed and cutoff. No
// personal data. This reports what that data actually contains so the sections
// can be built against it rather than against a list of names.
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();
const pool = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "mbp_education",
  charset: "utf8mb4",
});

for (const [table, label] of [
  ["selections_grade9", "Grade 9"],
  ["selections_grade11", "Grade 11"],
]) {
  const [rows] = await pool.query(
    `SELECT school, district, type, capacity, placed, cutoff FROM \`${table}\` ORDER BY placed DESC, school`,
  );
  const published = rows.filter((r) => Number(r.placed) > 0);
  console.log(`\n=== ${label}: ${rows.length} rows, ${published.length} with placements ===`);
  for (const r of published) {
    console.log(
      `  ${r.school} | ${r.district} | ${r.type} | capacity ${r.capacity} | placed ${r.placed} | cutoff ${r.cutoff}`,
    );
  }
  const blanks = rows.filter((r) => !r.placed);
  if (blanks.length) {
    console.log(`  not yet published: ${blanks.map((r) => r.school).join(", ")}`);
  }
}

const [students] = await pool.query(
  "SELECT grade_level, school, COUNT(*) c FROM selection_students GROUP BY grade_level, school",
);
console.log("\n=== selection_students (admin-only, names - not published) ===");
if (!students.length) console.log("  empty");
for (const s of students) console.log(`  grade ${s.grade_level} ${s.school}: ${s.c} rows`);

await pool.end();
