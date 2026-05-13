const CATEGORY_COLORS: Record<string, string> = {
  ia: "#fb923c",
  infosec: "#ef4444",
  devops: "#22d3ee",
  diy: "#4ade80",
  societe: "#a78bfa",
};

export function categoryAccent(slug: string): string {
  return CATEGORY_COLORS[slug] ?? "#fb923c";
}
