import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://y0no.github.io",
  base: "/athanor/",
  output: "static",
  build: {
    format: "directory",
  },
});
