export const MAIN_NAV = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Basic Education", href: "/basic" },
  { label: "Post Primary", href: "/post" },
  { label: "VET", href: "/vet" },
  { label: "FODE", href: "/fode" },
  { label: "Contact", href: "/contact" },
];

// Quick-jump entries for the header search dropdown. Each one points at a real
// page on this site, so a suggestion click always lands somewhere useful.
// Free-text searches go to /news?q= instead.
export const SEARCH_SUGGESTIONS = [
  { label: "Term Dates", to: "/calendar" },
  { label: "School Directory", to: "/districts" },
  { label: "Grade 8 Exam Timetable", to: "/notices" },
  { label: "Teacher Relief Grants", to: "/notices" },
  { label: "VET Centres Alotau", to: "/vet#centres" },
  { label: "FODE Enrolment", to: "/fode#centres" },
  { label: "Selection Lists 2026", to: "/selections" },
  { label: "Contact Helpdesk", to: "/contact" },
];
