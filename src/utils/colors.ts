const CATEGORY_COLORS: Record<string, string> = {
  ia: "#d4af37",       // gold — transmutation, magnum opus
  infosec: "#fb2c36",  // red — alert, Ether red
  devops: "#22d3ee",   // cyan — flux, pipelines
  diy: "#00c758",      // green — hack/build, Ether green
  societe: "#fbbf24",  // amber — civitas, signal
};

export function categoryAccent(slug: string): string {
  return CATEGORY_COLORS[slug] ?? "#8b5cf6";
}
