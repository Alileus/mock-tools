// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://mock.alile.us",
  integrations: [sitemap()],
  redirects: {
    "/ksa": "/ksa/id",
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
