import test from "node:test";
import assert from "node:assert/strict";
import { luhnCheckDigit, isSaudiId, createSaudiIban, isSaudiIban } from "../src/lib/checksums.mjs";

test("Luhn matches known check digits", () => {
  assert.equal(luhnCheckDigit("7992739871"), 3);
  assert.equal(luhnCheckDigit("100000000"), 8);
  assert.equal(luhnCheckDigit("200000000"), 6);
  assert.throws(() => luhnCheckDigit("12x"), TypeError);
  assert.throws(() => luhnCheckDigit(""), TypeError);
});

test("Saudi IDs require the prefix, length, and correct check digit", () => {
  assert.ok(isSaudiId("1000000008"));
  assert.ok(isSaudiId("2000000006"));
  for (const value of ["1000000009", "3000000004", "100000008", "10000000080", "abcdefghij"]) assert.equal(isSaudiId(value), false);
});

test("SA IBAN matches a reference MOD-97 example", () => {
  assert.equal(createSaudiIban("80", "000000608010167519"), "SA0380000000608010167519");
  assert.ok(isSaudiIban("SA0380000000608010167519"));
  assert.equal(isSaudiIban("SA0480000000608010167519"), false);
  assert.equal(isSaudiIban("GB0380000000608010167519"), false);
  assert.equal(isSaudiIban("SA03"), false);
});

test("IBANs preserve leading zeroes and pass independent bigint validation", () => {
  for (const bank of ["01", "05", "80", "98"]) {
    for (const account of ["000000000000000000", "000000000000000001", "999999999999999999"]) {
      const value = createSaudiIban(bank, account);
      assert.equal(value.length, 24);
      assert.equal(value.slice(4), bank + account);
      const rearranged = (value.slice(4) + value.slice(0, 4)).replace(/[A-Z]/g, (char) => String(char.charCodeAt(0) - 55));
      assert.equal(BigInt(rearranged) % 97n, 1n);
    }
  }
});

test("invalid IBAN inputs are rejected before generating", () => {
  for (const [bank, account] of [["1", "0".repeat(18)], ["AA", "0".repeat(18)], ["01", "123"], ["01", "a".repeat(18)]]) {
    assert.throws(() => createSaudiIban(bank, account), TypeError);
  }
});
