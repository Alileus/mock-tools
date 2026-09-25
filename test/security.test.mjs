import test from "node:test";
import assert from "node:assert/strict";
import { serializeJsonLd } from "../src/lib/security.mjs";

test("structured data cannot close its script tag and still round-trips as JSON", () => {
  const data = { description: '</script><script>alert("test")</script>', name: "Ali <3 ☕", nested: ["<!--", "</ScRiPt>"] };
  const serialized = serializeJsonLd(data);
  assert.ok(!serialized.includes("<"));
  assert.deepEqual(JSON.parse(serialized), data);
});
