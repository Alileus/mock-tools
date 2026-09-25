// @ts-check
import { defineConfig } from "astro/config";
import { readFileSync } from "node:fs";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import { SA_TABS, DEFAULT_SA_TAB } from "./src/data/tools.mjs";

import tailwindcss from "@tailwindcss/vite";

/** @type {{headers: {source: string, headers: {key: string, value: string}[]}[]}} */
const deployment = JSON.parse(readFileSync(new URL("./vercel.json", import.meta.url), "utf8"));

// https://astro.build/config
export default defineConfig({
  site: "https://mock.alile.us",
  integrations: [sitemap(), react()],
  // Preview the same security policy as production; development needs Vite's scripts.
  server: {
    headers: process.argv.includes("preview")
      ? Object.fromEntries(deployment.headers[0].headers.map(({ key, value }) => [key, value]))
      : {},
  },
  build: { inlineStylesheets: "never" },
  redirects: {
    "/sa": `/sa/${DEFAULT_SA_TAB}`,
    "/ksa": `/sa/${DEFAULT_SA_TAB}`,
    ...Object.fromEntries(SA_TABS.map(({ key }) => [`/ksa/${key}`, `/sa/${key}`])),
  },
  vite: {
    // Keep executable scripts external so the CSP can forbid inline JavaScript.
    build: { assetsInlineLimit: 0 },
    plugins: [tailwindcss()],
  },
});
