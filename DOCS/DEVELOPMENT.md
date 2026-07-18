# Development and verification

## Command source of truth

Treat the `scripts` object in `package.json` as authoritative. Documentation can
lag behind script changes, so verify a command there before using or documenting
it.

The repository uses Bun. Use `bun install` for dependencies and `bun run <name>`
for scripts so `bun.lock` remains the only package-manager lockfile.

## Verification workflow

Run the independent, non-mutating verification commands after code changes:

1. `bun run fmt` — Oxfmt formatting checks for JavaScript, TypeScript, JSON,
   JSONC, CSS, SCSS, and Markdown. Oxfmt also sorts imports and Tailwind classes,
   including strings passed to `clsx` and `cn`.
2. `bun run lint` — Oxlint.
3. `bun run typecheck` — TypeScript with `tsc --noEmit`.
4. `bun run test` — the repository's Bun tests. There is currently no separate
   browser or end-to-end test suite.

Use the smallest relevant check while iterating. After development is complete,
run `bun run fmt:fix` and `bun run lint:fix` when applicable, then run all four
non-mutating commands above. Run `bun run build` as an optional local integration
check for changes involving routing, server/client boundaries, Next.js cache
behavior, metadata, or production bundling. Vercel is responsible for preview
and production builds and deployments; GitHub Actions CI does not run the build.

## Mutating commands

- `bun run lint:fix` applies available Oxlint fixes.
- `bun run fmt:fix` formats supported files through Oxfmt.
- `bun run gen:types:dev` and `bun run gen:types:prod` replace the generated
  Supabase database types.
- `bun run gen:icons` regenerates React icon components from `public/svg-icons`.

Before running a mutating command across the repository, inspect the working tree
and avoid overwriting unrelated user changes. Prefer targeting only files related
to the current task when the tool supports it.

## Generated files

- `src/types/supabase.ts` is generated from Supabase and should not be edited by
  hand.
- Files under `src/components/icons` are generated from source SVGs in
  `public/svg-icons`.
- Do not commit `.next` output or introduce lockfiles from other package managers.

## Manual verification

Choose focused checks based on the affected area:

- Public routing: verify both `en-US` and `zh-CN` URLs and a URL without a locale
  prefix.
- Dashboard changes: verify signed-out behavior, authenticated non-admin access,
  and admin-only behavior where applicable.
- Content rendering: check representative Markdown, directives, code blocks,
  tables, images, and PlantUML as relevant.
- Cache changes: verify both the cached page and its webhook or admin invalidation
  path.
- Styling changes: check light and dark themes plus mobile and desktop layouts.
