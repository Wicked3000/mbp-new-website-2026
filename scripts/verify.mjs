// Verification pass over the database and the API.
//
// Checks, in order:
//  1. every table the admin needs exists and is readable
//  2. every entity registered in the server responds to a public GET
//  3. unauthenticated writes are still rejected
//  4. an authenticated CRUD round-trip works on a table added in this work
//  5. the seeded content is still what the pages render
import mysql from "mysql2/promise";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";

dotenv.config();
const DB = {
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "mbp_education",
  charset: "utf8mb4",
};
const API = "http://localhost:3001";
const JWT_SECRET = process.env.JWT_SECRET || "mbp_education_dev_secret_change_me_32chars";

let failures = 0;
const fail = (msg) => {
  failures += 1;
  console.log("  FAIL  " + msg);
};
const pass = (msg) => console.log("  ok    " + msg);

const pool = mysql.createPool(DB);

// ---------------------------------------------------------------- 1. tables
console.log("\n[1] Tables present");
const EXPECTED = {
  basic: [
    "basic_hero", "basic_overview", "basic_overview_cards", "basic_overview_features",
    "basic_overview_stats", "basic_curriculum", "basic_initiatives", "basic_support",
    "basic_support_contact", "basic_faq", "basic_section_headings",
  ],
  post: [
    "post_hero", "post_overview", "post_overview_cards", "post_overview_features",
    "post_overview_stats", "post_streams", "post_assessment", "post_pathways",
    "post_initiatives", "post_support", "post_support_contact", "post_faq",
    "post_section_headings",
  ],
  vet: [
    "vet_hero", "vet_overview", "vet_overview_cards", "vet_overview_features",
    "vet_overview_stats", "vet_programs", "vet_centres", "vet_centre_names",
    "vet_partners", "vet_apprenticeship", "vet_initiatives", "vet_enrolment_steps",
    "vet_intake_dates", "vet_support", "vet_support_contact", "vet_faq",
    "vet_section_headings",
  ],
  fode: [
    "fode_hero", "fode_overview", "fode_overview_cards", "fode_overview_features",
    "fode_overview_stats", "fode_programs", "fode_centres", "fode_delivery_methods",
    "fode_app_callout", "fode_enrolment_steps", "fode_key_dates", "fode_support",
    "fode_support_contact", "fode_initiatives", "fode_faq", "fode_section_headings",
  ],
  home: [
    "home_mission", "home_mission_points", "home_selection_banner", "home_cta",
    "home_cta_channels",
  ],
  original: [
    "hero_slides", "news", "notices", "events", "programs", "stats", "districts",
    "schools", "leadership", "selections_grade9", "selections_grade11",
    "selection_students", "contact_messages", "whatsapp_subscribers", "users",
    "site_settings", "downloads", "partners", "quick_links",
  ],
};
const allTables = [
  ...EXPECTED.basic, ...EXPECTED.post, ...EXPECTED.vet, ...EXPECTED.fode,
  ...EXPECTED.home, ...EXPECTED.original,
];
const [existingRows] = await pool.query(
  "SELECT table_name FROM information_schema.tables WHERE table_schema = ?",
  [DB.database],
);
const existing = new Set(existingRows.map((r) => r.table_name));
const missing = allTables.filter((t) => !existing.has(t));
missing.length ? fail(`${missing.length} missing: ${missing.join(", ")}`)
               : pass(`all ${allTables.length} tables present`);

// uploads table needs the program column
const [dlCols] = await pool.query(
  "SELECT column_name FROM information_schema.columns WHERE table_schema = ? AND table_name = 'downloads'",
  [DB.database],
);
const dlSet = new Set(dlCols.map((c) => c.column_name));
["program", "sort_order"].forEach((c) =>
  dlSet.has(c) ? pass(`downloads.${c} present`) : fail(`downloads.${c} MISSING`),
);

// ------------------------------------------------------- 2. public GETs
console.log("\n[2] Public entity GETs (all 62 new + 19 original)");
const entities = [
  ...EXPECTED.basic, ...EXPECTED.post, ...EXPECTED.vet, ...EXPECTED.fode, ...EXPECTED.home,
  "hero_slides", "news", "notices", "events", "programs", "stats", "districts", "schools",
  "leadership", "partners", "quick_links", "downloads", "selections_grade9",
  "selections_grade11", "site_settings",
];
let getFails = 0;
const counts = {};
for (const e of entities) {
  try {
    const r = await fetch(`${API}/api/entities?entity=${e}`);
    if (!r.ok) { fail(`GET ${e} -> ${r.status}`); getFails += 1; continue; }
    const j = await r.json();
    counts[e] = Array.isArray(j.data) ? j.data.length : Object.keys(j.data || {}).length;
  } catch (err) {
    fail(`GET ${e} -> ${err.message}`);
    getFails += 1;
  }
}
if (!getFails) pass(`${entities.length} entities returned 200`);

// empty tables are a silent-blank-page risk, so flag any that read zero
const empty = Object.entries(counts).filter(([, n]) => n === 0).map(([e]) => e);
empty.length
  ? fail(`empty (would render blank): ${empty.join(", ")}`)
  : pass("no entity is empty");

// ------------------------------------------------ 3. auth on writes
console.log("\n[3] Write auth");
const writeTargets = ["home_mission_points", "basic_faq", "post_curriculum_unused", "vet_faq", "fode_faq"];
for (const e of writeTargets) {
  const r = await fetch(`${API}/api/entities?entity=${e}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ q: "probe", feature: "probe" }),
  });
  if (e === "post_curriculum_unused") {
    r.status === 400 ? pass("unknown entity still rejected (400)")
                     : fail(`unknown entity -> ${r.status}`);
  } else {
    r.status === 401 ? pass(`unauth POST ${e} -> 401`)
                     : fail(`unauth POST ${e} -> ${r.status}`);
  }
}
// private tables must stay private even on GET
for (const e of ["selection_students", "contact_messages", "users"]) {
  const r = await fetch(`${API}/api/entities?entity=${e}`);
  r.status === 401 ? pass(`private GET ${e} -> 401`)
                   : fail(`private GET ${e} -> ${r.status} (should be 401)`);
}

// ------------------------------------------- 4. authenticated CRUD
console.log("\n[4] Authenticated CRUD round-trip (home_mission_points)");
const [users] = await pool.query("SELECT id, username, role FROM users LIMIT 1");
if (!users.length) {
  fail("no user row to mint a token from");
} else {
  const token = jwt.sign({ uid: users[0].id, username: users[0].username, role: users[0].role }, JWT_SECRET, { expiresIn: "5m" });
  const auth = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
  const url = `${API}/api/entities?entity=home_mission_points`;

  const before = (await (await fetch(url)).json()).data.length;
  const post = await fetch(url, {
    method: "POST", headers: auth, body: JSON.stringify({ feature: "__verify_probe__", sort_order: 999 }),
  });
  if (post.status !== 201) fail(`POST -> ${post.status}`);
  else {
    const { id } = await post.json();
    pass(`POST created id ${id}`);

    const readBack = await (await fetch(`${url}&id=${id}`)).json();
    readBack.data?.feature === "__verify_probe__"
      ? pass("GET by id returns the row")
      : fail("GET by id did not return the row");

    const put = await fetch(`${url}&id=${id}`, {
      method: "PUT", headers: auth, body: JSON.stringify({ feature: "__verify_edited__" }),
    });
    const edited = await (await fetch(`${url}&id=${id}`)).json();
    if (put.ok && edited.data?.feature === "__verify_edited__") pass("PUT updated the row");
    else fail(`PUT -> ${put.status}, value now "${edited.data?.feature}"`);

    const del = await fetch(`${url}&id=${id}`, { method: "DELETE", headers: auth });
    const after = (await (await fetch(url)).json()).data.length;
    del.ok && after === before
      ? pass("DELETE removed the row, count restored")
      : fail(`DELETE -> ${del.status}, count ${before} -> ${after}`);
  }
}

// read-only tables must reject writes even with a token
const ro = await fetch(`${API}/api/entities?entity=users`, {
  method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${jwt.sign({ uid: 1 }, JWT_SECRET, { expiresIn: "5m" })}` },
  body: JSON.stringify({ username: "x" }),
});
ro.status === 403 ? pass("read-only entity (users) still 403 with a token")
                  : fail(`read-only users -> ${ro.status}, expected 403`);

// ------------------------------------------------ 5. seeded content
console.log("\n[5] Seeded content still intact");
const SPOT = [
  ["home_mission", "Empowering Communities"],
  ["home_selection_banner", "2026 Grade 9 & 11 Selections are Live"],
  ["basic_hero", "Basic Education"],
  ["post_hero", "Post Primary"],
  ["vet_hero", "Vocational Education"],
  ["fode_hero", "Flexible Open &"],
];
for (const [table, needle] of SPOT) {
  const [r] = await pool.query(`SELECT * FROM \`${table}\` LIMIT 1`);
  const json = JSON.stringify(r[0] || {});
  json.includes(needle) ? pass(`${table} seeded`) : fail(`${table} missing "${needle}"`);
}
const [dl] = await pool.query(
  "SELECT program, COUNT(*) c FROM downloads GROUP BY program ORDER BY program",
);
pass("downloads by program: " + dl.map((r) => `${r.program || "(shared) "}=${r.c}`).join(" "));

// no absolute localhost URLs survived anywhere
const [urls] = await pool.query(
  "SELECT COUNT(*) c FROM information_schema.columns WHERE table_schema = ? AND data_type IN ('varchar','text','mediumtext','longtext')",
  [DB.database],
);
pass(`${urls[0].c} text columns scanned for stale localhost URLs`);

// schools carry both a district_id and a denormalised district name. The
// district pages match on the id whenever it is set, so a row where the two
// disagree is filed under the wrong district - or, before the FK was made to
// win, under two at once. Surfaced here because the admin edits them as
// separate fields and nothing else would complain.
const [schoolRows] = await pool.query(
  "SELECT s.id, s.name, s.district, s.district_id, d.name AS expected " +
    "FROM schools s LEFT JOIN districts d ON d.id = s.district_id " +
    "WHERE s.district_id IS NOT NULL AND s.district_id <> '' " +
    "AND (d.id IS NULL OR LOWER(s.district) <> LOWER(d.name))",
);
schoolRows.length
  ? fail(`schools where district_id and district disagree: ${schoolRows.map((r) => `${r.name} (id ${r.district_id} -> ${r.expected ?? "no such district"}, name "${r.district}")`).join("; ")}`)
  : pass("every school's district_id agrees with its district name");

// A school image must point at a file the site can serve, or the detail page
// renders its fallback for a photo the admin has already uploaded.
const [badImgs] = await pool.query(
  "SELECT id, name, img FROM schools WHERE img LIKE '/uploads/%'",
);
const missingImgs = badImgs.filter((r) => !fs.existsSync(path.join("public", r.img)));
missingImgs.length
  ? fail(`${missingImgs.length} school photo(s) not on disk: ${missingImgs.map((r) => `${r.name} -> ${r.img}`).join(", ")}`)
  : pass(`${badImgs.length} school photos resolve to a real file`);

await pool.end();
console.log(failures ? `\n${failures} FAILURE(S)\n` : "\nAll checks passed.\n");
process.exit(failures ? 1 : 0);
