// Single source of truth for site + tool metadata.
// Imported by Astro pages/layout and by scripts/gen-og.mjs.

export const SITE = "https://mock.alile.us";
export const SITE_NAME = "mock.alile.us";
export const REPOSITORY = "https://github.com/alileus/mock-tools";

export const TOOLS = [
  { key: "uuid", href: "/uuid", name: "Bulk UUIDs", navLabel: "UUIDs", category: "General", blurb: "Generate UUID v4 values in bulk. Copy or download as text or JSON." },
  { key: "records", href: "/records", name: "Sample records", navLabel: "Records", category: "General", blurb: "Repeatable user and product data for tests and demos. Export JSON or CSV." },
  { key: "sa", href: "/sa/id", name: "Saudi fixtures", navLabel: "Saudi fixtures", category: "Regional", blurb: "National IDs, IBANs, CR numbers, and mobile numbers for Saudi format checks." },
];

// Regional routes use lowercase ISO 3166-1 alpha-2 country codes.
// Saudi fixtures: one entry per tab/route under /sa/<key>.
export const SA_TABS = [
  {
    key: "id",
    label: "National ID",
    title: "Saudi National ID Generator — Luhn-valid test numbers",
    description:
      "Generate format-valid Saudi National ID / Iqama numbers (10 digits, lead 1 = citizen, 2 = resident) with a correct Luhn mod-10 check digit. Fake, sandbox-only test data.",
    ogTitle: "Saudi National ID Generator",
    ogSubtitle: "Luhn-valid · citizen & resident · sandbox test IDs",
    keywords: "saudi national id generator, iqama number test data, luhn check digit, fake SA id",
  },
  {
    key: "iban",
    label: "IBAN",
    title: "Saudi IBAN Generator — MOD-97 valid test IBANs",
    description:
      "Generate format-valid Saudi (SA) IBANs with a correct ISO 7064 MOD-97 checksum and real SAMA bank codes, plus international bank branches in SA. Fake, sandbox-only test data.",
    ogTitle: "Saudi IBAN Generator",
    ogSubtitle: "MOD-97 valid · SAMA bank codes · sandbox test IBANs",
    keywords: "saudi iban generator, SA iban test, mod-97 checksum, SAMA bank code, fake iban",
  },
  {
    key: "cr",
    label: "UNN / CR",
    title: "Saudi CR & Unified Number Generator — test fixtures",
    description:
      "Generate Saudi Commercial Registration (legacy CR) and Unified National Number (700-series) test values, shaped by length and city/chamber prefix. Fake, sandbox-only test data.",
    ogTitle: "Saudi CR / Unified Number Generator",
    ogSubtitle: "Legacy CR · 700-series unified no. · sandbox fixtures",
    keywords: "saudi CR number generator, unified national number, commercial registration test data",
  },
  {
    key: "phone",
    label: "Mobile",
    title: "Saudi Mobile Number Generator — E.164 test numbers",
    description:
      "Generate format-valid Saudi mobile numbers (9-digit NSN starting 5) in local 05X and E.164 +9665 formats, by operator prefix band. Fake, sandbox-only test data.",
    ogTitle: "Saudi Mobile Number Generator",
    ogSubtitle: "E.164 +9665 · local 05X · by operator · sandbox numbers",
    keywords: "saudi mobile number generator, SA phone test data, E.164 +966, STC Mobily Zain prefix",
  },
];

export const SA_BY_KEY = Object.fromEntries(SA_TABS.map((t) => [t.key, t]));
export const DEFAULT_SA_TAB = "id";

// Hub / home metadata.
export const HUB = {
  title: "mock.alile.us | Open source tools for test data",
  description:
    "Free, open source tools for test data. Generate UUIDs, sample JSON and CSV records, and Saudi fixtures in your browser.",
  ogTitle: "mock.alile.us",
  ogSubtitle: "Open source tools for test data",
};
