import test from "node:test";
import assert from "node:assert/strict";
import { validateCount, generateUuids, generateRecords, formatRecords, formatUuids, csvCell } from "../src/lib/fixtures.mjs";

test("counts include both limits and reject invalid values", () => {
  assert.equal(validateCount(1), 1);
  assert.equal(validateCount(1000), 1000);
  for (const count of [0, -1, 1.5, 1001, NaN, Infinity, "10", null]) {
    assert.throws(() => validateCount(count), RangeError);
    assert.throws(() => generateUuids(count), RangeError);
    assert.throws(() => generateRecords({ count, seed: "demo", preset: "users" }), RangeError);
  }
});

test("UUID batches contain distinct v4 UUIDs with the RFC variant", () => {
  const values = generateUuids(1000);
  assert.equal(values.length, 1000);
  assert.equal(new Set(values).size, 1000);
  for (const value of values) assert.match(value, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  assert.notDeepEqual(generateUuids(2), generateUuids(2));
});

test("UUID text and JSON preserve every value", () => {
  const values = generateUuids(3);
  assert.deepEqual(formatUuids(values, "text").split("\n"), values);
  assert.deepEqual(JSON.parse(formatUuids(values, "json")), values);
  assert.throws(() => formatUuids(values, "csv"), RangeError);
});

for (const preset of ["users", "products"]) {
  test(`${preset} are repeatable, seed-sensitive, and stable when a batch grows`, () => {
    const options = { count: 10, seed: "demo-☕", preset };
    const small = generateRecords(options);
    assert.deepEqual(small, generateRecords(options));
    assert.notDeepEqual(small, generateRecords({ ...options, seed: "other" }));
    const large = generateRecords({ ...options, count: 1000 });
    assert.equal(large.length, 1000);
    assert.deepEqual(small, large.slice(0, 10));
    assert.equal(new Set(large.map((row) => row.id)).size, 1000);
    assert.deepEqual(JSON.parse(formatRecords(small, "json")), small);
  });
}

test("user fixtures use unique reserved-domain addresses and valid timestamps", () => {
  const users = generateRecords({ count: 1000, seed: "users", preset: "users" });
  assert.equal(new Set(users.map((user) => user.email)).size, 1000);
  for (const user of users) {
    assert.match(user.email, /^[a-z]+\.[a-z]+\.\d+@example\.test$/);
    assert.ok(["member", "editor", "admin"].includes(user.role));
    assert.equal(typeof user.active, "boolean");
    assert.equal(new Date(user.created_at).toISOString(), user.created_at);
  }
});

test("product prices are integer cents and stock is nonnegative", () => {
  const products = generateRecords({ count: 1000, seed: "products", preset: "products" });
  assert.equal(new Set(products.map((product) => product.sku)).size, 1000);
  for (const product of products) {
    assert.ok(Number.isInteger(product.price_cents) && product.price_cents >= 100 && product.price_cents <= 20000);
    assert.ok(Number.isInteger(product.stock) && product.stock >= 0 && product.stock <= 100);
    assert.equal(product.currency, "USD");
  }
});

test("invalid seeds and unknown presets fail clearly", () => {
  for (const seed of ["", "   ", "x".repeat(81), null, 42]) {
    assert.throws(() => generateRecords({ count: 1, seed, preset: "users" }), RangeError);
  }
  assert.equal(generateRecords({ count: 1, seed: "x".repeat(80), preset: "users" }).length, 1);
  assert.throws(() => generateRecords({ count: 1, seed: "demo", preset: "unknown" }), RangeError);
});

test("CSV preserves commas, quotes, newlines, booleans, zero, and missing values", () => {
  assert.equal(csvCell('a,"b"\nc'), '"a,""b""\nc"');
  assert.equal(csvCell("a\rb"), '"a\rb"');
  const records = [{ name: 'A, "B"', active: false, count: 0, note: null }, { name: "Two\nlines", active: true, count: 2 }];
  assert.equal(formatRecords(records, "csv"), 'name,active,count,note\r\n"A, ""B""",false,0,\r\n"Two\nlines",true,2,');
  assert.equal(formatRecords([], "csv"), "");
  assert.equal(formatRecords([], "json"), "[]");
  assert.throws(() => formatRecords(records, "xml"), RangeError);
});
