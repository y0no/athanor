interface MomentumMeta {
  label: string;
  glyph: string;
  color: string;
}

const MOMENTUM: Record<string, MomentumMeta> = {
  montant: { label: "Montant", glyph: "▲", color: "#00c758" },
  nouveau: { label: "Nouveau", glyph: "✦", color: "#d4af37" },
  stable: { label: "Stable", glyph: "■", color: "#9aa6b6" },
  déclin: { label: "Déclin", glyph: "▼", color: "#fb2c36" },
};

export function momentumMeta(momentum: string): MomentumMeta {
  return MOMENTUM[momentum] ?? { label: momentum, glyph: "·", color: "#9aa6b6" };
}
