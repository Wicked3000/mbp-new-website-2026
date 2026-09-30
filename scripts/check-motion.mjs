// Every below-the-fold section on a public page settles in as it is reached.
//
// The scroll-reveal wrapper was written for the home page and never extended, so
// eighteen routes had sections that appeared with no transition at all while the
// home page had eleven. Nothing failed: a section that does not animate still
// renders, so this was only ever visible by scrolling two pages side by side.
//
// The banner is excluded. It is above the fold and already animates once on
// route entry; a reveal on top of that would fire before the visitor had looked
// at it, and the two would fight.
//
// Run: node scripts/check-motion.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (f) => fs.readFileSync(path.join(root, f), "utf8");

const ROUTES = {
  "/": "src/views/HomePage.tsx",
  "/about": "src/views/About.tsx",
  "/basic": "src/views/BasicEducation/index.tsx",
  "/post": "src/views/PostPrimary/index.tsx",
  "/vet": "src/views/VET/index.tsx",
  "/fode": "src/views/FODE/index.tsx",
  "/contact": "src/views/Contact.tsx",
  "/accessibility": "src/views/Accessibility.tsx",
  "/privacy": "src/views/Privacy.tsx",
  "/terms": "src/views/Terms.tsx",
  "/districts": "src/views/Districts.tsx",
  "/districts/:id": "src/views/DistrictDetail.tsx",
  "/schools/:id": "src/views/SchoolDetail.tsx",
  "/downloads": "src/views/Downloads.tsx",
  "/calendar": "src/views/Calendar.tsx",
  "/selections": "src/views/Selections/index.tsx",
  "/news": "src/views/News.tsx",
  "/news/:id": "src/views/NewsDetail.tsx",
  "/notices": "src/views/Notices.tsx",
};

// The banner, and the two home sections that sit above the fold or are chrome.
const BANNER_ONLY = new Set(["/news/:id"]);
const ALLOWED_BARE = new Map([
  ["src/components/PageHero.tsx", "the banner itself"],
  ["src/home/HeroSection.tsx", "the home carousel, above the fold"],
  ["src/home/QuickLinksStrip.tsx", "directly under the carousel, above the fold"],
]);

function graph(entry, seen = new Set()) {
  if (seen.has(entry) || !fs.existsSync(path.join(root, entry))) return seen;
  seen.add(entry);
  for (const m of read(entry).matchAll(/from\s+"([^"]+)"/g)) {
    const spec = m[1];
    if (spec.startsWith("react")) continue;
    let target;
    if (spec.startsWith("@/")) target = `src/${spec.slice(2)}.tsx`;
    else if (spec.startsWith("."))
      target =
        path.normalize(path.join(path.dirname(entry), spec)).replace(/\\/g, "/") + ".tsx";
    else continue;
    graph(target, seen);
  }
  return seen;
}

let failures = 0;
const fail = (m) => {
  failures += 1;
  console.log(`  FAIL  ${m}`);
};

console.log("\n[every content section reveals as it is scrolled to]");
for (const [route, file] of Object.entries(ROUTES)) {
  const bare = [...graph(file)]
    .filter((f) => {
      const src = read(f);
      if (!/<section[\s>]/.test(src)) return false;
      // A section that only wraps the banner, or a nested <section> inside an
      // already-wrapped one, does not need its own reveal.
      if (!/<section[\s>][^>]*data-page-hero/.test(src)) {
        if (!/<section[\s>]/.test(src.replace(/data-page-hero[\s\S]*?>/, ""))) return false;
      }
      return !/<Reveal[\s>]/.test(src);
    })
    .filter((f) => !ALLOWED_BARE.has(f));

  if (BANNER_ONLY.has(route)) {
    bare.length === 0
      ? console.log(`  ok    ${route} is banner-only`)
      : fail(`${route}: ${bare.join(", ")}`);
    continue;
  }
  bare.length
    ? fail(`${route}: no scroll reveal on ${bare.join(", ")}`)
    : console.log(`  ok    ${route}`);
}

console.log("\n[the reveal is wired to the shared stylesheet]");
// src/index.css moved to app/globals.css in the Vite -> App Router migration.
const css = read(path.join("app", "globals.css"));
css.includes("@keyframes reveal-up") ? console.log("  ok    reveal-up is defined") : fail("no reveal-up keyframes");
css.includes(".reveal[data-revealed=\"true\"]")
  ? console.log("  ok    .reveal is driven by data-revealed")
  : fail(".reveal is not driven by data-revealed");
// The reduced-motion guard: without it the sections would stay at opacity 0.
css.includes("@media (prefers-reduced-motion: reduce)")
  ? console.log("  ok    reduced motion is handled")
  : fail("no reduced-motion block");

console.log(failures ? `\n${failures} FAILURE(S)\n` : "\nEvery page animates consistently.\n");
process.exit(failures ? 1 : 0);
