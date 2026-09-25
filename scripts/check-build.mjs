import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { checkHtml } from "./lib/check-html.mjs";

// Catch a build change that would silently break pages under script-src 'self'.
const files = (await readdir("dist", { recursive: true })).filter((file) => file.endsWith(".html"));
assert.ok(files.length > 0, "No built pages found.");
for (const file of files) {
  const html = await readFile(join("dist", file), "utf8");
  checkHtml(html, file);
}
console.log(`Checked CSP-compatible scripts in ${files.length} built pages.`);
