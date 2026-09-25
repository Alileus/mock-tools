import test from "node:test";
import assert from "node:assert/strict";
import { checkHtml } from "../scripts/lib/check-html.mjs";

test("the build policy accepts local scripts and JSON data without treating text as HTML", () => {
  const html = `<script src='/_astro/app.js'></script ><script type="application/ld+json">{"description":" onclick=example"}</script>`;
  assert.doesNotThrow(() => checkHtml(html, "example.html"));
});

test("the build policy rejects inline scripts with browser-valid end-tag variations", () => {
  for (const end of ["</script>", "</script >", "</ScRiPt\n>", "</script ignored>"]) {
    assert.throws(() => checkHtml(`<script>alert(1)${end}`, "bad.html"), /local bundled files/);
  }
  assert.throws(() => checkHtml('<script src="/_astro/app.js">alert(1)</script>', "bad.html"), /inline JavaScript/);
  assert.throws(() => checkHtml('<script src="https://example.test/app.js"></script>', "bad.html"), /local bundled files/);
});

test("the build policy sees unquoted event handlers, templates, and malformed structured data", () => {
  assert.throws(() => checkHtml('<button ONCLICK=alert(1)>Click</button>', "bad.html"), /inline event handlers/);
  assert.throws(() => checkHtml('<template><script>alert(1)</script></template>', "bad.html"), /local bundled files/);
  assert.throws(() => checkHtml('<script type="application/ld+json">{broken}</script>', "bad.html"), SyntaxError);
});
