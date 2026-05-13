import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function parseDigestDate(date: string): Date {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
}

function renderContent(digest: any): string {
  const intro = `<p><em>${esc(digest.window.count)}</em> distillés sur la fenêtre ${esc(digest.window.from)} → ${esc(digest.window.to)}.</p>`;
  const sections = digest.categories
    .map((c: any) => {
      const items = c.topics.map((t: any) => `<li>${esc(t.title)}</li>`).join("");
      return `<h3>${esc(c.name)}</h3><ul>${items}</ul>`;
    })
    .join("");
  return intro + sections;
}

export async function GET(context: APIContext) {
  const all = await getCollection("digests");
  const sorted = all.sort((a, b) => b.data.date.localeCompare(a.data.date));
  const base = import.meta.env.BASE_URL;

  return rss({
    title: "Athanor",
    description: "Distillation quotidienne de veille technique.",
    site: new URL(base, context.site!).href,
    items: sorted.map((entry) => {
      const d = entry.data;
      const categoryNames = d.categories.map((c: any) => c.name);
      return {
        title: d.headline,
        link: `${base}digest/${d.date}/`,
        pubDate: parseDigestDate(d.date),
        description: `${d.window.count} · ${categoryNames.join(" · ")}`,
        content: renderContent(d),
        categories: categoryNames,
      };
    }),
  });
}
