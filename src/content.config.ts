import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Champs string optionnels émis par n8n : tolère null/undefined/clé absente
// et les normalise vers une chaîne par défaut (le .default() de Zod ne couvre
// que les clés absentes, pas un null explicite).
const optionalString = (fallback = "") =>
  z
    .string()
    .nullish()
    .transform((value) => value ?? fallback);

const sourceSchema = z.object({
  feed: z.string(),
  date: z.string(),
  url: z.string().url(),
  title: z.string(),
});

const topicSchema = z.object({
  title: z.string(),
  lede_html: z.string(),
  sources: z.array(sourceSchema),
});

const categorySchema = z.object({
  slug: z.string(),
  name: z.string(),
  tagline: optionalString(),
  topics: z.array(topicSchema),
});

const appendixItemSchema = z.object({
  url: z.string().url(),
  title: z.string(),
  note: optionalString(),
});

const windowSchema = z.object({
  from: z.string(),
  to: z.string(),
  count: z.string(),
});

const digestSchema = z.object({
  date: z.string(),
  title_tag: optionalString(),
  headline: z.string(),
  window: windowSchema,
  alert: optionalString(),
  categories: z.array(categorySchema),
  appendix: z.array(appendixItemSchema).default([]),
  footer: optionalString(),
});

const digests = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/digests" }),
  schema: z.preprocess(
    (input) => (Array.isArray(input) ? input[0] : input),
    digestSchema,
  ),
});

export const collections = { digests };
