// @vitest-environment jsdom
// The site used pictographic emoji for roughly seventy distinct things, spread
// over hardcoded JSX and over icon fields the Division edits in the admin. Both
// now resolve to SVG through Icon.
//
// The emoji half matters most: those values are in the database, so a mapping
// typo would not fail any build, it would just quietly render the fallback dot
// on a live page.
import { createRoot, type Root } from "react-dom/client";
import { act } from "react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import Icon, { ICONS, resolveIcon } from "../Icon";
import { EMOJI_MAP } from "../emojiMap";

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

function render(props: Record<string, unknown>) {
  act(() => root.render(<Icon {...(props as any)} />));
  return container;
}

describe("resolveIcon", () => {
  it("resolves every stored emoji to a real icon in the set", () => {
    // A name that is not in ICONS would render the fallback dot instead of the
    // glyph, silently, on a live page.
    const orphans = Object.entries(EMOJI_MAP)
      .filter(([, name]) => !(name in ICONS))
      .map(([emoji]) => emoji);
    expect(orphans, `these emoji map to icons that do not exist: ${orphans.join(" ")}`).toEqual([]);
  });

  it("keeps the sequences that embed another emoji distinct", () => {
    // 👨‍🏫 is a man joined to a school by a zero-width joiner, so a naive
    // substring search finds 🏫 inside it and draws a school building where a
    // teacher was meant.
    expect(resolveIcon("👨‍🏫")).toBe("users");
    expect(resolveIcon("👩‍🏫")).toBe("users");
    expect(resolveIcon("👨‍💻")).toBe("users");
    expect(resolveIcon("👩‍💻")).toBe("users");
    // The bare building is still a building.
    expect(resolveIcon("🏫")).toBe("school");
  });

  it("collapses exactly the emoji that mean the same thing, and no others", () => {
    // Each entry is a set of emoji that genuinely depict the same thing and so
    // share one icon. A duplicate outside this list is a copy-paste error in the
    // table, which would silently show the wrong glyph.
    const EXPECTED: Record<string, string[]> = {
      "book-open": ["📖", "📗", "📘", "📙"],
      check: ["✓", "✔"],
      clock: ["🕒", "⏰"],
      map: ["🏝", "🗺"],
      "message-circle": ["💬", "🗣"],
      users: ["👨", "👩", "👨🏫", "👩🏫", "👨💻", "👩💻"],
      wrench: ["🔧", "🛠"],
    };
    const groups = new Map<string, Set<string>>();
    for (const [emoji, name] of Object.entries(EMOJI_MAP)) {
      const key = emoji.replace(/[\uFE0F\u200D\uFE0E]/g, "");
      groups.set(name, new Set([...(groups.get(name) || []), key]));
    }
    const shared: Record<string, string[]> = {};
    for (const [name, set] of groups) {
      if (set.size > 1) shared[name] = [...set].sort();
    }
    for (const [name, expected] of Object.entries(EXPECTED)) {
      expect(shared[name]?.sort(), `"${name}" should map these emoji`).toEqual(expected.sort());
    }
    expect(Object.keys(shared).sort()).toEqual(Object.keys(EXPECTED).sort());
  });

  it("passes an icon name straight through", () => {
    for (const name of ["school", "graduation-cap", "phone", "map-pin"]) {
      expect(resolveIcon(name)).toBe(name);
    }
  });

  it("resolves emoji that carry a variation selector or a joiner", () => {
    // These are what the database actually holds: the sequences were pasted
    // with their modifiers, not as the bare code points in the map keys.
    expect(resolveIcon("✉️")).toBe("mail");
    expect(resolveIcon("🛠️")).toBe("wrench");
    expect(resolveIcon("👨‍🏫")).toBe("users");
    expect(resolveIcon("⚙️")).toBe("cog");
    expect(resolveIcon("✝️")).toBe("cross");
  });

  it("resolves a multi-character stored value containing the emoji", () => {
    // A row whose icon field picked up stray whitespace, or a value pasted with
    // a label beside it.
    expect(resolveIcon(" 📋 ")).toBe("clipboard-list");
  });

  it("returns undefined for anything unrecognised, so the caller can decide", () => {
    expect(resolveIcon("not-an-icon")).toBeUndefined();
    expect(resolveIcon("")).toBeUndefined();
    expect(resolveIcon(null)).toBeUndefined();
    expect(resolveIcon(undefined)).toBeUndefined();
    expect(resolveIcon(42)).toBeUndefined();
  });
});

describe("Icon", () => {
  it("draws an svg for a stored emoji", () => {
    render({ name: "🏫" });
    expect(container.querySelector("svg")).not.toBeNull();
  });

  it("draws an svg for an icon name", () => {
    render({ name: "graduation-cap" });
    expect(container.querySelector("svg")).not.toBeNull();
  });

  it("draws a real glyph rather than the fallback when the value resolves", () => {
    render({ name: "🏫" });
    // The fallback is a span, so finding an svg proves the map resolved.
    expect(container.querySelector("span")).toBeNull();
  });

  it("falls back to a neutral marker when the value does not resolve", () => {
    render({ name: "🦄" });
    expect(container.querySelector("svg")).toBeNull();
    expect(container.querySelector("span")).not.toBeNull();
  });

  it("can be omitted entirely instead of falling back", () => {
    render({ name: "🦄", fallback: "none" });
    expect(container.firstElementChild).toBeNull();
  });

  it("is hidden from assistive tech by default, next to a text label", () => {
    render({ name: "📞" });
    expect(container.querySelector("svg")!.getAttribute("aria-hidden")).toBe("true");
  });

  it("can carry an accessible name when it stands alone", () => {
    render({ name: "📞", title: "Phone" });
    const svg = container.querySelector("svg")!;
    expect(svg.getAttribute("aria-hidden")).toBeNull();
    expect(svg.getAttribute("aria-label")).toBe("Phone");
  });

  it("honours the requested size", () => {
    render({ name: "📞", size: 32 });
    expect(container.querySelector("svg")!.getAttribute("width")).toBe("32");
  });
});
