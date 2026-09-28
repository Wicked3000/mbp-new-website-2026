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
for (const t of ["selections_grade9", "selections_grade11", "selection_students", "schools", "districts"]) {
  const [cols] = await pool.query(
    "SELECT column_name FROM information_schema.columns WHERE table_schema='mbp_education' AND table_name=? ORDER BY ordinal_position",
    [t],
  );
  const [n] = await pool.query(`SELECT COUNT(*) c FROM \`${t}\``);
  console.log(`\n=== ${t} (${n[0].c} rows) ===`);
  console.log("  " + cols.map((c) => c.column_name).join(", "));
}
const [s9] = await pool.query("SELECT * FROM selections_grade9 LIMIT 3");
console.log("\nselections_grade9 sample:");
for (const r of s9) console.log("  " + JSON.stringify(r));
const [sch] = await pool.query("SELECT id, name, district, type, img FROM schools ORDER BY id");
console.log("\nschools:");
for (const r of sch) console.log(`  ${r.id} ${r.name} (${r.district}, ${r.type}) img=${JSON.stringify(r.img)}`);
const [dis] = await pool.query("SELECT id, name, capital, img, sort_order FROM districts ORDER BY sort_order, id");
console.log("\ndistricts:");
for (const r of dis) console.log(`  ${r.id} ${r.name} capital=${JSON.stringify(r.capital)} img=${JSON.stringify(r.img)} order=${r.sort_order}`);
await pool.end();
