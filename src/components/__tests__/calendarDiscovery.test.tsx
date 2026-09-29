// @vitest-environment jsdom
// The calendar has to be findable, not merely present.
//
// It was on disk, routed and admin-managed, but the only route to it was a
// search entry labelled "Term Dates" - so the words on the page itself,
// "calendar" and "academic calendar", matched nothing, and there was no link in
// the navigation or the footer either. Nothing detects that: the route exists
// and every check passes.
import { createRoot, type Root } from "react-dom/client";
import { act } from "react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { FOOTER_NAV, MAIN_NAV, SEARCH_SUGGESTIONS } from "@/components/siteNav";
import SiteHeader from "@/components/SiteHeader";

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
 * Types into the header search and returns the suggestion links offered.
 *
 * Reusable within one test: the panel is only opened when it is not already
 * open, otherwise a second call would toggle it shut and find no input.
 */
function searchLinks(term: string): HTMLAnchorElement[] {
  act(() => root.render(<MemoryRouter><SiteHeader /></MemoryRouter>));
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
  const panel = container.querySelector("[aria-label='Search suggestions']");
  return [...(panel?.querySelectorAll("a") ?? [])] as HTMLAnchorElement[];
}

function search(term: string) {
  return searchLinks(term).map((a) => a.textContent?.trim() ?? "");
}

describe("finding the school calendar", () => {
  it("is not in the main menu, which the Division asked to be kept short", () => {
    // It was added to the menu to make the page findable, then taken out again
    // because it crowded the primary navigation. It stays in the footer and in
    // the search suggestions, so the page is still reachable.
    expect(MAIN_NAV.some((l) => l.href === "/calendar")).toBe(false);
    expect(FOOTER_NAV.some((l) => l.href === "/calendar")).toBe(true);
    expect(SEARCH_SUGGESTIONS.some((s) => s.to === "/calendar")).toBe(true);
  });

  it("is in the footer's quick links, so it stays reachable from every page", () => {
    expect(FOOTER_NAV.map((l) => l.href)).toContain("/calendar");
  });

  it.each([
    ["calendar", "the word on the page's own banner"],
    ["academic", "the phrase on the banner"],
    ["term", "what the old label was called"],
    ["dates", "what families search for"],
    ["events", "what the page lists"],
    ["schedule", "a common synonym"],
  ])('is offered when a visitor searches "%s"', (term) => {
    expect(search(term)).toContain("School Calendar");
  });

  it("sends the visitor to the calendar page", () => {
    const link = searchLinks("calendar").find((a) =>
      a.textContent?.includes("School Calendar"),
    )!;
    expect(link).toBeDefined();
    expect(link.getAttribute("href")).toBe("/calendar");
  });

  it("still finds the other pages, so the keyword matching did not narrow search", () => {
    expect(search("schools")).toContain("School Directory");
    expect(search("fode")).toContain("FODE Enrolment");
    expect(search("contact")).toContain("Contact Helpdesk");
  });

  it("offers nothing for a query that matches nothing", () => {
    expect(search("zzzqqq")).toEqual([]);
  });
});
