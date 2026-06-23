// Renders PNG icon variants from public/favicon.svg.
// Run locally:  node scripts/gen-favicon.mjs

import fs from "node:fs";
import path from "node:path";
import { Resvg } from "@resvg/resvg-js";

const svg = fs.readFileSync(path.resolve("public/favicon.svg"), "utf8");

const sizes = [
  { name: "apple-touch-icon.png", size: 180 },
  { name: "favicon-32x32.png", size: 32 },
];

for (const { name, size } of sizes) {
  const png = new Resvg(svg, { fitTo: { mode: "width", value: size } }).render().asPng();
  fs.writeFileSync(path.resolve("public", name), png);
  console.log("wrote", `public/${name}`);
}
