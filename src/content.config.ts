import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

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
  tagline: z.string().default(""),
  topics: z.array(topicSchema),
});

const appendixItemSchema = z.object({
  url: z.string().url(),
  title: z.string(),
  note: z.string().default(""),
});

const windowSchema = z.object({
  from: z.string(),
  to: z.string(),
  count: z.string(),
});

const digestSchema = z.object({
  date: z.string(),
  title_tag: z.string().default(""),
  headline: z.string(),
  window: windowSchema,
  alert: z.string().default(""),
  categories: z.array(categorySchema),
  appendix: z.array(appendixItemSchema).default([]),
  footer: z.string().default(""),
});

const digests = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/digests" }),
  schema: z.preprocess(
    (input) => (Array.isArray(input) ? input[0] : input),
    digestSchema,
  ),
});

export const collections = { digests };
