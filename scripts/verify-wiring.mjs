// Checks the page -> entity wiring.
//
// The silent failure mode for useEntity is a typo'd entity name or a renamed
// column: the fetch 400s, useEntity swallows it and falls back to the hardcoded
// copy, and the page still looks correct. So this verifies every useEntity call
// on every page resolves to a registered, readable, non-empty entity, and that
// the fields the components read exist on the tables behind them.
import fs from "node:fs";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();
// The refactor split each page into a folder of section components and moved
// the home sections into src/home, so the wiring is checked per file across
// those directories rather than at the old single-file paths.
const PAGES = [];
for (const dir of [
  "src/views/BasicEducation",
  "src/views/PostPrimary",
  "src/views/VET",
  "src/views/FODE",
  "src/home",
]) {
  for (const f of fs.readdirSync(dir)) {
    if (f.endsWith(".tsx")) PAGES.push(`${dir}/${f}`);
  }
}

let failures = 0;
const fail = (m) => { failures += 1; console.log("  FAIL  " + m); };
const pass = (m) => console.log("  ok    " + m);

const pool = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "mbp_education",
  charset: "utf8mb4",
});
const DB_NAME = process.env.DB_NAME || "mbp_education";
const [cols] = await pool.query(
  "SELECT table_name, column_name FROM information_schema.columns WHERE table_schema = ?",
  [DB_NAME],
);
const tableCols = new Map();
for (const r of cols) {
  if (!tableCols.has(r.table_name)) tableCols.set(r.table_name, new Set());
  tableCols.get(r.table_name).add(r.column_name);
}

console.log("[useEntity calls resolve to a real, non-empty entity]");
const seen = new Set();
let checkedFiles = 0;
for (const page of PAGES) {
  const src = fs.readFileSync(page, "utf8");
  const calls = [...src.matchAll(/useEntity\(\s*"([a-z_0-9]+)"/g)].map((m) => m[1]);
  // Page index files and the few sections that were always hardcoded have no
  // calls; that is not a failure, it just means there is nothing to check.
  if (!calls.length) continue;
  checkedFiles++;
  let bad = 0;
  for (const e of calls) {
    seen.add(e);
    const res = await fetch(`http://localhost:3001/api/entities?entity=${e}`);
    if (!res.ok) { fail(`${page}: useEntity("${e}") -> HTTP ${res.status}`); bad += 1; continue; }
    const j = await res.json();
    const n = Array.isArray(j.data) ? j.data.length : Object.keys(j.data || {}).length;
    if (n === 0) { fail(`${page}: useEntity("${e}") resolved but is EMPTY`); bad += 1; }
  }
  if (!bad) pass(`${page}: ${calls.length} useEntity calls all resolve, all non-empty`);
}
if (!checkedFiles) fail("no section files with useEntity calls were found - is the layout right?");

console.log("\n[fields the components read exist on their tables]");
// component alias -> table, for the spots where a rename would render blank
const CHECKS = [
  ["src/views/PostPrimary/CurriculumSection.tsx", /s\.subjects/g, "post_streams", "subjects"],
  ["src/views/PostPrimary/CurriculumSection.tsx", /s\.grades/g, "post_streams", "grades"],
  ["src/views/PostPrimary/DownloadsSection.tsx", /doc\.size_text/g, "downloads", "size_text"],
  ["src/views/PostPrimary/PathwaysSection.tsx", /p\.stats/g, "post_pathways", "stats"],
  ["src/views/VET/ProgramsSection.tsx", /p\.trades/g, "vet_programs", "trades"],
  ["src/views/VET/SelectionListsSection.tsx", /row\.name/g, "vet_centre_names", "name"],
  ["src/views/VET/DownloadsSection.tsx", /doc\.size_text/g, "downloads", "size_text"],
  ["src/views/FODE/DeliverySection.tsx", /m\.availability/g, "fode_delivery_methods", "availability"],
  ["src/views/FODE/EnrolmentSection.tsx", /d\.date_text/g, "fode_key_dates", "date_text"],
  ["src/views/FODE/ProgramsSection.tsx", /p\.target/g, "fode_programs", "target"],
  ["src/views/FODE/DeliverySection.tsx", /row\.bullet/g, "fode_app_callout", "bullet"],
  ["src/views/FODE/DownloadsSection.tsx", /doc\.size_text/g, "downloads", "size_text"],
  ["src/views/BasicEducation/DownloadsSection.tsx", /doc\.size_text/g, "downloads", "size_text"],
  ["src/home/AboutMissionSection.tsx", /row\.feature/g, "home_mission_points", "feature"],
  ["src/home/HelpCTASection.tsx", /row\.name/g, "home_cta_channels", "name"],
];
let mapFails = 0;
for (const [file, re, table, col] of CHECKS) {
  const src = fs.readFileSync(file, "utf8");
  const used = re.test(src);
  const exists = tableCols.get(table)?.has(col);
  if (!used) { fail(`${file}: expected a read of ${col} - pattern gone, check mapping`); mapFails += 1; }
  else if (!exists) { fail(`${file} reads ${col} but ${table} has no such column`); mapFails += 1; }
}
if (!mapFails) pass(`${CHECKS.length} field mappings verified against their tables`);

console.log("\n[fode centres: centre_type is mapped back to type in the component]");
const fode = fs.readFileSync("src/views/FODE/CentresSection.tsx", "utf8");
const mapsType = /centre_type\s*\|\|\s*c\.type/.test(fode) || /type:\s*c\.centre_type/.test(fode);
const cardReadsType = /\{\s*c\.type\s*\}/.test(fode) || /c\.type\s*===\s*"/.test(fode);
mapsType && cardReadsType
  ? pass("centre_type -> type mapping present in both the filter and the card")
  : fail("fode centres type mapping incomplete");

console.log("\n[home tabs: every component tab points at a real manager]");
const home = fs.readFileSync("src/admin/pages/HomeManager.tsx", "utf8");
const comps = [...home.matchAll(/component:\s*<(\w+)/g)].map((m) => m[1]);
const crud = [...home.matchAll(/entity:\s*"([a-z_0-9]+)"/g)].map((m) => m[1]);
const expected = { HeroManager: 1, QuickLinksManager: 1, NewsManager: 1, NoticesManager: 1, EventsManager: 1 };
let tabFails = 0;
for (const [name] of Object.entries(expected)) {
  const imported = new RegExp(`import\\s+${name}\\b|\\{[^}]*\\b${name}\\b[^}]*\\}\\s*from`).test(home);
  comps.includes(name) && imported
    ? pass(`tab renders ${name}`)
    : (fail(`tab for ${name} missing or not imported`), (tabFails += 1));
}
for (const e of crud) {
  const r = await fetch(`http://localhost:3001/api/entities?entity=${e}`);
  r.ok ? pass(`tab entity ${e} resolves`) : (fail(`tab entity ${e} -> ${r.status}`), (tabFails += 1));
}

console.log("\n[no absolute localhost URLs anywhere in the page sources]");
let urlFails = 0;
for (const page of PAGES) {
  const src = fs.readFileSync(page, "utf8");
  const m = src.match(/https?:\/\/localhost:3001/g);
  if (m) { fail(`${page}: ${m.length} absolute localhost:3001 URL(s) left in source`); urlFails += 1; }
}
if (!urlFails) pass("all five page sources are free of absolute dev URLs");

console.log("\n[no student or trainee names in any page source]");
const NAMES = ["GUMBAL", "PAIVA", "JESHARELLA", "TAIMO", "EMASI", "HINALEBONAI", "BRIAN BRIAN", "RUTH NAOMI", "ESTHER JOY"];
let nameFails = 0;
for (const page of PAGES) {
  const src = fs.readFileSync(page, "utf8");
  for (const n of NAMES) {
    if (src.includes(n)) { fail(`${page}: contains hardcoded name ${n}`); nameFails += 1; }
  }
}
if (!nameFails) pass("none of the known student/trainee names appear in page source");

// Hardcoded image paths are checked too: an image that gets converted from
// .png to .jpg leaves a reference pointing at a file that no longer exists, and
// the section then renders an empty box with no build error.
console.log("\n[hardcoded asset paths resolve to real files]");
const assetFails = [];
function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = `${dir}/${e.name}`;
    if (e.isDirectory()) walk(p);
    else if (/\.(tsx?|jsx?|css|html)$/.test(e.name)) {
      const src = fs.readFileSync(p, "utf8");
      for (const m of src.matchAll(/["'`](\/assets\/[^"'`\s?#]+)["'`]/g)) {
        if (!fs.existsSync(`public${m[1]}`)) assetFails.push(`${p}: ${m[1]}`);
      }
    }
  }
}
walk("src");
assetFails.length
  ? fail(`${assetFails.length} broken asset reference(s): ${assetFails.join(", ")}`)
  : pass("every hardcoded /assets path exists in public/");

console.log(`\n${seen.size} distinct entities wired across the five pages`);
await pool.end();
console.log(failures ? `\n${failures} FAILURE(S)\n` : "\nAll wiring checks passed.\n");
process.exit(failures ? 1 : 0);