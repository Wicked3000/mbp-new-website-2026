/**
 * What the site's search looks through, and where a result leads.
 *
 * The header search previously had no index at all. Its only suggestions were
 * eight hand-written page names matched by substring, and its Search button
 * threw the typed text away and navigated to /selections - so searching
 * "term dates" and pressing Search landed on the Selections page, ignoring what
 * had been typed. Nothing on the site could be found by searching for it.
 *
 * This is the list of things worth finding. It is deliberately not every entity
 * the admin can edit: hero headings, section labels, stat captions and icon
 * names are page furniture, and a visitor typing "navy" or "sort" should not be
 * shown them. What is here is the content a person arrives looking for.
 *
 * Every entity listed is in PUBLIC_READ in server/app.js, so the results page
 * can read it without a token.
 */

export type SearchGroup = {
  /** Entity name as registered in the server's map. */
  entity: string;
  /** Heading shown above this group's results. */
  label: string;
  /** Fields to try, in order, when naming the result. */
  titleFields: string[];
  /** Fields to try, in order, for the snippet under the title. */
  bodyFields: string[];
  /** Where a result leads. Rows without an id fall back to the group link. */
  url: (row: any) => string;
};

/*
 * Fields never shown or matched: they are either opaque, or a presentation
 * detail, or a path. Matching on a file path or a colour would surface rows for
 * reasons the visitor did not mean.
 */
const IGNORED = new Set([
  "id",
  "sort_order",
  "created_at",
  "updated_at",
  "is_published",
  "is_previous",
  "is_active",
  "icon",
  "color",
  "accent",
  "tag_color",
  "img",
  "logo",
  "photo",
  "file_path",
  "skey",
  "lat",
  "lng",
]);

/** The text of a row worth searching: every human-readable string in it. */
export function searchableText(row: any): string {
  if (!row || typeof row !== "object") return "";
  return Object.entries(row)
    .filter(([k, v]) => !IGNORED.has(k) && typeof v === "string")
    .map(([, v]) => v)
    .join("  ");
}

/** The first non-empty value among the given fields. */
function pick(row: any, fields: string[]): string {
  for (const f of fields) {
    const v = row?.[f];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return "";
}

export const SEARCH_GROUPS: SearchGroup[] = [
  {
    entity: "news",
    label: "News",
    titleFields: ["title"],
    bodyFields: ["excerpt"],
    url: () => "/news",
  },
  {
    entity: "notices",
    label: "Notices",
    titleFields: ["title"],
    bodyFields: ["notice_date"],
    url: () => "/notices",
  },
  {
    entity: "events",
    label: "Calendar events",
    titleFields: ["title"],
    bodyFields: ["event_time", "cat"],
    url: () => "/calendar",
  },
  {
    entity: "programs",
    label: "Education programmes",
    titleFields: ["label"],
    bodyFields: ["level", "description"],
    url: (r) => r?.href || "/",
  },
  {
    entity: "districts",
    label: "Districts",
    titleFields: ["name"],
    bodyFields: ["capital", "type", "students"],
    url: (r) => `/districts/${r?.id ?? r?.name ?? ""}`,
  },
  {
    entity: "schools",
    label: "Schools",
    titleFields: ["name"],
    bodyFields: ["district", "type", "level", "location"],
    url: (r) => `/schools/${r?.id ?? ""}`,
  },
  {
    entity: "downloads",
    label: "Forms and downloads",
    titleFields: ["name"],
    bodyFields: ["description", "category", "type"],
    url: () => "/downloads",
  },
  {
    entity: "selections_grade9",
    label: "Grade 9 selections",
    titleFields: ["school"],
    bodyFields: ["district", "type", "stream"],
    url: () => "/selections",
  },
  {
    entity: "selections_grade11",
    label: "Grade 11 selections",
    titleFields: ["school"],
    bodyFields: ["district", "type", "streams_json"],
    url: () => "/selections",
  },
  {
    entity: "leadership",
    label: "Leadership",
    titleFields: ["name"],
    bodyFields: ["title", "bio"],
    url: () => "/about",
  },
  {
    entity: "partners",
    label: "Partners",
    titleFields: ["name"],
    bodyFields: [],
    url: () => "/",
  },
  {
    entity: "quick_links",
    label: "Quick links",
    titleFields: ["label"],
    bodyFields: ["description"],
    url: (r) => r?.href || "/",
  },
  {
    entity: "basic_curriculum",
    label: "Basic Education curriculum",
    titleFields: ["area"],
    bodyFields: ["grades", "desc"],
    url: () => "/basic#curriculum",
  },
  {
    entity: "basic_initiatives",
    label: "Basic Education initiatives",
    titleFields: ["title"],
    bodyFields: ["desc", "status"],
    url: () => "/basic",
  },
  {
    entity: "basic_faq",
    label: "Basic Education questions",
    titleFields: ["q"],
    bodyFields: ["a"],
    url: () => "/basic",
  },
  {
    entity: "vet_centres",
    label: "VET centres",
    titleFields: ["name"],
    bodyFields: ["district", "status", "programs"],
    url: () => "/vet#centres",
  },
  {
    entity: "vet_programs",
    label: "VET programmes",
    titleFields: ["name"],
    bodyFields: ["level", "duration", "trades"],
    url: () => "/vet",
  },
  {
    entity: "vet_enrolment_steps",
    label: "VET enrolment",
    titleFields: ["title", "step"],
    bodyFields: ["desc"],
    url: () => "/vet#enrolment",
  },
  {
    entity: "fode_centres",
    label: "FODE centres",
    titleFields: ["name"],
    bodyFields: ["district", "centre_type", "facilities"],
    url: () => "/fode#centres",
  },
  {
    entity: "fode_programs",
    label: "FODE programmes",
    titleFields: ["name"],
    bodyFields: ["level", "duration", "subjects", "target"],
    url: () => "/fode",
  },
  {
    entity: "fode_enrolment_steps",
    label: "FODE enrolment",
    titleFields: ["title", "step"],
    bodyFields: ["desc"],
    url: () => "/fode#enrolment",
  },
];

export type SearchHit = {
  group: string;
  title: string;
  snippet: string;
  url: string;
};

/**
 * Every word in the query has to appear somewhere in the row. Requiring all of
 * them is what makes "grade 9 selections" narrow rather than matching anything
 * with a "9" in it, and it is the behaviour people expect from a site search.
 */
export function searchRows(
  group: SearchGroup,
  rows: any[],
  query: string,
  limit = 8,
): SearchHit[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return [];

  const hits: SearchHit[] = [];
  for (const row of rows) {
    const haystack = searchableText(row).toLowerCase();
    if (!haystack) continue;
    if (!words.every((w) => haystack.includes(w))) continue;
    const title = pick(row, group.titleFields) || pick(row, group.bodyFields);
    if (!title) continue;
    const snippet = pick(row, group.bodyFields);
    hits.push({
      group: group.label,
      title,
      snippet: snippet && snippet !== title ? snippet : "",
      url: group.url(row) || "/",
    });
    if (hits.length >= limit) break;
  }
  return hits;
}
