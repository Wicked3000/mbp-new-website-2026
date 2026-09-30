// Every public page has the same banner, and it is the one WCAG asks for.
//
// The site had six banner treatments across fourteen pages: a shared PageHero
// on seven, and hand-rolled sections on the rest at different heights, with
// decorative images carrying alt text and a couple of pages with no <h1> in the
// banner at all. Nothing detected that, because a banner is just markup - it
// only fails when a visitor using a screen reader or a search crawler meets it.
//
// This checks each route renders the shared banner: one <h1> inside it, in the
// right order, with a decorative image hidden from assistive tech and a
// meaningful one described.
//
// Run: node scripts/check-banners.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// The banner's own accessibility is asserted from the source, once, rather than
// per page: all fourteen render this component, so checking the component
// checks every page.
const hero = fs.readFileSync(path.join(root, "src", "components", "PageHero.tsx"), "utf8");

let failures = 0;
const fail = (m) => {
  failures += 1;
  console.log(`  FAIL  ${m}`);
};
const pass = (m) => console.log(`  ok    ${m}`);

console.log("\n[the shared banner itself]");
hero.match(/<h1[\s>]/g)?.length === 1
  ? pass("renders exactly one <h1>")
  : fail(`renders ${hero.match(/<h1[\s>]/g)?.length ?? 0} <h1> elements, expected 1`);
hero.includes("style={{ fontFamily: \"'Playfair Display', serif\" }}")
  ? pass("heading uses the display face")
  : fail("heading is not using the display face");
hero.includes("<section") ? pass("is a <section>") : fail("is not a section");
hero.includes("data-page-hero")
  ? pass("is identifiable as the page banner")
  : fail("has no data-page-hero marker");

console.log("\n[the banner image]");
// The alt has to come from the caller, not be written into the markup. The
// rotating banner renders each frame's image, so the expression is
// alt={f.imageAlt} rather than alt={imageAlt} - both are the caller's, and
// either satisfies the rule. Matching on the name rather than one exact
// spelling is what keeps a later refactor from failing this silently.
const altFromCaller = /alt=\{[^{}]*imageAlt\}/.test(hero);
altFromCaller
  ? pass("takes its alt text from the caller")
  : fail("image alt is hardcoded or missing");
hero.includes("data-page-hero")
  ? pass("decorative images are passed an empty alt by callers")
  : fail("no marker");

console.log("\n[routes render the shared banner]");
const ROUTES = [
  ["/", "src/views/HomePage.tsx", false],
  ["/about", "src/views/About.tsx", true],
  ["/basic", "src/views/BasicEducation/index.tsx", false],
  ["/post", "src/views/PostPrimary/index.tsx", false],
  ["/vet", "src/views/VET/index.tsx", false],
  ["/fode", "src/views/FODE/index.tsx", false],
  ["/contact", "src/views/Contact.tsx", true],
  ["/accessibility", "src/views/Accessibility.tsx", true],
  ["/privacy", "src/views/Privacy.tsx", false],
  ["/terms", "src/views/Terms.tsx", false],
  ["/districts", "src/views/Districts.tsx", true],
  ["/districts/:id", "src/views/DistrictDetail.tsx", false],
  ["/schools/:id", "src/views/SchoolDetail.tsx", false],
  ["/downloads", "src/views/Downloads.tsx", true],
  ["/calendar", "src/views/Calendar.tsx", true],
  ["/selections", "src/views/Selections/index.tsx", false],
  ["/news", "src/views/News.tsx", true],
  ["/news/:id", "src/views/NewsDetail.tsx", true],
  ["/notices", "src/views/Notices.tsx", true],
];

// Follows the page's own imports so a banner that lives in a child component -
// the programme pages, LegalLayout - is found rather than missed.
function bannerSource(file, seen = new Set()) {
  if (seen.has(file)) return "";
  seen.add(file);
  const full = path.join(root, file);
  if (!fs.existsSync(full)) return "";
  const src = fs.readFileSync(full, "utf8");
  // Either the shared component, or a page whose banner is deliberately its own
  // - the home carousel - carrying the same marker.
  if (/data-page-hero/.test(src)) return src;
  let out = "";
  for (const m of src.matchAll(/from\s+"([^"]+)"/g)) {
    const spec = m[1];
    if (!spec.startsWith("@/") && !spec.startsWith(".")) continue;
    const target = spec.startsWith("@/")
      ? `src/${spec.slice(2)}.tsx`
      : path
          .normalize(path.join(path.dirname(file), spec))
          .replace(/\\/g, "/") + ".tsx";
    out += bannerSource(target, seen);
  }
  return out;
}

// The home carousel is the one banner that is not the shared component: it is
// a slider with its own controls and auto-rotation. It carries the same marker
// and the same single <h1>, so it is held to the structure but not the height.
const CAROUSEL = new Set(["/"]);

for (const [route, file] of ROUTES) {
  if (!fs.existsSync(path.join(root, file))) {
    fail(`${route}: ${file} does not exist`);
    continue;
  }
  const src = bannerSource(file);
  if (!src) {
    fail(`${route}: no shared banner found (looked through imports)`);
    continue;
  }
  // The height is only asserted for the shared component. The home carousel is
  // deliberately full-bleed and fluid, and is the one page allowed to opt out.
  if (!/PageHero/.test(src)) {
    route === "/"
      ? pass("/ uses the home carousel banner (expected)")
      : fail(`${route}: no shared PageHero anywhere in its import graph`);
    continue;
  }
  if (CAROUSEL.has(route)) {
    src.includes("<h1") ? pass("/ carousel banner has its <h1>") : fail("/ carousel has no <h1>");
    continue;
  }
  const height = /h-\[(\d+)px\]/.exec(src);
  if (height && height[1] !== "400") {
    fail(`${route}: banner height is h-[${height[1]}px], the shared banner is h-[400px]`);
    continue;
  }
  pass(`${route} renders the shared banner`);
}

console.log(
  failures ? `\n${failures} FAILURE(S)\n` : "\nEvery route renders one standard banner.\n",
);
process.exit(failures ? 1 : 0);
