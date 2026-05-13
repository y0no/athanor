import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://digest.example.com",
  output: "static",
  build: {
    format: "directory",
  },
});
