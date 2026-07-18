# AGENT.md

This file is the entry point for AI agents working with this codebase. Keep it
concise; put detailed technical documentation in [`DOCS`](./DOCS/).

## Project Overview

- This repository contains a locale-aware personal site and lightweight CMS.
- The public site serves posts, thoughts, events, and profile content. The
  authenticated dashboard manages content, tags, images, configuration, and
  accounts.
- The application is built with Next.js 16, React 19, Supabase, Tailwind CSS 4,
  SCSS, and Bun.
- Read [the architecture guide](./DOCS/ARCHITECTURE.md) before changing routing,
  data access, caching, content rendering, styling, or internationalization.

## Common commands

- Install dependencies: `bun install`
- Start the development server: `bun run dev`
- Build the production app: `bun run build`
- Start the production server: `bun run start`
- Lint (check only): `bun run lint`
- Lint (auto-fix): `bun run lint:fix`
- Format (check only): `bun run fmt`
- Format (auto-fix): `bun run fmt:fix`
- Typecheck: `bun run typecheck`
- Test: `bun run test`
- Open the maintenance menu: `bun run menu dev` or `bun run menu prod`
- Generate Supabase types: `bun run gen:types:dev` or
  `bun run gen:types:prod`
- Regenerate SVG icon components: `bun run gen:icons`

See [development and verification](./DOCS/DEVELOPMENT.md) for command behavior
and the expected validation workflow.

## Git Commit Guidelines

- Follow the Conventional Commit style already used by the repository, such as
  `feat:`, `fix:`, `refactor:`, `chore:`, and `docs:`. Add a scope only when it
  makes the change clearer.
- Write concise, imperative commit subjects and keep each commit focused on one
  logical change.
- Do not include unrelated working-tree changes in a commit.
- Run the relevant checks before committing and report any checks that could not
  be run.

## Mandatory Constraints

- Use Bun and the scripts in `package.json`; do not introduce another package
  manager or its lockfile.
- Keep browser, server-session, static-public, and service-role Supabase clients
  in their existing boundaries. Never expose `SUPABASE_SERVICE_ROLE_KEY` to
  client code.
- Preserve locale-prefixed routing and localized links. Supported locales and
  the default locale are defined in `src/lib/shared/i18n/routing.ts`.
- When changing cached data, update cache tags, cached consumers, and
  invalidation paths together.
- Do not hand-edit `src/types/supabase.ts`; regenerate it with the appropriate
  `gen:types` command.
- Keep documentation consistent with the code. Update affected documentation in the
  same change so architecture, commands, paths, and behavior do not become
  outdated.
- Write all source-code comments and project documentation in English.
- After completing a task, you must first run `bun run fmt:fix && bun run lint:fix`,
  then run the relevant non-mutating checks.
- Preserve unrelated user changes in the working tree. Avoid destructive Git
  operations unless explicitly requested.

## Documentation Index

- [Architecture](./DOCS/ARCHITECTURE.md): stack, directory layout, routing, data
  access, caching, content rendering, styling, and internationalization.
- [Development and verification](./DOCS/DEVELOPMENT.md): source of truth for
  commands, validation expectations, generated files, and manual checks.
- [README](./README.md): product features, local setup, Supabase setup, and
  deployment notes.

## Quick Reference

### File Naming

- React components and providers use `PascalCase.tsx`, for example `Button.tsx`
  and `ContentRenderer.tsx`.
- Hooks use the `useXxx.ts` or `useXxx.tsx` pattern, for example `usePosts.ts`.
- Keep Next.js special files lowercase: `page.tsx`, `layout.tsx`, `route.ts`,
  `loading.tsx`, and `error.tsx`.
- Non-component modules use lowercase names and an optional purpose suffix, such
  as `posts.ts`, `search-utils.ts`, `*.helper.ts`, `*.test.ts`, `*.client.tsx`,
  `*.component.tsx`, or `*.extension.ts`.
- Match the surrounding feature's established convention when adding a file to
  an existing directory. Name component-specific SCSS after the component or
  the directory entrypoint.

### Import Aliases

- `#components/*` maps to `src/components/*`.
- `#lib/*` maps to `src/lib/*`.
- `#styles/*` maps to `src/styles/*`.
- `#types` maps to `src/types/index.ts`; `#types/*` maps to `src/types/*`.
- Use aliases for imports that cross top-level source areas. Use relative imports
  for files within the same feature or component directory.
- Do not introduce `@/`, `src/*`, or another root alias unless `tsconfig.json`
  and the documentation are intentionally updated together.

### Styling Priority

1. Use Tailwind utilities for component layout, spacing, typography, responsive
   behavior, and straightforward visual states.
2. Use a colocated SCSS file for complex selectors, generated content,
   third-party overrides, or styles that would be difficult to read as utility
   classes.
3. Put reusable global theme tokens in `src/styles/variables.scss`. Keep
   public-layout-only variables in `src/app/[locale]/(index)/layout.scss`.
4. Avoid new global selectors and inline styles unless the value must be dynamic
   or cannot be expressed cleanly through the earlier options.
