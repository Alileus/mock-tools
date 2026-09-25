// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import { SA_TABS, DEFAULT_SA_TAB } from "./src/data/tools.mjs";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://mock.alile.us",
  integrations: [sitemap(), react()],
  redirects: {
    "/sa": `/sa/${DEFAULT_SA_TAB}`,
    "/ksa": `/sa/${DEFAULT_SA_TAB}`,
    ...Object.fromEntries(SA_TABS.map(({ key }) => [`/ksa/${key}`, `/sa/${key}`])),
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
