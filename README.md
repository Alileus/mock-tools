# mock.alile.us

Small, open source tools for the test data you need while building.

**[Use the tools](https://mock.alile.us)** · [Suggest a tool](https://github.com/alileus/mock-tools/issues/new/choose) · [Contribute](CONTRIBUTING.md)

This started with Saudi fixtures. It's now a home for useful generators from any country, plus the everyday data you need for forms, imports, and API tests. No account or API key needed.

## Tools

| Tool | What it does |
| --- | --- |
| [Bulk UUIDs](https://mock.alile.us/uuid/) | UUID v4 values, up to 1,000 at a time. Copy or download text or JSON. |
| [Sample records](https://mock.alile.us/records/) | Seeded user and product datasets. The same seed gives the same records. Export JSON or CSV. |
| [Saudi fixtures](https://mock.alile.us/sa/id/) | National ID / Iqama, IBAN, CR / unified numbers, and mobile numbers. |

Generators run in your browser. User fixtures use `example.test` email addresses. Regional identifiers match formats, but can overlap with real values. Use them in sandboxes, never for live identity checks, payments, calls, or messages. Some regional mappings are unverified and labeled in the tool.

Country tools use lowercase two-letter ISO 3166-1 alpha-2 codes in their routes, such as `/sa/id` for Saudi Arabia. Existing `/ksa` links redirect to `/sa`.

## Run locally

Use Node.js 24 LTS (`.nvmrc` is included), or Node.js 22.12+.

```sh
git clone https://github.com/alileus/mock-tools.git
cd mock-tools
npm ci
npm run dev
```

Open <http://localhost:4321>. There are no required environment variables or backend services.

```sh
npm run verify     # Type checks, tests, and production build
npm run preview    # Preview dist/ after building
```

## Add something useful

New generators, regional formats, better exports, bug fixes, and clearer docs are welcome. Small PRs are easier to review. For a larger tool, [open an idea](https://github.com/alileus/mock-tools/issues/new/choose) first so we can agree on the scope.

The [contribution guide](CONTRIBUTING.md) covers where code goes, how to test it, and how to open a PR. Browse [good first issues](https://github.com/alileus/mock-tools/labels/good%20first%20issue) or ask in [Discussions](https://github.com/alileus/mock-tools/discussions).

## How it's built

- Astro and Tailwind CSS, built as a static site.
- shadcn/ui Select with Radix for keyboard-accessible dropdowns, styled to match the site.
- Tool listings live in `src/data/tools.mjs` and drive the homepage and navigation.
- Reusable generator logic lives in `src/lib/`; tests use Node's built-in test runner.
- Vercel hosts [mock.alile.us](https://mock.alile.us). Merging to `main` deploys production; other branches do not deploy.

Vercel Web Analytics records page visits and tool/copy events. Generated values and seeds are not included in custom events. See [Vercel's privacy documentation](https://vercel.com/docs/analytics/privacy-policy) for details.

Social images are committed in `public/og/`. Run `npm run generate:og` to regenerate them using the bundled IBM Plex Mono font package.

TypeScript stays on the latest 6.x release because the current `@astrojs/check` peer dependency does not support TypeScript 7 yet.
The `fflate` override keeps Satori's ZIP dependency on a patched 0.7.x release; remove it once Satori updates its pinned version.

## License

[MIT](LICENSE). Maintained by [Ali](https://github.com/alileus).
