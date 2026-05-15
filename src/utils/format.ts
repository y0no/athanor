const MONTHS_FR = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre",
];

export function formatDateLong(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  return `${d} ${MONTHS_FR[m - 1]} ${y}`;
}

