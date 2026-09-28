// Guards the two API clients against drifting apart.
//
// The browser can be served by either the Node API (server/app.js) or the PHP
// API (backend/api/entities.php). They each keep their own entity map, and when
// they disagree the loser answers 400 "Unknown entity" for a section that is
// plainly in the database - which is what silently emptied the Home Page admin.
// This check fails the build instead.
//
// Run after changing ENTITY_MAP: `npm run sync:php`.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ENTITY_MAP, PUBLIC_READ } from "../server/app.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const php = fs.readFileSync(path.join(root, "backend", "api", "entities.php"), "utf8");

let failures = 0;
const fail = (msg) => {
  failures += 1;
  console.log(`  FAIL  ${msg}`);
};
const pass = (msg) => console.log(`  ok    ${msg}`);

const grab = (re) => {
  const m = php.match(re);
  return m ? m[1] : "";
};
const phpMap = {};
for (const row of grab(/\$MAP=\[([\s\S]*?)\n\];/).split("\n")) {
  const key = row.match(/^\s*'([a-z0-9_]+)'=>/);
  if (!key) continue;
  phpMap[key[1]] = [...row.matchAll(/'([a-z0-9_]+)'/g)]
    .map((m) => m[1])
    .filter((c) => c !== key[1]);
}
const phpPublic = new Set(
  [...grab(/\$publicRead\s*=\s*\[([\s\S]*?)\];/).matchAll(/'([a-z0-9_]+)'/g)].map((m) => m[1]),
);

console.log("\n[sync] PHP entity map matches the Node API");

const nodeKeys = Object.keys(ENTITY_MAP);
const missing = nodeKeys.filter((k) => !(k in phpMap));
const extra = Object.keys(phpMap).filter((k) => !(k in ENTITY_MAP));
missing.length ? fail(`entities.php is missing ${missing.length}: ${missing.join(", ")}`)
               : pass(`all ${nodeKeys.length} entities registered in entities.php`);
extra.length ? fail(`entities.php has entities the Node API does not: ${extra.join(", ")}`)
             : pass("no extra entities in entities.php");

let colsChecked = 0;
for (const [entity, cfg] of Object.entries(ENTITY_MAP)) {
  if (!phpMap[entity]) continue;
  const missingCols = cfg.cols.filter((c) => !phpMap[entity].includes(c));
  if (missingCols.length) fail(`${entity}: entities.php is missing ${missingCols.join(", ")}`);
  colsChecked += cfg.cols.length;
}
if (failures === 0) pass(`${colsChecked} columns identical across both maps`);

// selection_students holds minors' data; a public entry would leak it.
for (const name of ["selection_students", "contact_messages", "whatsapp_subscribers", "users"]) {
  phpPublic.has(name) || PUBLIC_READ.has(name)
    ? fail(`${name} is publicly readable`)
    : pass(`${name} stays private in both maps`);
}

const publicMismatch = [...new Set([...PUBLIC_READ, ...phpPublic])].filter(
  (e) => PUBLIC_READ.has(e) !== phpPublic.has(e),
);
publicMismatch.length
  ? fail(`public-read allowlist differs on: ${publicMismatch.join(", ")}`)
  : pass(`public-read allowlist matches (${PUBLIC_READ.size} entities)`);

console.log(failures ? `\n${failures} FAILURE(S)\n` : "\nAPI clients are in sync.\n");
process.exit(failures ? 1 : 0);
