# Maintaining mock-tools

## Review and release

1. Read the diff and linked issue. Check sources for regional formats and any new dependency's purpose and license.
2. Wait for the three **Verify** jobs, **Dependency audit**, **Dependency review**, and CodeQL. Fix failures instead of bypassing them.
3. For UI work, build and run `npm run preview`. Check the dropdowns with a keyboard, a narrow screen, output, copy, and download. The preview serves the same security headers as production.
4. Squash-merge when ready. Vercel deploys `main` to `mock.alile.us`; the `**` rule disables automatic deployments for other branch names, including names with slashes.
5. Check the live pages and the Vercel deployment result. If a release breaks the site, revert its merge through another PR.

The GitHub integration manages deployment; CI does not receive a Vercel token. No application secrets are required. Do not add production credentials to public-repo PR workflows. Review changes to `vercel.json` and workflows as carefully as application code.

## Repository settings

These settings are managed in GitHub, separately from the files in this repo:

- `main` requires a PR, passing checks, and resolved review conversations. Force pushes and deletion are blocked. There is no required outside approval, so a solo maintainer can merge their own PR after checks pass.
- Squash merge is the only merge method. Merged branches are deleted, and the Update branch button is enabled. Auto-merge is available per PR but no bot enables it automatically.
- Issues and Discussions are enabled. Issue forms, the PR template, and `CODEOWNERS` route contributions to Ali. The unused wiki is disabled.
- Private vulnerability reporting, Dependabot alerts/security fixes, secret scanning, and secret push protection are enabled.
- CodeQL uses GitHub's default setup for JavaScript/TypeScript and Actions. Its workflow is managed by GitHub and does not appear in this checkout.
- Actions use read-only default permissions, cannot approve PRs, and require approval for first-time contributors. Our workflows pin external actions to commit hashes and never use `pull_request_target` to run contributor code.

Keep required check names in sync if jobs are renamed. Contributors do not need direct write access or a deployment account.

## Updates

Dependabot checks npm packages and GitHub Actions each Monday. Minor and patch npm updates are grouped; major updates arrive separately. Security updates are enabled independently. Read release notes and run the same checks before merging bot PRs.

TypeScript 7 is temporarily excluded because `@astrojs/check` supports 5.x/6.x. Remove that exclusion when its peer range supports 7. Satori's `fflate` override selects the patched 0.7.x line; remove it once the upstream dependency is patched without the override.

The scheduled dependency audit runs weekly even when no code changes. Check the Security tab for dependency, secret, and code-scanning alerts. Revoke an exposed credential before removing it from files; deleting a file does not remove it from Git history.

## Browser policy

Security headers live in `vercel.json`. `astro.config.mjs` also loads them for the local production preview. Scripts stay external; `scripts/check-build.mjs` rejects inline executable scripts and event handlers in built HTML. Inline styles remain allowed for Radix's runtime positioning and scroll locking. Do not add `unsafe-inline` or `unsafe-eval` to the script policy to get a feature working.

Analytics uses Vercel's same-origin `/_vercel/insights/` endpoints in production. Its script returns 404 in a local static preview. Keep generated data, custom prefixes, and seeds out of event properties.
