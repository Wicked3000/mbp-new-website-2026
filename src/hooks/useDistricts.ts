import { useEntity } from "./useDynamic";

/**
 * The districts the site actually holds, and the figures derived from them.
 *
 * Several pages state how many districts the Division covers. That number used
 * to be typed into each page by hand, which let it drift away from the districts
 * table: the site claimed 17 while holding four, and a visitor could count four
 * on the districts page and read 17 on the home page. Counting the rows is the
 * only version of this that cannot disagree with the list it sits next to.
 *
 * The fallback mirrors the seeded districts exactly, so the count is the same
 * whether the API answers or not. If the two ever diverge, `npm run verify`
 * fails on it rather than the site quietly changing its number.
 */
export const DISTRICTS_FALLBACK = [
  { name: "Alotau", schools: 42, type: "Urban" },
  { name: "Samarai-Murua", schools: 22, type: "Island" },
  { name: "Esa'ala", schools: 15, type: "Island" },
  { name: "Kiriwina-Goodenough", schools: 18, type: "Island" },
];

export function useDistricts() {
  return useEntity("districts", DISTRICTS_FALLBACK as any);
}

/** How many districts the site holds. Never a hand-typed figure. */
export function useDistrictCount() {
  const { data } = useDistricts();
  return data.length;
}
