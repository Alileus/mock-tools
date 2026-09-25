# Contributing

Thanks for helping make these tools more useful. You can fix a bug, add a format, improve the docs, or build a new tool.

## Start here

1. Check existing [issues](https://github.com/alileus/mock-tools/issues) and PRs for similar work.
2. Fork the repo, clone your fork, and create a branch.
3. Run `npm ci` and `npm run dev` with Node.js 24 LTS or 22.12+.
4. Make your change and run `npm run verify`.
5. Open a PR against `main`. Explain what changed, why, and how you checked it.

You do not need permission for a small fix. For a larger feature, open a tool request first. There is no contributor agreement to sign; contributions use the project's MIT license.

## Adding a tool

1. Put generator and formatting logic in `src/lib/<tool>.mjs`. Keep it independent of the DOM so it can be tested. Use TypeScript or JSDoc for types.
2. Add `test/<tool>.test.mjs` with useful examples, invalid inputs, and boundary cases. Check against reference values or an independent validator for checksums.
3. Add `src/pages/<tool>.astro` using `Layout`. Reuse existing classes from `src/styles/global.css`. `BatchTool.astro` shows a copy/download workflow.
4. Add an entry to `TOOLS` in `src/data/tools.mjs`. This adds the homepage card and navigation link. Update the README's tool table.
5. Try it on a narrow screen and with a keyboard. Label inputs, show errors, and keep copy/download usable.

For a new record preset, start with `generateRecords` and `RECORD_PRESETS` in `src/lib/fixtures.mjs`, then add its option in `BatchTool.astro` and tests for its fields.

Dropdowns use the shadcn component in `src/components/ui/select.tsx`. `FixtureSelect.tsx` connects it to each native `select.field`, preserving form values and existing tool events. Add a normal labeled select; the shared layout enhances it automatically. When changing options programmatically, update the native options and the wrapper will follow. For value-only changes, dispatch a bubbling `change` event.

## What belongs here

- Useful test data, mock payloads, IDs, and regional formats.
- Tools that work locally in the browser without accounts or API keys.
- Clear limits: distinguish a correct checksum from a real or verified identity.

Cite an official specification when adding a regional format or changing a mapping. Label assumptions and unverified data. Don't commit real personal data, credentials, production exports, or generated bulk files. Use reserved example domains for contact fixtures.

Avoid sending user inputs, generated values, or seeds to analytics. A tool name or selected format is enough. Add dependencies only when they earn their place; describe the reason in the PR.

## Checks and review

`npm run verify` runs Astro checks, generator tests, and the static build. CI runs on Linux and Windows and accepts PRs from forks without repository secrets. UI changes should include a screenshot and a quick note about mobile and keyboard checks.

Ali reviews contributions. A passing build doesn't merge a PR automatically. Only changes merged into `main` reach the live site.

For questions, use [Discussions](https://github.com/alileus/mock-tools/discussions). For security reports, follow [SECURITY.md](SECURITY.md).
