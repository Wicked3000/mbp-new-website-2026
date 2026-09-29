export type StatItem = {
  value: React.ReactNode;
  label: React.ReactNode;
  sub?: React.ReactNode;
};

/*
 * The figures strip, shared by the home page and the About page.
 *
 * These two were separate implementations that had already drifted: the home
 * page's divided four-column row, and the About page's six-column grid. When
 * the About page was pointed at the stats table it began rendering four items in
 * a grid sized for six, so the last two columns sat empty and the numbers looked
 * pushed to the left. Two copies of the same block is how that happened, so
 * there is now one.
 */

// Tailwind needs the class name in the source, so the count-to-class mapping is
// a lookup rather than an interpolation. The breakpoint prefix is part of the
// value: the row is two-up on a phone whatever the count, and only widens on a
// large screen. Returning a bare "grid-cols-4" would override the two-up base at
// every width and leave one figure per line on a phone.
const COLUMNS: Record<number, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
  6: "lg:grid-cols-6",
};

/**
 * The column count follows the number of figures, so adding or removing one in
 * the admin does not leave the row half empty or overflowing.
 */
function columnsFor(count: number) {
  if (COLUMNS[count]) return COLUMNS[count];
  // More figures than the table covers, or none at all: wrap onto more rows
  // rather than squeezing them.
  return count > 6 ? "sm:grid-cols-3 lg:grid-cols-6" : "lg:grid-cols-4";
}

export function StatsRow({ items, className = "" }: { items: StatItem[]; className?: string }) {
  return (
    <div
      // Marks the strip so a test can find it on either page and compare the
      // two, rather than guessing at a class name.
      data-stats-row=""
      className={`grid grid-cols-2 ${columnsFor(items.length)} gap-8 text-center divide-x-0 lg:divide-x divide-white/10 ${className}`}
    >
      {items.map((s, i) => (
        <div key={i} className="py-2">
          <div
            className="text-[34px] sm:text-[42px] font-bold text-[#C9A84C] leading-none tracking-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {s.value}
          </div>
          <div className="text-white font-bold mt-2 tracking-wide">{s.label}</div>
          {s.sub ? (
            <div className="text-[#7fb3d1] text-xs font-semibold uppercase tracking-widest mt-1">
              {s.sub}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
