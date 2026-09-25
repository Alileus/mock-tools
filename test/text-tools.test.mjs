import test from "node:test";
import assert from "node:assert/strict";
import { MAX_TEXT_LENGTH, encodeBase64, decodeBase64, formatJson } from "../src/lib/text-tools.mjs";

test("Base64 matches UTF-8 reference encodings and round-trips Unicode", () => {
  for (const input of ["", "f", "fo", "foo", "Hello, world!", "مرحبا ☕ 🥊", "\uFEFFtext", "a\0b\n", "x".repeat(40_000)]) {
    const expected = Buffer.from(input, "utf8").toString("base64");
    assert.equal(encodeBase64(input), expected);
    assert.equal(decodeBase64(expected), input);
  }
  assert.equal(decodeBase64(" Z m 9 v \r\n"), "foo");
  assert.equal(decodeBase64("Zg"), "f");
  assert.equal(decodeBase64("Zm8"), "fo");
});

test("Base64 rejects malformed input, noncanonical pad bits, binary data, and broken Unicode", () => {
  for (const input of ["A", "=", "Zg=", "Z===", "Zm=v", "Zm9v!", "Zm9v====", "Zh==", "Zm9=", "SGVsbG8_"]) {
    assert.throws(() => decodeBase64(input), /valid standard Base64/);
  }
  assert.throws(() => decodeBase64("/w=="), /not valid UTF-8/);
  assert.throws(() => encodeBase64("\ud800"), /incomplete Unicode/);
});

test("JSON pretty-print handles nested arrays, empty containers, and escaped text", () => {
  // Use a valid serializer for the escaped-string fixture rather than hand-escaped JSON.
  const input = JSON.stringify({ items: [1, true, null, {}, []], text: 'a "quoted" {word}:, \n' });
  const expected = JSON.stringify(JSON.parse(input), null, 2);
  assert.equal(formatJson(input), expected);
  assert.equal(formatJson(expected, "minify"), input);
  for (const primitive of ['"hello"', "123", "-0", "true", "false", "null", "{}", "[]"]) {
    assert.equal(formatJson(` \n${primitive}\t `), primitive);
  }
});

test("JSON keeps large numbers, duplicate keys, original escapes, and key order", () => {
  const input = '{ "z":9007199254740993, "a":1.2300e+90, "a":-0, "big":1e309, "10":1, "2":2, "text":"\\u0061" }';
  const compact = '{"z":9007199254740993,"a":1.2300e+90,"a":-0,"big":1e309,"10":1,"2":2,"text":"\\u0061"}';
  assert.equal(formatJson(input, "minify"), compact);
  assert.equal(formatJson(formatJson(input), "minify"), compact);
});

test("invalid JSON, oversized text, and excessive pretty-print depth fail clearly", () => {
  for (const input of ["", "{", '{"a":1,}', "[1,]", '{"a":undefined}', "NaN", "01", "// comment\n{}"]) {
    assert.throws(() => formatJson(input));
  }
  assert.throws(() => formatJson("{}", "yaml"), /Choose pretty or minify/);
  for (const convert of [encodeBase64, decodeBase64, formatJson]) {
    assert.throws(() => convert("x".repeat(MAX_TEXT_LENGTH + 1)), /at most 1,000,000/);
    assert.throws(() => convert(null), /Enter text/);
  }
  const deeplyNested = "[".repeat(101) + "0" + "]".repeat(101);
  assert.throws(() => formatJson(deeplyNested), /too deeply nested/);
  assert.equal(formatJson(deeplyNested, "minify"), deeplyNested);
  const expanded = "[".repeat(99) + Array(26_000).fill("0").join(",") + "]".repeat(99);
  assert.throws(() => formatJson(expanded), /output is too large/);
});
