// Checks the admin's field lists against the API's entity map.
//
// This replaces a regex audit of the pages, which produced mostly noise. The
// entity map is the authoritative contract: a column that is not in
// ENTITY_MAP[entity].cols is silently dropped on save, with no error. So the two
// questions worth asking are:
//
//   1. Does every field an admin form offers exist in the map? If not, the
//      Division fills it in, presses save, and the value is discarded.
//   2. Does the map hold columns no admin form offers? Not necessarily wrong -
//      some are populated by seed SQL or read-only - but worth seeing.
//
// Custom managers (hero, news, notices, events, quick links) and the selections
// manager do not use tab configs, so they are listed by the entities they call
// the API with and checked for presence only.
//
// Run: node scripts/audit-admin-coverage.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ENTITY_MAP } from "../server/app.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");

/** Keys declared in the nearest field list at or after `from`.
 *
 * Two spellings exist: `fields: [...]` in a tab config object, and
 * `fields={[...]}` on a directly rendered Crud. Both are matched.
 */
function fieldsAfter(src, from) {
  // The optional brace matters: JSX writes fields={[...]}, a tab config writes
  // fields: [...]. Without it the prop form is skipped silently.
  const m = /fields\s*[:=]\s*\{?\s*\[/.exec(src.slice(from));
  if (!m) return [];
  const open = from + m.index + m[0].length - 1;
  let depth = 0;
  let body = "";
  for (let i = open; i < src.length; i++) {
    if (src[i] === "[") depth++;
    else if (src[i] === "]") {
      depth--;
      if (depth === 0) break;
    }
    body += src[i];
  }
  return [...body.matchAll(/key:\s*"([a-z0-9_]+)"/g)].map((x) => x[1]);
}

// Tab configs declare their own keys; a shared constant (ORDER) is inlined.
const SHARED = { ORDER: ["sort_order"] };

const ADMIN = "src/admin/pages";
const adminFields = new Map();
const customManagers = new Map();

for (const f of fs.readdirSync(path.join(root, ADMIN))) {
  if (!f.endsWith(".tsx")) continue;
  const src = read(`${ADMIN}/${f}`);
  const base = f.replace(/\.tsx$/, "");
  // Entities declared in THIS file only. Kept local so a shared constant at the
  // bottom of one manager cannot add its keys to another manager's entities.
  const inThisFile = new Set();

  for (const m of src.matchAll(/entity[:=]\s*"([a-z_0-9]+)"/g)) {
    const entity = m[1];
    inThisFile.add(entity);
    const keys = fieldsAfter(src, m.index + m[0].length);
    if (!keys.length) {
      // No field list nearby: a custom manager that calls the API directly.
      const calls = [...src.matchAll(/api\.(?:list|create|update|remove)\(\s*"([a-z_0-9]+)"/g)].map(
        (x) => x[1],
      );
      for (const e of calls) {
        customManagers.set(e, base);
        inThisFile.add(e);
      }
      continue;
    }
    const set = adminFields.get(entity) ?? new Set();
    for (const k of keys) set.add(k);
    adminFields.set(entity, set);
  }

  // A tab may reference a shared constant (ORDER) instead of inlining its key.
  // Resolve it for the entities in this file only.
  for (const [constName, keys] of Object.entries(SHARED)) {
    if (!new RegExp(`const ${constName}\\b`).test(src)) continue;
    for (const entity of inThisFile) {
      const set = adminFields.get(entity) ?? new Set();
      for (const k of keys) set.add(k);
      adminFields.set(entity, set);
    }
  }
}

console.log("\n[0] sanity");
if (process.env.DEBUG_AUDIT) {
  console.log("  adminFields keys:", [...adminFields.keys()].join(", "));
  console.log("  customManagers:", [...customManagers.keys()].join(", "));
  console.log("  downloads in adminFields?", adminFields.has("downloads"));
}

let failures = 0;
const fail = (m) => {
  failures += 1;
  console.log(`  FAIL  ${m}`);
};
const note = (m) => console.log(`  note  ${m}`);
const pass = (m) => console.log(`  ok    ${m}`);

console.log("\n[1] Every admin field is a column the API will accept]");
let dropped = 0;
for (const [entity, fields] of adminFields) {
  const cfg = ENTITY_MAP[entity];
  if (!cfg) {
    fail(`${entity} has an admin form but is not in ENTITY_MAP`);
    dropped += 1;
    continue;
  }
  const unknown = [...fields].filter((k) => !cfg.cols.includes(k));
  if (unknown.length) {
    fail(`${entity}: the form offers ${unknown.join(", ")}, which the API silently drops`);
    dropped += 1;
  }
}
if (!dropped) pass(`all fields across ${adminFields.size} admin entities are writable`);

console.log("\n[2] Custom managers resolve to real entities]");
let badManagers = 0;
for (const [entity, where] of customManagers) {
  if (!ENTITY_MAP[entity]) {
    fail(`${where} edits "${entity}", which is not in ENTITY_MAP`);
    badManagers += 1;
  }
}
if (!badManagers) pass(`${customManagers.size} custom-manager entities all resolve`);

console.log("\n[3] Columns no admin form offers (informational)");
let uncovered = 0;
for (const [entity, cfg] of Object.entries(ENTITY_MAP)) {
  if (adminFields.has(entity) || customManagers.has(entity)) continue;
  const shown = cfg.cols.slice(0, 6).join(", ");
  note(`${entity} (${shown}${cfg.cols.length > 6 ? ", ..." : ""})`);
  uncovered += 1;
}
if (!uncovered) pass("every entity has an admin form");

console.log("\n[4] Every section a page renders can be edited in the admin]");
// useEntity("x") is an exact call, so the page side needs no guessing. Each
// section file is one section, which is the granularity the admin tabs use.
const SECTIONS = {
  Home: "src/home",
  BasicEducation: "src/pages/BasicEducation",
  PostPrimary: "src/pages/PostPrimary",
  VET: "src/pages/VET",
  FODE: "src/pages/FODE",
};
const MANAGER = {
  Home: "HomeManager",
  BasicEducation: "BasicEducationManager",
  PostPrimary: "PostPrimaryManager",
  VET: "VETManager",
  FODE: "FODEManager",
};
// Sections whose manager is a bespoke component rather than a tab, either
// because the editor needs custom UI (publish toggles, upload widgets) or
// because the content belongs to a different page.
const COVERED_ELSEWHERE = {
  hero_slides: "HeroManager",
  news: "NewsManager",
  notices: "NoticesManager",
  events: "EventsManager",
  quick_links: "QuickLinksManager",
  selections_grade9: "SelectionsManager",
  selections_grade11: "SelectionsManager",
  selection_students: "SelectionsManager",
};

let gaps = 0;
for (const [page, dir] of Object.entries(SECTIONS)) {
  const uneditable = [];
  for (const f of fs.readdirSync(path.join(root, dir))) {
    if (!f.endsWith(".tsx") || f === "index.tsx") continue;
    const src = read(`${dir}/${f}`);
    for (const call of src.matchAll(/useEntity\(\s*"([a-z_0-9]+)"/g)) {
      const entity = call[1];
      const covered = adminFields.has(entity) || customManagers.has(entity) || COVERED_ELSEWHERE[entity];
      if (!covered) uneditable.push(`${entity} (${f})`);
    }
  }
  uneditable.length
    ? (gaps += 1, fail(`${page}: ${uneditable.join(", ")}`))
    : pass(`${page}: every section it renders is editable in ${MANAGER[page]}`);
}

console.log("\n[5] Columns a page reads that no admin form offers");
// The reverse of check [1]. Narrowed to columns that really exist on the
// entity, so ordinary property access on unrelated objects does not produce
// noise - only genuine "the page reads this but the Division cannot set it".
const META = new Set(["id", "created_at", "length", "map", "filter", "find", "push", "toUpperCase"]);
let blindSpots = 0;
for (const [page, dir] of Object.entries(SECTIONS)) {
  for (const f of fs.readdirSync(path.join(root, dir))) {
    if (!f.endsWith(".tsx") || f === "index.tsx") continue;
    const src = read(`${dir}/${f}`);
    const reads = [...src.matchAll(/useEntity\(\s*"([a-z_0-9]+)"/g)].map((m) => m[1]);
    for (const entity of reads) {
      const cfg = ENTITY_MAP[entity];
      if (!cfg || !adminFields.has(entity)) continue;
      for (const prop of src.matchAll(/\.([a-z][a-z0-9_]*)\b/g)) {
        const col = prop[1];
        if (META.has(col) || !cfg.cols.includes(col)) continue;
        if (adminFields.get(entity).has(col)) continue;
        blindSpots += 1;
        console.log(`  FAIL  ${page}/${f}: reads ${entity}.${col}, which no admin field sets`);
      }
    }
  }
}
if (!blindSpots) pass("every column a page reads is settable somewhere in the admin");

console.log(
  failures || blindSpots
    ? `\n${failures + blindSpots} FAILURE(S)\n`
    : "\nAdmin forms match the API entity map, and cover every rendered section.\n",
);
process.exit(failures || blindSpots ? 1 : 0);