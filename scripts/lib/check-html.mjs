import assert from "node:assert/strict";
import { parse } from "parse5";

/** Check the browser's parsed HTML, including alternative quoting and end-tag syntax.
 * @param {string} html
 * @param {string} filename
 */
export function checkHtml(html, filename) {
  /** @type {import('parse5').DefaultTreeAdapterMap['node'][]} */
  const pending = [parse(html)];
  while (pending.length) {
    const node = pending.pop();
    if (!node) continue;
    if ("attrs" in node) {
      const attributes = new Map(node.attrs.map(({ name, value }) => [name, value]));
      for (const name of attributes.keys()) {
        assert.ok(!/^on[a-z]+$/.test(name), `${filename}: use a bundled script instead of inline event handlers.`);
      }
      if (node.tagName === "script") {
        const body = node.childNodes.map((child) => "value" in child ? child.value : "").join("");
        if (attributes.get("type") === "application/ld+json") {
          JSON.parse(body);
        } else {
          assert.ok(attributes.get("src")?.startsWith("/_astro/"), `${filename}: executable scripts must be local bundled files.`);
          assert.equal(body.trim(), "", `${filename}: inline JavaScript is blocked by the site's security policy.`);
        }
      }
    }
    if ("childNodes" in node) pending.push(...node.childNodes);
    if ("content" in node) pending.push(node.content);
  }
}
