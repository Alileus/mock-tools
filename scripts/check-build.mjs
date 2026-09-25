import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

// Catch a build change that would silently break pages under script-src 'self'.
const files = (await readdir("dist", { recursive: true })).filter((file) => file.endsWith(".html"));
assert.ok(files.length > 0, "No built pages found.");
for (const file of files) {
  const html = await readFile(join("dist", file), "utf8");
  for (const [, attributes, body] of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (/\btype="application\/ld\+json"/.test(attributes)) {
      JSON.parse(body);
      continue;
    }
    const source = attributes.match(/\bsrc="([^"]+)"/)?.[1];
    assert.ok(source?.startsWith("/_astro/"), `${file}: executable scripts must be local bundled files.`);
    assert.equal(body.trim(), "", `${file}: inline JavaScript is blocked by the site's security policy.`);
  }
  assert.doesNotMatch(html, /\son\w+\s*=/i, `${file}: use a bundled script instead of inline event handlers.`);
}
console.log(`Checked CSP-compatible scripts in ${files.length} built pages.`);
