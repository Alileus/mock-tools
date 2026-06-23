// Single source of truth for site + tool metadata.
// Imported by Astro pages/layout and by scripts/gen-og.mjs.

export const SITE = "https://mock.alile.us";
export const SITE_NAME = "mock.alile.us";

// KSA fixtures: one entry per tab/route under /ksa/<key>.
export const KSA_TABS = [
  {
    key: "id",
    label: "National ID",
    title: "Saudi National ID Generator — Luhn-valid test numbers",
    description:
      "Generate format-valid Saudi National ID / Iqama numbers (10 digits, lead 1 = citizen, 2 = resident) with a correct Luhn mod-10 check digit. Fake, sandbox-only test data.",
    ogTitle: "Saudi National ID Generator",
    ogSubtitle: "Luhn-valid · citizen & resident · sandbox test IDs",
    keywords: "saudi national id generator, iqama number test data, luhn check digit, fake KSA id",
  },
  {
    key: "iban",
    label: "IBAN",
    title: "Saudi IBAN Generator — MOD-97 valid test IBANs",
    description:
      "Generate format-valid Saudi (SA) IBANs with a correct ISO 7064 MOD-97 checksum and real SAMA bank codes, plus international bank branches in KSA. Fake, sandbox-only test data.",
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
    keywords: "saudi mobile number generator, KSA phone test data, E.164 +966, STC Mobily Zain prefix",
  },
];

export const KSA_BY_KEY = Object.fromEntries(KSA_TABS.map((t) => [t.key, t]));
export const DEFAULT_KSA_TAB = "id";

// Hub / home metadata.
export const HUB = {
  title: "mock.alile.us — format-valid fake test fixtures",
  description:
    "Sandbox utilities that generate format-valid but fake test fixtures — Saudi National IDs, IBANs, CR/Unified numbers, and mobile numbers. For testing only.",
  ogTitle: "mock.alile.us",
  ogSubtitle: "Format-valid fake test fixtures for developers",
};
