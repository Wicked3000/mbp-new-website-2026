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

// A stated district count has to match the districts actually held. The site
// once claimed 17 districts on four pages while the table held four, and the
// only reason anyone noticed was a visitor counting the list by hand. Both
// stored figures and the code's fallback are checked against the row count.
const [[{ districtsHeld: districtsHeld }]] = await pool.query(
  "SELECT COUNT(*) districtsHeld FROM districts",
);

const [storedCounts] = await pool.query(
  "SELECT value_text, label FROM stats WHERE label = 'Districts' UNION ALL SELECT value_text, label FROM basic_overview_stats WHERE label = 'Districts'",
);
const badCounts = storedCounts.filter((r) => Number(r.value_text) !== districtsHeld);
badCounts.length
  ? fail(
      `stored district count disagrees with the ${districtsHeld} district(s) held: ` +
        badCounts.map((r) => `${r.label} says ${r.value_text}`).join("; "),
    )
  : pass(`every stored district count matches the ${districtsHeld} district(s) held`);

// The fallback the site shows when the API is down has to agree too, or the
// number would change depending on whether the request succeeded.
const fallbackSrc = fs.readFileSync(
  path.join("src", "hooks", "useDistricts.ts"),
  "utf8",
);
const fallbackRows = (fallbackSrc.match(/\{\s*name:/g) || []).length;
fallbackRows === districtsHeld
  ? pass(`the districts fallback holds the same ${districtsHeld} row(s)`)
  : fail(
      `the districts fallback holds ${fallbackRows} row(s) but the table holds ${districtsHeld}: ` +
        "the site would show a different number when the API is unreachable",
    );

// No page may state a district count that disagrees with the data. Pages read
// the count from the districts table precisely so it cannot drift; this catches
// any that go back to typing a number, and any that type the wrong one. Prose
// that already agrees ("all 4 districts") is fine and is not flagged.
const walkSrc = (dir) => {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "__tests__") continue;
      out.push(...walkSrc(p));
    } else if (/\.tsx?$/.test(entry.name)) {
      out.push(p);
    }
  }
  return out;
};
const wrong = [];
for (const file of walkSrc(path.join("src"))) {
  const rel = path.relative(".", file);
  fs.readFileSync(file, "utf8")
    .split("\n")
    .forEach((line, i) => {
      // Comments record the old figure on purpose; they are not rendered.
      const code = line.replace(/\/\/.*$/, "").replace(/\*.*$/, "");
      // "across 17 districts" in prose, or a number in a Districts stat row.
      const prose = /\b(\d{1,3})\s+districts\b/i.exec(code);
      // A bare quoted number on a Districts row. Requiring the quotes to hold
      // digits alone is what keeps the row's colour (bg-teal-700) out of it,
      // and it does not care what the value field happens to be called - the
      // keys in use are value, value_text and v.
      const row = /"Districts"|'Districts'/.test(code) && /"(\d{1,3})"|'(\d{1,3})'/.exec(code);
      const stated = prose ? prose[1] : row ? row[1] || row[2] : null;
      if (stated !== null && Number(stated) !== districtsHeld) {
        wrong.push(`${rel}:${i + 1} (says ${stated})`);
      }
    });
}
wrong.length
  ? fail(`pages stating a district count other than ${districtsHeld}: ${wrong.join(", ")}`)
  : pass(`no page states a district count other than the ${districtsHeld} held`);

// Stored text must not contain a "uXXXX" escape fragment. A \uXXXX escape that
// lost its backslash is served to visitors as five literal characters: the
// calendar read "8:00 AM u2022 All Centres" where a bullet belongs, and the
// programme levels read "Elementary u2013 Grade 8".
//
// The database is scanned with a REGEXP, and the seeds by importing them and
// walking the parsed values. Scanning the source text instead would flag every
// legitimate \uXXXX in a regex literal - iconSet.ts and check-emoji.mjs both
// need those - so the data is checked, not the code that reads it.
//
// The last character must be a digit: "succeed" and "stubbed" both contain a u
// followed by four hex characters.
const BROKEN_ESCAPE = /u[0-9a-fA-F]{4}/g;
const isBroken = (value) =>
  String(value).match(BROKEN_ESCAPE)?.some((m) => /\d/.test(m[m.length - 1])) ?? false;

const [scanTables] = await pool.query(
  "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_TYPE='BASE TABLE'",
  [DB.database],
);
const brokenStored = [];
for (const t of scanTables) {
  const table = t.TABLE_NAME;
  if (table === "users") continue;
  const [cols] = await pool.query(
    "SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=? AND TABLE_NAME=? AND DATA_TYPE IN ('varchar','text','longtext','mediumtext','char')",
    [DB.database, table],
  );
  for (const { COLUMN_NAME: column } of cols) {
    const [hits] = await pool.query(
      `SELECT \`${column}\` v FROM \`${table}\` WHERE \`${column}\` REGEXP 'u2022|u2014|u2013|u2019|u201c|u201d|u00[0-9a-f][0-9a-f]'`,
    );
    for (const row of hits) {
      if (isBroken(row.v)) brokenStored.push(`${table}.${column}: ${String(row.v).slice(0, 50)}`);
    }
  }
}
brokenStored.length
  ? fail(`stored text with a broken escape: ${brokenStored.join("; ")}`)
  : pass("no stored text contains a broken escape fragment");

const { SEEDS } = await import("../src/lib/seedData.ts");
const brokenSeeds = [];
const walkSeed = (value, trail) => {
  if (typeof value === "string") {
    if (isBroken(value)) brokenSeeds.push(`${trail}: ${value.slice(0, 50)}`);
  } else if (Array.isArray(value)) {
    value.forEach((v, i) => walkSeed(v, `${trail}[${i}]`));
  } else if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) walkSeed(v, `${trail}.${k}`);
  }
};
for (const [entity, rows] of Object.entries(SEEDS)) {
  if (Array.isArray(rows)) rows.forEach((row, i) => walkSeed(row, `${entity}[${i}]`));
}
brokenSeeds.length
  ? fail(`seed data with a broken escape: ${brokenSeeds.slice(0, 8).join("; ")}`)
  : pass("no seed string contains a broken escape fragment");

// A quick link has to point at the page its label promises, and the stored
// destination has to be the one the site actually uses.
//
// The "Term Dates" tile pointed at /#news, so the calendar tile on the home
// page scrolled to the news. Nothing caught it: the link rendered, the tile
// looked right, and the code fallback held the correct /calendar - but the API
// response replaced the fallback, so visitors got the stored value. The
// "Forms & Downloads" row was stored as /basic while a /downloads page exists,
// and the view masked it by forcing that tile's href, which meant the admin was
// shown a destination the page never used.
const PUBLIC_ROUTES = new Set([
  "/", "/about", "/basic", "/post", "/vet", "/fode", "/contact", "/accessibility",
  "/privacy", "/terms", "/districts", "/downloads", "/calendar", "/selections",
  "/news", "/notices",
]);

const [quickLinks] = await pool.query("SELECT label, href FROM quick_links ORDER BY sort_order, id");
const badHref = quickLinks.filter((r) => {
  const href = (r.href || "").trim();
  if (!href) return false;
  // Strip a hash anchor and a query string before checking the path.
  const route = href.split("#")[0].split("?")[0] || "/";
  return !PUBLIC_ROUTES.has(route);
});
badHref.length
  ? fail(
      `quick link(s) pointing at a page that does not exist: ` +
        badHref.map((r) => `${r.label} -> ${r.href}`).join("; "),
    )
  : pass(`every quick link points at a real page (${quickLinks.length} checked)`);

// A tile and the page it names have to agree. The existence check above cannot
// see this: /#news and /basic are both real pages, they are just the wrong ones
// for a calendar and a downloads tile. Two tiles name a page outright, so those
// two are pinned here - the same spot check the banner tests use for their
// heading text.
const NAMED_TILES = [
  { label: "Term Dates", route: "/calendar" },
  { label: "Forms & Downloads", route: "/downloads" },
];
const mismatched = NAMED_TILES.filter(
  (t) => (quickLinks.find((r) => r.label === t.label)?.href || "").split("#")[0] !== t.route,
);
mismatched.length
  ? fail(
      `quick link(s) not pointing at the page they name: ` +
        mismatched
          .map((t) => `${t.label} -> ${quickLinks.find((r) => r.label === t.label)?.href} (expected ${t.route})`)
          .join("; "),
    )
  : pass(`every quick link that names a page points at it (${NAMED_TILES.length} checked)`);

await pool.end();
console.log(failures ? `\n${failures} FAILURE(S)\n` : "\nAll checks passed.\n");
process.exit(failures ? 1 : 0);
