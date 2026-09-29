export const MAIN_NAV = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Basic Education", href: "/basic" },
  { label: "Post Primary", href: "/post" },
  { label: "VET", href: "/vet" },
  { label: "FODE", href: "/fode" },
  { label: "School Calendar", href: "/calendar" },
  { label: "Contact", href: "/contact" },
];

// Quick-jump entries for the header search dropdown. Each one points at a real
// page on this site, so a suggestion click always lands somewhere useful.
// Free-text searches go to /news?q= instead.
//
// `keywords` are extra words that should find the entry. They matter because
// the filter is a substring match on the label: the calendar page calls itself a
// calendar and its banner reads "Academic Calendar", so an entry labelled
// "Term Dates" alone was unreachable by the words on the page itself.
export type SearchSuggestion = {
  label: string;
  to: string;
  keywords?: string[];
};

export const SEARCH_SUGGESTIONS: SearchSuggestion[] = [
  { label: "School Calendar", to: "/calendar", keywords: ["calendar", "term", "dates", "academic", "events", "schedule"] },
  { label: "School Directory", to: "/districts", keywords: ["schools", "district", "directory"] },
  { label: "Grade 8 Exam Timetable", to: "/notices", keywords: ["exam", "timetable", "grade 8"] },
  { label: "Teacher Relief Grants", to: "/notices", keywords: ["grants", "relief", "teacher"] },
  { label: "VET Centres Alotau", to: "/vet#centres", keywords: ["vet", "centres", "alotau"] },
  { label: "FODE Enrolment", to: "/fode#centres", keywords: ["fode", "enrolment", "distance"] },
  { label: "Selection Lists 2026", to: "/selections", keywords: ["selection", "selections", "grade 9", "grade 11"] },
  { label: "Contact Helpdesk", to: "/contact", keywords: ["contact", "help", "helpdesk"] },
];
