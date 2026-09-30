// @vitest-environment jsdom
// The site search has to actually find things.
//
// The header's Search button used to navigate to /selections whenever there was
// a query and to "#news" when there was not, discarding what had been typed.
// The only other results were eight hand-written page names matched by
// substring, so nothing on the site could be found by searching for it. Both are
// pinned here.
import { createRoot, type Root } from "react-dom/client";
import { act } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { SEARCH_GROUPS, searchRows, searchableText } from "@/lib/searchIndex";
import { SEARCH_SUGGESTIONS } from "@/components/siteNav";
import SiteHeader from "@/components/SiteHeader";

const group = (entity: string) => SEARCH_GROUPS.find((g) => g.entity === entity)!;

describe("the search index", () => {
  it("covers the content a visitor would look for", () => {
    const covered = SEARCH_GROUPS.map((g) => g.entity);
    for (const must of [
      "news",
      "notices",
      "events",
      "districts",
      "schools",
      "downloads",
      "selections_grade9",
      "selections_grade11",
    ]) {
      expect(covered, `${must} is not searchable`).toContain(must);
    }
  });

  it("leaves out page furniture, so a search is not noise", () => {
    // Hero headings, section labels and stat captions are not results.
    const covered = SEARCH_GROUPS.map((g) => g.entity);
    for (const noise of ["hero_slides", "stats", "site_settings", "basic_hero", "section_headings"]) {
      expect(covered).not.toContain(noise);
    }
  });

  it("does not match on file paths, colours or icon names", () => {
    const text = searchableText({
      title: "Enrolment form",
      file_path: "/uploads/secret-handbook.pdf",
      color: "bg-[#0B2545]",
      icon: "download",
    });
    expect(text).toContain("Enrolment form");
    expect(text).not.toContain("secret-handbook");
    expect(text).not.toContain("0B2545");
    expect(text).not.toContain("download");
  });

  it("finds a district by name and by its capital", () => {
    const rows = [{ id: 1, name: "Alotau", capital: "Alotau / Rabaraba", type: "Urban" }];
    expect(searchRows(group("districts"), rows, "alotau")).toHaveLength(1);
    expect(searchRows(group("districts"), rows, "rabaraba")).toHaveLength(1);
  });

  it("requires every word, so a two-word search narrows rather than widens", () => {
    const rows = [
      { id: 1, school: "Alotau Primary", district: "Alotau", type: "Elementary" },
      { id: 2, school: "Alotau High", district: "Alotau", type: "Secondary" },
      { id: 3, school: "Samarai Primary", district: "Samarai-Murua", type: "Elementary" },
    ];
    expect(searchRows(group("schools"), rows, "alotau")).toHaveLength(2);
    expect(searchRows(group("schools"), rows, "alotau primary")).toHaveLength(1);
    expect(searchRows(group("schools"), rows, "alotau secondary")).toHaveLength(1);
  });

  it("is not case sensitive", () => {
    const rows = [{ id: 1, name: "Kiriwina-Goodenough" }];
    expect(searchRows(group("districts"), rows, "KIRIWINA")).toHaveLength(1);
  });

  it("sends each result to the page that owns the content", () => {
    const hits = searchRows(group("schools"), [{ id: 7, name: "Lae Primary" }], "lae");
    expect(hits[0].url).toBe("/schools/7");
    const district = searchRows(group("districts"), [{ id: 2, name: "Esa'ala" }], "esa");
    expect(district[0].url).toBe("/districts/2");
  });

  it("returns nothing for an empty query rather than everything", () => {
    const rows = [{ id: 1, name: "Alotau" }];
    expect(searchRows(group("districts"), rows, "")).toEqual([]);
    expect(searchRows(group("districts"), rows, "   ")).toEqual([]);
  });

  it("finds a school by its head teacher, not just its name", () => {
    const rows = [{ id: 1, name: "Alotau Primary", head_teacher: "Grace Kila" }];
    expect(searchRows(group("schools"), rows, "grace")).toHaveLength(1);
  });

  it("surfaces the named pages, which content rows cannot match on their own", () => {
    // The selection lists are rows of school, district and stream. None of those
    // fields contain the word "selection", so a search for it found downloads
    // and enrolment steps but never the page the visitor was asking for.
    const words = "selection lists".split(/\s+/);
    const match = SEARCH_SUGGESTIONS.find((s) =>
      words.every((w) => [s.label, ...(s.keywords ?? [])].some((x) => x.toLowerCase().includes(w))),
    );
    expect(match?.to).toBe("/selections");
  });

  it("every quick-jump page is reachable by at least one of its own words", () => {
    for (const s of SEARCH_SUGGESTIONS) {
      const words = [s.label, ...(s.keywords ?? [])];
      expect(words.length, `${s.label} has nothing to search on`).toBeGreaterThan(1);
    }
  });
});

describe("the header search box", () => {
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

  /**
   * Opens the panel if needed, types, and returns the Search link's target.
   *
   * Reusable within a test: the toggle is only pressed when the panel is not
   * already open, otherwise a second call closes it and the Search link - which
   * lives inside the panel - is no longer in the document.
   */
  function searchTarget(term: string) {
    // No router wrapper: next/link renders without a router context.
    act(() => root.render(<SiteHeader />));
    let input = container.querySelector("input[type=search]");
    if (!input) {
      const toggle = [...container.querySelectorAll("button")].find(
        (b) => b.getAttribute("aria-label") === "Search",
      )!;
      act(() => toggle.dispatchEvent(new MouseEvent("click", { bubbles: true })));
      input = container.querySelector("input[type=search]")!;
    }
    act(() => {
      const setter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value",
      )!.set!;
      setter.call(input, term);
      input!.dispatchEvent(new Event("input", { bubbles: true }));
    });
    const link = [...container.querySelectorAll("a")].find(
      (a) => a.textContent?.trim() === "Search",
    );
    expect(link, "no Search link in the open panel").toBeDefined();
    return link!.getAttribute("href");
  }

  it("carries the typed text to the results page", () => {
    // This is the bug: it used to be "/selections" for any query, so the search
    // box threw away what had been typed.
    expect(searchTarget("term dates")).toBe("/search?q=term%20dates");
  });

  it("escapes a query with characters that would break the URL", () => {
    expect(searchTarget("grade 9 & 11")).toBe("/search?q=grade%209%20%26%2011");
  });

  it("goes to the search page with no query rather than to a fragment", () => {
    expect(searchTarget("")).toBe("/search");
    expect(searchTarget("   ")).toBe("/search");
  });

  it("never sends a search to the selections page", () => {
    for (const term of ["term dates", "schools", "alotau", "forms"]) {
      expect(searchTarget(term)).not.toContain("/selections");
    }
  });
});
