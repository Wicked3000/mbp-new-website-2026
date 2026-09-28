// Guards the one motion bug with no visible symptom until you go looking for
// it: a transformed ancestor turns position: fixed into position: absolute,
// relative to that ancestor. The social row and the back-to-top button are
// fixed and mounted from the footer, so a transform on the route wrapper
// silently stops them floating and makes them scroll with the page.
//
// This reads the keyframes in the source, so it fails on the change that would
// cause the bug rather than after someone notices it in a browser.
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = path.resolve(import.meta.dirname, "..");
const css = fs.readFileSync(path.join(root, "index.css"), "utf8");

/**
 * The declaration block of one step of a @keyframes rule. The frames are
 * brace-nested inside the rule, so the body is scanned with a depth counter
 * rather than a lazy match that would stop at the first closing brace.
 */
function step(animation: string, name: string) {
  const rule = new RegExp(`@keyframes\\s+${animation}\\s*\\{`, "m").exec(css);
  if (!rule) throw new Error(`no @keyframes ${animation} in src/index.css`);
  let depth = 0;
  let body = "";
  for (let i = rule.index + rule[0].length; i < css.length; i++) {
    const ch = css[i];
    if (ch === "{") depth++;
    else if (ch === "}") {
      if (depth === 0) break;
      depth--;
    }
    body += ch;
  }
  const s = new RegExp(`(?:^|[\\s,}])${name}\\s*\\{([^}]*)\\}`, "m").exec(body);
  if (!s) throw new Error(`no "${name}" step in @keyframes ${animation}`);
  return s[1];
}

const component = (name: string) =>
  fs.readFileSync(path.join(root, "components", name), "utf8");

describe("route transition", () => {
  // The .page-enter wrapper in App.tsx is an ancestor of everything a page
  // renders, footer chrome included. A transform on it - at any point in the
  // animation, including the filled resting state - makes it the containing
  // block for every position: fixed descendant.
  it("does not animate a transform, which would unpin fixed chrome", () => {
    expect(step("page-enter", "from")).not.toMatch(/transform/);
    expect(step("page-enter", "to")).not.toMatch(/transform/);
  });

  it("fades, so a route change is still signalled", () => {
    expect(step("page-enter", "from")).toMatch(/opacity:\s*0/);
    expect(step("page-enter", "to")).toMatch(/opacity:\s*1/);
  });
});

describe("fixed chrome", () => {
  // BackToTop builds its class list across several lines with a conditional
  // tail, so the class strings are gathered and searched rather than matched as
  // one literal.
  const classNames = (src: string) =>
    [...src.matchAll(/className=\{?[`"]([^`"]*)[`"]/g)].map((m) => m[1]).join(" ");

  for (const file of ["SocialFloat.tsx", "BackToTop.tsx"]) {
    it(`${file} is position: fixed, so it needs no transformed ancestor`, () => {
      expect(classNames(component(file))).toMatch(/\bfixed\b/);
    });
  }

  it("both are mounted from the footer, which is inside the animated wrapper", () => {
    const footer = component("SiteFooter.tsx");
    for (const name of ["SocialFloat", "BackToTop"]) {
      expect(footer).toContain(`<${name} />`);
    }
  });

  it("the wrapper carries the transition class, so the dependency is real", () => {
    const app = fs.readFileSync(path.join(root, "App.tsx"), "utf8");
    expect(app).toMatch(/className=\{isAdmin \? undefined : "page-enter"\}/);
  });
});

describe("scroll reveal", () => {
  it("settles on transform: none, leaving no containing block behind", () => {
    expect(step("reveal-up", "to")).toMatch(/transform:\s*none/);
  });
});
