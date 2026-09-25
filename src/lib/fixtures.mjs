export const MAX_COUNT = 1000;

/** @param {number} count */
export function validateCount(count) {
  if (!Number.isInteger(count) || count < 1 || count > MAX_COUNT) {
    throw new RangeError(`Choose a whole number from 1 to ${MAX_COUNT}.`);
  }
  return count;
}

/** @param {number} count */
export function generateUuids(count) {
  validateCount(count);
  return Array.from({ length: count }, () => crypto.randomUUID());
}

// Stable seeded randomness for repeatable fixtures, not passwords or tokens.
/** @param {string} seed */
function seededRandom(seed) {
  let state = 2166136261;
  for (const char of seed) {
    state = Math.imul(state ^ char.codePointAt(0), 16777619);
  }
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value ^= value + Math.imul(value ^ (value >>> 7), 61 | value);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

const FIRST_NAMES = ["Ali", "Maya", "Sam", "Nora", "Leo", "Amal", "Alex", "Lina"];
const LAST_NAMES = ["Reed", "Park", "Santos", "Khan", "Chen", "Hassan", "Silva", "Kim"];
const PRODUCTS = ["Notebook", "Desk lamp", "Coffee mug", "Canvas bag", "Water bottle", "Pen set"];
const COLORS = ["Blue", "Green", "Black", "White", "Orange", "Purple"];
export const RECORD_PRESETS = ["users", "products"];

/** @param {{count: number, seed: string, preset: string}} options */
export function generateRecords({ count, seed, preset }) {
  validateCount(count);
  if (typeof seed !== "string" || !seed.trim() || seed.length > 80) {
    throw new RangeError("Enter a seed between 1 and 80 characters.");
  }
  if (!RECORD_PRESETS.includes(preset)) throw new RangeError("Choose users or products.");
  const random = seededRandom(seed);
  /** @template T @param {T[]} values */
  const pick = (values) => values[Math.floor(random() * values.length)];
  return Array.from({ length: count }, (_, index) => {
    const id = index + 1;
    if (preset === "users") {
      const first = pick(FIRST_NAMES);
      const last = pick(LAST_NAMES);
      return {
        id,
        name: `${first} ${last}`,
        email: `${first}.${last}.${id}@example.test`.toLowerCase(),
        role: pick(["member", "editor", "admin"]),
        active: random() >= 0.2,
        created_at: new Date(Date.UTC(2024, 0, 1) + Math.floor(random() * 366) * 86400000).toISOString(),
      };
    }
    return {
      id,
      sku: `DEMO-${String(id).padStart(4, "0")}`,
      name: `${pick(COLORS)} ${pick(PRODUCTS)}`,
      price_cents: 100 + Math.floor(random() * 19901),
      currency: "USD",
      stock: Math.floor(random() * 101),
      active: random() >= 0.1,
    };
  });
}

/** @param {unknown} value */
export function csvCell(value) {
  const text = String(value ?? "");
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

/** @param {Record<string, unknown>[]} records @param {string} format */
export function formatRecords(records, format) {
  if (format === "json") return JSON.stringify(records, null, 2);
  if (format !== "csv") throw new RangeError("Choose JSON or CSV.");
  if (!records.length) return "";
  const keys = Object.keys(records[0]);
  return [keys.map(csvCell).join(","), ...records.map((record) => keys.map((key) => csvCell(record[key])).join(","))].join("\r\n");
}

/** @param {string[]} values @param {string} format */
export function formatUuids(values, format) {
  if (format === "json") return JSON.stringify(values, null, 2);
  if (format === "text") return values.join("\n");
  throw new RangeError("Choose text or JSON.");
}
