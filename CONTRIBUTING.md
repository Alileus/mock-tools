# Contributing

Thanks for helping make these tools more useful. You can fix a bug, add a format, improve the docs, or build a new tool.

## Start here

1. Check existing [issues](https://github.com/alileus/mock-tools/issues) and PRs for similar work.
2. Click **Fork** on GitHub, clone your fork, and create a branch.
3. Run `npm ci` and `npm run dev` with Node.js 24 LTS or 22.12+.
4. Make your change and run `npm run verify`.
5. Open a PR against `main`. Explain what changed, why, and how you checked it.

You do not need permission for a small fix. For a larger feature, open a tool request first. There is no contributor agreement to sign; contributions use the project's MIT license.

Replace `YOUR_USERNAME` below with your GitHub username:

```sh
git clone https://github.com/YOUR_USERNAME/mock-tools.git
cd mock-tools
git remote add upstream https://github.com/alileus/mock-tools.git
git switch -c add-my-tool
npm ci
npm run dev
```

Open `http://localhost:4321`. No account, API key, environment file, or access to Vercel is needed. Not sure where to start? Browse the [good first issues](https://github.com/alileus/mock-tools/labels/good%20first%20issue). Documentation and small accessibility fixes are welcome too.

When your change is ready:

```sh
npm run verify
git add path/to/changed-file
git commit -m "Describe the change"
git push -u origin add-my-tool
```

Use the link GitHub shows after the push to open your PR. Choose `alileus/mock-tools` and `main` as the destination. A draft PR is fine if you want feedback while you work. Keep unrelated changes in separate PRs.

## Adding a tool

1. Put generator and formatting logic in `src/lib/<tool>.mjs`. Keep it independent of the DOM so it can be tested. Use TypeScript or JSDoc for types.
2. Add `test/<tool>.test.mjs` with useful examples, invalid inputs, and boundary cases. Check against reference values or an independent validator for checksums.
3. Add `src/pages/<tool>.astro` using `Layout` and `ToolShell`. The shared shell supplies the container, heading, accent, and panel; do not add another page container or panel around it. Reuse existing classes from `src/styles/global.css`. `BatchTool.astro` shows a generator workflow; `TextTool.astro` shows a text converter with copy/download.
4. Add an entry to `TOOLS` in `src/data/tools.mjs`. This adds the homepage card and navigation link. Update the README's tool table.
5. Try it on a narrow screen and with a keyboard. Label inputs, show errors, and keep copy/download usable.

For a new record preset, start with `generateRecords` and `RECORD_PRESETS` in `src/lib/fixtures.mjs`, then add its option in `BatchTool.astro` and tests for its fields.

Dropdowns use the shadcn component in `src/components/ui/select.tsx`. `FixtureSelect.tsx` connects it to each native `select.field`, preserving form values and existing tool events. Add a normal labeled select; the shared layout enhances it automatically. When changing options programmatically, update the native options and the wrapper will follow. For value-only changes, dispatch a bubbling `change` event.

## What belongs here

For country-specific tools, use the lowercase ISO 3166-1 alpha-2 code as the route prefix and tool key: `sa` for Saudi Arabia, `ae` for the UAE, or `gb` for the UK. Saudi pages live in `src/pages/sa/` and use `SaTool.astro` with `SA_TABS` metadata. Follow that naming pattern for new countries, and use the full country name in navigation labels.

- Useful test data, mock payloads, IDs, and regional formats.
- Tools that work locally in the browser without accounts or API keys.
- Clear limits: distinguish a correct checksum from a real or verified identity.

Cite an official specification when adding a regional format or changing a mapping. Label assumptions and unverified data. Don't commit real personal data, credentials, production exports, or generated bulk files. Use reserved example domains for contact fixtures.

Avoid sending user inputs, generated values, or seeds to analytics. A tool name or selected format is enough. Add dependencies only when they earn their place; describe the reason in the PR.

Render user values with `textContent` or form values, not HTML strings. CSV exports use `csvCell`, which prefixes formula-like text with an apostrophe for spreadsheet safety; numeric values and JSON are unchanged. Use `serializeJsonLd` for structured data embedded in HTML.

## Checks and review

`npm run verify` runs Astro checks, tests, the static build, and a check that built scripts work with the security policy. CI also regenerates social images, runs a dependency audit, and checks new dependencies for known vulnerabilities. GitHub CodeQL scans JavaScript, TypeScript, and workflow code.

CI runs on Linux and Windows with a read-only token and no repository secrets. GitHub may ask a maintainer to approve the first workflow run from a new contributor. That is normal; you do not need to supply credentials.

For UI changes, run `npm run preview` after building and open the URL it prints. This uses the production security headers. Try a narrow screen, keyboard navigation, generation, copy, and download. Include a screenshot and a short note in the PR. The Vercel analytics script is not available on the local preview, so its request can return 404.

If a check fails, open the PR's **Checks** tab for the error. Use `npm ci` after pulling lockfile changes. Keep TypeScript on 6.x until `@astrojs/check` supports 7; do not fix peer conflicts with `--force`. If the build flags inline JavaScript, move it into a normal Astro script or imported module instead of weakening the security policy.

Ali reviews contributions. PRs need passing checks and resolved review conversations. No outside approval is required for the maintainer's own PRs. Changes are squash-merged and their branches are deleted afterward. Passing checks alone do not enable auto-merge; a maintainer must choose that for an individual PR. Only changes merged into `main` reach the live site.

For questions, use [Discussions](https://github.com/alileus/mock-tools/discussions). For security reports, follow [SECURITY.md](SECURITY.md).
