// Corrects two quick links whose stored destinations did not match their labels.
//
// "Term Dates" pointed at /#news, so the calendar tile on the home page scrolled
// to the news instead of opening the calendar. "Forms & Downloads" pointed at
// /basic while a dedicated /downloads page exists - the wrong value was being
// masked in the view by a hardcoded icon check, so the admin was shown and
// stored a destination the page never used.
import fs from "node:fs";
import mysql from "mysql2/promise";

const FIXES = [
  { label: "Term Dates", from: "/#news", to: "/calendar" },
  { label: "Forms & Downloads", from: "/basic", to: "/downloads" },
];

console.log("[database]");
const c = mysql.createPool({ host: "127.0.0.1", user: "root", password: "", database: "mbp_education" });
for (const f of FIXES) {
  const [before] = await c.query("SELECT href FROM quick_links WHERE label = ?", [f.label]);
  if (!before.length) {
    console.log(`  ${f.label}: no such row`);
    continue;
  }
  if (before[0].href === f.to) {
    console.log(`  ${f.label}: already ${f.to}`);
    continue;
  }
  await c.query("UPDATE quick_links SET href = ? WHERE label = ?", [f.to, f.label]);
  console.log(`  ${f.label}: ${before[0].href} -> ${f.to}`);
}
await c.end();

console.log("[seeds]");
for (const file of ["src/lib/seedData.ts", "backend/database/mbp_education.sql"]) {
  let text = fs.readFileSync(file, "utf8");
  let n = 0;
  for (const f of FIXES) {
    // Only rewrite the href on the line that also carries the label, so the
    // same path elsewhere in the file is left alone.
    const re = new RegExp(`('${f.label.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&")}'[^\\n]*?)'${f.from.replace(/[/]/g, "\\/")}'`, "g");
    text = text.replace(re, (_m, head) => {
      n += 1;
      return `${head}'${f.to}'`;
    });
  }
  if (n) {
    fs.writeFileSync(file, text);
    console.log(`  ${file}: ${n} corrected`);
  } else {
    console.log(`  ${file}: nothing to correct`);
  }
}
