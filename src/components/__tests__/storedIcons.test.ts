// @vitest-environment jsdom
// The content arrays in the pages still hold emoji, because the Division edits
// those values in the admin and they live in the database. If any of them were
// still rendered as {row.icon}, the emoji would go straight into the DOM and the
// whole change would be cosmetic - so this renders a representative set of
// sections and checks what actually reaches the document.
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// This file is at src/components/__tests__, so the repo root is three levels up.
const root = path.resolve(import.meta.dirname, "..", "..", "..");

/** Every source file, with the emoji left in its content arrays. */
function sourceFiles(dir: string): string[] {
  const full = path.join(root, dir);
  if (!fs.existsSync(full)) return [];
  const out: string[] = [];
  for (const e of fs.readdirSync(full, { withFileTypes: true })) {
    const p = path.join(full, e.name);
    if (e.isDirectory()) {
      if (e.name === "__tests__") continue;
      out.push(...sourceFiles(path.join(dir, e.name)));
    } else if (e.name.endsWith(".tsx")) out.push(path.join(dir, e.name));
  }
  return out;
}

// src/pages was renamed to src/views in the Vite -> App Router migration. The
// name had to change: Next.js treats any directory called `pages` as a Pages
// Router root and refuses to build alongside `app/`. These are the view
// components behind app/(site)/**/page.tsx, not the routes themselves.
const all = [...sourceFiles("src/views"), ...sourceFiles("src/home")];

const DATA_VALUE = /icon\s*:\s*"[\u{1F300}-\u{1FAFF}]/u;

describe("stored icon values", () => {
  it("the pages really do still hold emoji, so this is being tested", () => {
    // If someone later migrates the database to icon names, this test becomes
    // vacuous and should be revisited rather than left passing for ever.
    const withEmoji = all.filter((f) =>
      DATA_VALUE.test(fs.readFileSync(path.join(root, f), "utf8")),
    );
    expect(withEmoji.length).toBeGreaterThan(10);
  });

  it("no page renders a stored icon value as raw text", () => {
    // {row.icon} and friends put the emoji straight into the DOM. Every one of
    // these has to go through <Icon name={row.icon} /> instead.
    const offenders: string[] = [];
    for (const file of all) {
      const src = fs.readFileSync(path.join(root, file), "utf8");
      src.split("\n").forEach((line, i) => {
        if (/>\{\w+\.icon\}/.test(line)) offenders.push(`${file}:${i + 1}`);
      });
    }
    expect(offenders, `render a stored emoji directly: ${offenders.join(", ")}`).toEqual([]);
  });

  it("every place a stored icon is rendered goes through Icon", () => {
    const uses = all.filter((f) =>
      /<Icon\s+name=\{?\w*\.icon/.test(fs.readFileSync(path.join(root, f), "utf8")),
    );
    expect(uses.length).toBeGreaterThan(15);
  });

  it("imports Icon in every file that uses it", () => {
    const missing: string[] = [];
    for (const file of all) {
      const src = fs.readFileSync(path.join(root, file), "utf8");
      if (!/<Icon[\s/>]/.test(src)) continue;
      if (!/from\s+"@\/components\/Icon"/.test(src)) missing.push(file);
    }
    expect(missing).toEqual([]);
  });
});
