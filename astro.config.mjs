import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://veille.y0no.fr",
  output: "static",
  build: {
    format: "directory",
  },
});
