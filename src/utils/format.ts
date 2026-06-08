const MONTHS_FR = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre",
];

export function formatDateLong(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  return `${d} ${MONTHS_FR[m - 1]} ${y}`;
}

// "2026-06" -> "Juin 2026"
export function formatMonthYear(monthKey: string): string {
  const [y, m] = monthKey.split("-").map(Number);
  const name = MONTHS_FR[m - 1];
  return `${name.charAt(0).toUpperCase()}${name.slice(1)} ${y}`;
}

export const WEEKDAYS_FR = ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"];

// Build a Monday-first calendar grid for a "YYYY-MM" key.
// Returns rows of 7 cells; cells before the 1st / after the last day are null.
export function monthCalendar(monthKey: string): (number | null)[][] {
  const [y, m] = monthKey.split("-").map(Number);
  const daysInMonth = new Date(Date.UTC(y, m, 0)).getUTCDate();
  // getUTCDay: 0=Sun..6=Sat -> shift so Monday=0
  const firstWeekday = (new Date(Date.UTC(y, m - 1, 1)).getUTCDay() + 6) % 7;

  const cells: (number | null)[] = Array(firstWeekday).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const rows: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
  return rows;
}

