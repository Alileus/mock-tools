// Generates per-page Open Graph cards (1200x630 PNG) into public/og/.
// Run locally:  node scripts/gen-og.mjs
// Output is committed as static assets — NOT part of the Vercel build.

import fs from "node:fs";
import path from "node:path";
import satori from "satori";
import { html } from "satori-html";
import { Resvg } from "@resvg/resvg-js";
import { KSA_TABS, HUB, TOOLS } from "../src/data/tools.mjs";

const OUT_DIR = path.resolve("public/og");
const FONTS = new URL("../node_modules/@fontsource/ibm-plex-mono/files/", import.meta.url);

const fonts = [
  { name: "IBM Plex Mono", data: fs.readFileSync(new URL("ibm-plex-mono-latin-400-normal.woff", FONTS)), weight: 400, style: "normal" },
  { name: "IBM Plex Mono", data: fs.readFileSync(new URL("ibm-plex-mono-latin-700-normal.woff", FONTS)), weight: 700, style: "normal" },
];

const C = {
  bg: "#0f1115",
  txt: "#e6e8eb",
  dim: "#8b919c",
  faint: "#5a616c",
  line: "#2c313b",
  green: "#16a34a",
};

const chip = (label, active) => `
  <div style="display:flex;padding:9px 18px;margin-right:12px;border-radius:10px;
              border:1px solid ${active ? C.green : C.line};font-size:22px;
              color:${active ? C.txt : C.dim};">${label}</div>`;

function card({ title, subtitle, chips }) {
  return html(`
    <div style="display:flex;flex-direction:column;justify-content:space-between;
                width:1200px;height:630px;background:${C.bg};padding:72px;font-family:IBM Plex Mono;">
      <div style="display:flex;flex-direction:column;">
        <div style="display:flex;height:8px;width:300px;border-radius:8px;
                    background:linear-gradient(90deg,${C.green},#60a5fa 70%,rgba(96,165,250,0));"></div>
        <div style="display:flex;margin-top:30px;font-size:26px;letter-spacing:7px;color:${C.faint};">
          MOCK.ALILE.US</div>
      </div>
      <div style="display:flex;flex-direction:column;">
        <div style="display:flex;font-size:66px;font-weight:700;color:${C.txt};line-height:1.12;">${title}</div>
        <div style="display:flex;margin-top:26px;font-size:30px;color:${C.dim};line-height:1.3;">${subtitle}</div>
      </div>
      <div style="display:flex;align-items:center;justify-content:space-between;">
        <div style="display:flex;">${chips}</div>
        <div style="display:flex;font-size:20px;color:${C.faint};">built for testing</div>
      </div>
    </div>`);
}

async function render(name, markup) {
  const svg = await satori(markup, { width: 1200, height: 630, fonts });
  const png = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } }).render().asPng();
  fs.writeFileSync(path.join(OUT_DIR, `${name}.png`), png);
  console.log("wrote", `public/og/${name}.png`);
}

fs.mkdirSync(OUT_DIR, { recursive: true });

const allChips = (activeKey) => KSA_TABS.map((t) => chip(t.label, t.key === activeKey)).join("");

// Home card
await render("home", card({ title: HUB.ogTitle, subtitle: HUB.ogSubtitle, chips: TOOLS.map((tool) => chip(tool.navLabel, false)).join("") }));

// Per-tab cards
for (const t of KSA_TABS) {
  await render(t.key, card({ title: t.ogTitle, subtitle: t.ogSubtitle, chips: allChips(t.key) }));
}

console.log("done");
