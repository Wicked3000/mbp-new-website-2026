// Clears the variation selectors (U+FE0F) the emoji replacement left stranded
// after a replaced glyph, in every file.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dirs = ["src/pages", "src/home", "src/components"];
const files = [];
const walk = (d) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) {
      if (e.name === "__tests__") continue;
      walk(p);
    } else if (e.name.endsWith(".tsx")) files.push(p);
  }
};
for (const d of dirs) walk(path.join(root, d));

let total = 0;
for (const file of files.sort()) {
  const rel = path.relative(root, file).replace(/\\/g, "/");
  if (/emojiMap|Icon\.tsx|iconSet/.test(rel)) continue;
  const src = fs.readFileSync(file, "utf8");
  // Only the stranded ones: a modifier that directly follows a closing Icon tag.
  const next = src.replace(/(<Icon[^>]*\/>)[\u{FE0F}\u{200D}\u{20E3}]+/gu, "$1");
  if (next === src) continue;
  const n = (src.match(/(<Icon[^>]*\/>)[\u{FE0F}\u{200D}\u{20E3}]+/gu) || []).length;
  fs.writeFileSync(file, next);
  total += n;
  console.log(`${rel}: ${n} cleared`);
}
console.log(`\n${total} stray modifiers removed`);
