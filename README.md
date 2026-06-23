# mock.alile.us

Internal sandbox utilities for generating **format-valid but fake** test fixtures.
Everything here is for testing only — never real identities, accounts, or numbers.
Keep off live lookups and production rails.

## Stack

- [Astro](https://astro.build) (static output) + [Tailwind CSS v4](https://tailwindcss.com)
- [Vercel Web Analytics](https://vercel.com/docs/analytics) — aggregate traffic + custom `track()` events
- Hosted on Vercel at **mock.alile.us**, production-only (no preview deploys)

## Tools

| Route  | Tool               | What it generates                                                          |
| ------ | ------------------ | -------------------------------------------------------------------------- |
| `/`    | Hub                | Landing page / tool index                                                  |
| `/ksa` | KSA Mock Fixtures  | National ID (Luhn), IBAN (MOD-97), UNN / Legacy CR, mobile numbers (E.164) |

## Adding a tool

1. Add a page at `src/pages/<tool>.astro` wrapped in `Layout`.
2. Add it to the `nav` array in `src/layouts/Layout.astro` and the `tools` array in `src/pages/index.astro`.
3. Track usage with `import { track } from "@vercel/analytics"` and `track("event_name", { ...props })`.

## Develop

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output -> dist/
npm run preview  # serve the build locally
```

## Analytics

Aggregate traffic and custom events appear in the Vercel dashboard under **Analytics**.
Custom events fired today:

- `generate` — `{ tool, subtype | region | bank | operator }`
- `tab_switch` — `{ tab }`
- `copy` — `{ kind }`

## Deploys

`vercel.json` restricts deployments to the `main` branch only — every push to `main`
is a production deploy, and no preview environments are created.
