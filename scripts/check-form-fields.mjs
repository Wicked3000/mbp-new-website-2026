// Every form control needs an id or a name, and no id may be used twice.
//
// These controls are search fields and category filters. Each one already sat
// inside a <label> or carried an aria-label, so they were named for assistive
// tech - but a browser decides what to autofill from the id and name, and a
// <label for> attaches to the first element with a matching id. An audit
// flagged three of them on the selections page; there were 25 across the site.
//
// Run: node scripts/check-form-fields.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const skip = new Set(["node_modules", "dist", ".git", ".kilo"]);

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skip.has(entry.name)) continue;
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, out);
    else if (/\.tsx$/.test(entry.name)) out.push(p);
  }
  return out;
}

// Spans the whole opening tag, including braces inside attribute values, so an
// arrow in onChange={(e) => ...} does not truncate the match at its ">" - which
// is how a line-based pass found only a test fixture and reported the site clean.
const CONTROL = /<(input|select|textarea)\b((?:[^<>"']|"[^"]*"|'[^']*'|\{(?:[^{}]|\{[^{}]*\})*\})*?)(\/?)>/g;

let failures = 0;
const fail = (m) => {
  failures += 1;
  console.log(`  FAIL  ${m}`);
};
const pass = (m) => console.log(`  ok    ${m}`);

const files = walk(path.join(root, "src")).sort();
const missing = [];
// Uniqueness is checked per file, and - for form controls only - across files.
//
// Repeating an id between two files is often correct here: main-content is a
// skip link on each of sixteen pages, and overview/schools/centres are section
// anchors on separate programme pages that never appear together. A blanket
// global rule flags all of those.
//
// Form control ids are different. The header is on every page, so a page's own
// search box shares the document with the header's, and reusing the header's id
// there means a <label for> or a fragment link binds to the wrong element -
// which is exactly what happened when Notices.tsx was given
// id="siteheader-search". So a control id must be unique site-wide, while
// anchor ids are exempt.
const controlIdOwners = new Map();
const withinFile = [];

for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  const rel = path.relative(root, file).replace(/\\/g, "/");
  for (const m of text.matchAll(CONTROL)) {
    const attrs = m[2] || "";
    const line = text.slice(0, m.index).split("\n").length;
    if (!/\bid\s*=/.test(attrs) && !/\bname\s*=/.test(attrs)) {
      missing.push(`${rel}:${line} <${m[1]}>`);
    }
    const own = /\bid="([^"]+)"/.exec(attrs);
    if (own) {
      // The admin and the public site are separate surfaces and never render
      // together, so an id shared between them - the news search box exists in
      // both - is not a collision. Only public files are compared with each
      // other here.
      if (!rel.startsWith("src/admin/")) {
        if (!controlIdOwners.has(own[1])) controlIdOwners.set(own[1], new Set());
        controlIdOwners.get(own[1]).add(rel);
      }
    }
  }
  // A repeated id in one file binds a <label for> or a fragment link to the
  // first match only, which is checkable and always wrong.
  const counts = new Map();
  for (const m of text.matchAll(/\bid="([^"]+)"/g)) {
    counts.set(m[1], (counts.get(m[1]) ?? 0) + 1);
  }
  for (const [id, count] of counts) {
    if (count > 1) withinFile.push(`${rel}: "${id}" x${count}`);
  }
}

const reusedControls = [...controlIdOwners].filter(([, owners]) => owners.size > 1);

missing.length
  ? fail(`form control(s) with neither id nor name: ${missing.join(", ")}`)
  : pass("every form control has an id or a name");

reusedControls.length
  ? fail(
      `form control id(s) shared between files, which puts two controls with the ` +
        `same id on one page: ` +
        reusedControls.map(([id, owners]) => `"${id}" in ${[...owners].join(" + ")}`).join(", "),
    )
  : pass("every form control id is unique site-wide");

withinFile.length
  ? fail(`id(s) used more than once in a file: ${withinFile.join(", ")}`)
  : pass("no id is used twice in a file");

process.exit(failures ? 1 : 0);
