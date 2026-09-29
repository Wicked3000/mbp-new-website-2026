// Repairs "uXXXX" escape fragments that lost their backslash and are being
// served to visitors as five literal characters: the calendar showed
// "8:00 AM u2022 All Centres" where an em-dash and a bullet belong.
//
// Applies to the seeds on disk and to the live rows. The sequences are listed
// explicitly rather than matched generically, because a plain /u[0-9a-f]{4}/g
// also matches the tail of ordinary words - "succeed" and "stubbed" both end in
// four hex characters after the u.
import fs from "node:fs";
import mysql from "mysql2/promise";

// Only the punctuation that actually turned up. Each is the real character.
const REPAIRS = {
  u2022: "\u2022", // bullet
  u2014: "\u2014", // em dash
  u2013: "\u2013", // en dash
  u2019: "\u2019", // right single quote
  u201c: "\u201c", // left double quote
  u201d: "\u201d", // right double quote
};
const pattern = new RegExp(`\\\\?(${Object.keys(REPAIRS).join("|")})`, "gi");

console.log("[seed files]");
for (const file of ["backend/database/mbp_education.sql", "src/lib/seedData.ts"]) {
  const before = fs.readFileSync(file, "utf8");
  const after = before.replace(pattern, (_, seq) => REPAIRS[seq.toLowerCase()]);
  if (after !== before) {
    const n = (before.match(pattern) || []).length;
    fs.writeFileSync(file, after);
    console.log(`  ${file}: ${n} repaired`);
  } else {
    console.log(`  ${file}: nothing to repair`);
  }
}

console.log("[database]");
const c = mysql.createPool({ host: "127.0.0.1", user: "root", password: "", database: "mbp_education" });
const [tables] = await c.query(
  "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA='mbp_education' AND TABLE_TYPE='BASE TABLE'",
);
let fixed = 0;
for (const t of tables) {
  const name = t.TABLE_NAME;
  if (name === "users") continue;
  const [cols] = await c.query(
    "SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA='mbp_education' AND TABLE_NAME=? AND DATA_TYPE IN ('varchar','text','longtext','mediumtext','char')",
    [name],
  );
  for (const col of cols) {
    const cn = col.COLUMN_NAME;
    const [rows] = await c.query(
      `SELECT \`${cn}\` v FROM \`${name}\` WHERE \`${cn}\` REGEXP 'u2022|u2014|u2013|u2019|u201c|u201d'`,
    );
    for (const r of rows) {
      const repaired = String(r.v).replace(pattern, (_, seq) => REPAIRS[seq.toLowerCase()]);
      if (repaired === String(r.v)) continue;
      await c.query(`UPDATE \`${name}\` SET \`${cn}\` = ? WHERE \`${cn}\` = ?`, [repaired, r.v]);
      fixed += 1;
      console.log(`  ${name}.${cn}: ${String(r.v).slice(0, 46)}  ->  ${repaired.slice(0, 46)}`);
    }
  }
}
console.log(`  ${fixed} stored value(s) repaired`);
await c.end();
