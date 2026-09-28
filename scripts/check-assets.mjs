// Hardcoded asset paths must point at files that exist.
//
// Images get converted (png -> jpg, and so on) to shrink the build, and a
// root-absolute /assets/... reference then 404s silently: the browser just
// renders an empty box. Nothing in the build fails, so this checks the
// references against the filesystem instead.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const roots = ["src", "index.html"];

function* walk(p) {
  const stat = fs.statSync(p);
  if (stat.isDirectory()) {
    for (const e of fs.readdirSync(p)) yield* walk(path.join(p, e));
  } else if (/\.(tsx?|jsx?|css|html)$/.test(p)) {
    yield p;
  }
}

const files = [];
for (const r of roots) {
  const p = path.join(root, r);
  if (fs.existsSync(p)) files.push(...walk(p));
}

let failures = 0;
let checked = 0;
for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  const rel = path.relative(root, file);
  // Root-absolute public asset references, e.g. src="/assets/hero/x.jpg".
  for (const m of text.matchAll(/["'`](\/assets\/[^"'`\s?#]+)["'`]/g)) {
    checked += 1;
    const target = path.join(root, "public", m[1].slice(1));
    if (!fs.existsSync(target)) {
      failures += 1;
      console.log(`  FAIL  ${rel}: ${m[1]} does not exist in public/`);
    }
  }
}

// Case matters on Linux and in most CDNs even though Windows tolerates it.
for (const file of files) {
  const rel = path.relative(root, file);
  const text = fs.readFileSync(file, "utf8");
  for (const m of text.matchAll(/["'`](\/assets\/[^"'`\s?#]+)["'`]/g)) {
    const target = path.join(root, "public", m[1].slice(1));
    if (!fs.existsSync(target)) continue;
    const dir = path.dirname(target).replace(/\\/g, "/");
    const actual = fs
      .readdirSync(dir)
      .find((f) => f.toLowerCase() === path.basename(target).toLowerCase());
    if (actual && actual !== path.basename(target)) {
      failures += 1;
      console.log(`  FAIL  ${rel}: ${m[1]} has the wrong case, the file is ${actual}`);
    }
  }
}

console.log(
  failures
    ? `\n${failures} broken asset reference(s) of ${checked} checked\n`
    : `\nAll ${checked} hardcoded /assets references resolve.\n`,
);
process.exit(failures ? 1 : 0);
