# Security

The current `main` branch is supported. Use the latest version when reporting a problem.

Please report vulnerabilities through [GitHub's private reporting form](https://github.com/alileus/mock-tools/security/advisories/new). Include the affected page or file, steps to reproduce, and the impact. Use synthetic examples and leave out credentials or real personal data.

Please keep exploit details out of public issues until a fix is available. Ordinary bugs and incorrect fixture formats belong in [Issues](https://github.com/alileus/mock-tools/issues).

These are test-data generators. A checksum-valid output is not proof that a number is unused or belongs to anyone. The site does not verify identities or accounts.

## Scope and safeguards

The app is a static site with no login, database, or server API. Generators and text converters run in the browser. Inputs and outputs are not uploaded. Vercel Web Analytics receives page visits and a small set of tool, conversion, and copy event properties. Do not use real personal data as fixture inputs or seeds.

Production uses a Content Security Policy that permits scripts and network requests from the site's own origin, blocks inline JavaScript and framing, and disables unused browser permissions. Inline CSS is permitted because the Radix dropdowns apply styles at runtime. Built HTML is checked for scripts that would violate this policy. These headers are also applied by `npm run preview`.

CI audits all installed packages, including development dependencies, and rejects moderate or higher known vulnerabilities. Dependency review checks PRs; CodeQL scans code and workflows. Dependabot opens update PRs, and GitHub secret scanning with push protection checks supported secret patterns. These checks do not guarantee that every vulnerability or credential is detected.

See [the maintenance guide](docs/MAINTAINING.md) for update and deployment procedures.
