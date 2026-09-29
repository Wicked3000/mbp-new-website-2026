// Fails on any pictographic emoji still shipped to the browser.
//
// Emoji are drawn by the platform rather than the stylesheet: in colour, at a
// size unrelated to the font, and differently on every operating system. This
// site used roughly seventy of them, so the failure is silent - a page renders,
// the build passes, and the difference is only visible on a second device.
//
// One kind is expected and allowed: the icon values the Division edits in the
// admin and which live in the database. Those are translated to SVG at render
// time by Icon, so the emoji never reaches the DOM, but it is still in the
// source and in the database.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { EMOJI_MAP } from "../src/components/emojiMap.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PICTO =
  /[\u{1F000}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2B00}-\u{2BFF}\u{2315}\u{2713}\u{2714}\u{2717}\u{2610}]/gu;

const DIRS = ["src/pages", "src/home", "src/components"];
const files = [];
const walk = (d) => {
  if (!fs.existsSync(d)) return;
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) {
      if (e.name === "__tests__") continue;
      walk(p);
    } else if (e.name.endsWith(".tsx")) files.push(p);
  }
};
for (const d of DIRS) walk(path.join(root, d));

// A line is a stored data value if the emoji is assigned to an icon field.
const isDataValue = (line) => /icon\s*:/.test(line) || /"icon"\s*:/.test(line);

const shipped = [];
const data = [];
for (const file of files.sort()) {
  const rel = path.relative(root, file).replace(/\\/g, "/");
  if (/emojiMap|Icon\.tsx/.test(rel)) continue;
  const lines = fs.readFileSync(file, "utf8").split("\n");
  lines.forEach((line, i) => {
    if (!line.match(PICTO)) return;
    const where = `${rel}:${i + 1}`;
    (isDataValue(line) ? data : shipped).push(
      `${where}  ${line.trim().slice(0, 100)}`,
    );
  });
}

let failures = 0;
const fail = (m) => {
  failures += 1;
  console.log(`  FAIL  ${m}`);
};

console.log("\n[no pictographic emoji shipped to the browser]");
if (shipped.length) {
  fail(`${shipped.length} emoji would reach the page:`);
  for (const s of shipped) console.log(`         ${s}`);
} else {
  console.log(`  ok    none in ${files.length} files`);
}

console.log("\n[every stored emoji resolves to an icon that exists]");
const unmapped = [...new Set(data.join("\n").match(PICTO) || [])].filter(
  (e) => !(e in EMOJI_MAP) && !(e.replace(/[\uFE0F\u200D]/g, "") in EMOJI_MAP),
);
unmapped.length
  ? fail(`these stored emoji have no icon: ${unmapped.join(" ")}`)
  : console.log(`  ok    ${data.length} admin-stored values all resolve`);

console.log(failures ? `\n${failures} FAILURE(S)\n` : "\nEmoji free.\n");
process.exit(failures ? 1 : 0);
