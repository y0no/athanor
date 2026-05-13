const TAG_REGEX = /\s*\[([a-z]+)\]\s*$/;

export function parseTrailingTags(title: string): { cleanTitle: string; tags: string[] } {
  let clean = title;
  const tags: string[] = [];
  while (TAG_REGEX.test(clean)) {
    const match = clean.match(TAG_REGEX)!;
    tags.unshift(match[1]);
    clean = clean.replace(TAG_REGEX, "");
  }
  return { cleanTitle: clean.trim(), tags };
}

const TAG_GROUPS: Record<string, "danger" | "warning" | "info" | "neutral"> = {
  exp: "danger",
  mal: "danger",
  ics: "warning",
  social: "warning",
  net: "info",
  cloud: "info",
  sys: "info",
  app: "neutral",
};

export function tagGroup(tag: string): "danger" | "warning" | "info" | "neutral" {
  return TAG_GROUPS[tag] ?? "neutral";
}
