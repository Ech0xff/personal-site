# AGENTS.md

English-only personal site and lightweight CMS built with Next.js 16, React 19,
Supabase, Tailwind CSS 4, SCSS, and Bun.

## Project Constraints

- Use Bun and the scripts in `package.json`.
- Keep browser, server-session, static-public, and service-role Supabase clients
  within their runtime boundaries. Never expose the service-role key to clients.
- Keep English defaults in the shared dictionary with admin overrides, routes
  without language prefixes, and business content in its original language.
  Do not add locale routing or AI translation.
- Update cache tags, consumers, and invalidation paths together.
- Maintain schemas in `supabase/schemas` and fixtures in `supabase/seed.sql`;
  follow the [database workflow](./README.md#database).
- Regenerate Supabase types and SVG icon components; do not edit generated files.
- Write comments and documentation in English. Update affected docs with the
  implementation and record deferred work in `DOCS/TODO.md`.
- Preserve unrelated changes; avoid destructive Git operations unless requested.

## Code Style

- Use small, composable functions with explicit inputs and return values.
  Keep transformations pure, I/O in services, and React effects in hooks.
- Treat inputs, props, and state as immutable; prefer `const` and readonly types
  at shared boundaries. Contained local mutation is fine when clearer.
- Prefer `map`, `filter`, and named transformations. Use `es-toolkit/fp`
  composition when helpful; simple branches and loops are fine.
- Derive UI values from existing data. Use functional state updates when the
  next value depends on the previous one.
- Model distinct states with discriminated unions; use `ts-pattern` for complex
  exhaustive matching. Validate external inputs with Zod and prefer inferred
  types over assertions.
- Reuse `es-toolkit` and `ts-pattern`; add abstractions or dependencies only
  for concrete needs.

## File Naming

Use lowercase kebab-case `<subject>.<role>.ts(x)`, e.g.
`post-editor.component.tsx`. Components use PascalCase; hooks use `useXxx`.
Apply these conventions to new work; some legacy files differ.

- `.type`: Types and interfaces.
- `.const`: Shared constants and defaults.
- `.schema`: Runtime validation and parsing.
- `.helper`: Pure transformations without state or I/O.
- `.service`: Domain operations and external I/O.
- `.component`: React UI, editors, and providers.
- `.hook`: React state, effects, and UI behavior.

Use `.helper`, not `.utils`/`.util`; use `.type`, not `.types`. Specialized
suffixes such as `.extension`, `.registry`, and `.atom` are valid.

Supabase factories use `supabase.client.ts`; their data layer identifies the
runtime. Add `.client`/`.server` only to clarify an environment boundary, and
`.test` for tests, e.g. `meta.component.client.tsx`, `payload.schema.test.ts`.

Preserve framework, tool, generated, declaration, and `index` filenames.
`page.client.tsx` is not a framework filename: use a subject name inside
`_components`. Colocated styles share the component basename, including
`index.scss` for `index.tsx`. Ordinary directories use lowercase kebab-case;
preserve route segments and framework conventions.

## File Placement

- `src/app`: Routes, layouts, handlers; local UI in `_components`, page-level
  hooks in `_hooks`.
- `src/components/ui`: Reusable presentation primitives and editor integrations.
- `src/components/shared`: Site-wide UI and providers.
- `src/components/features/<feature>`: Feature UI and private supporting modules.
- `src/lib/client`: Browser clients and service adapters.
- `src/lib/server`: Server clients, services, and caches.
- `src/lib/shared`: Environment-neutral domain modules and services.
- `src/types`: Cross-domain types, declarations, and generated database types.
- `src/styles`: Global styles, tokens, and mixins.
- `scripts`: Maintenance and development utilities.
- `supabase`: Database configuration, schemas, and seed data.
- `public`: Static assets addressed by URL.
- `DOCS`: Project guides and deferred work.

Keep domain types, schemas, constants, helpers, tests, and styles with their owner.
Editor-private hooks stay beside the editor; `_hooks` is for page-level or
route-shared hooks. Keep layout-specific content beside its layout. Share code
when actual reuse warrants it; split modules for independent responsibilities
or runtime dependencies, not for every private declaration.

Browser image compression and uploads belong in `lib/client/images`.
Shared storage and session services accept a Supabase client and never import
browser adapters. The shared utility barrel exports only environment-neutral
utilities; import auth and image services from their owners.

## Imports and Styling

- Use `#components/*`, `#lib/*`, `#styles/*`, and `#types`/`#types/*`
  across source areas; use relative imports within a feature.
  Aliases live in `tsconfig.json`; `#dictionary` uses conditional imports in
  `package.json` for server reads and the client provider.
- Prefer Tailwind utilities. Use colocated SCSS for complex selectors, generated
  content, and third-party overrides; reserve inline styles for dynamic values
  or cases these do not handle cleanly.
- Global tokens belong in `src/styles/variables.scss`; public-layout-only
  variables belong in `src/app/(index)/layout.scss`.

## Development and Documentation

Follow the [README commands](./README.md#development) and
[verification workflow](./README.md#verification): apply formatting and lint
fixes to affected files, then run relevant non-mutating checks.

Use existing checks for simple lint, type, schema, or UI changes. Add tests for
important behavior or regressions, preferably in existing suites; avoid tests
that repeat implementation or library behavior.

Use focused Conventional Commits (`feat:`, `fix:`, `refactor:`, `chore:`,
`docs:`) with imperative subjects. Include only task-related changes and report
checks that could not run.

Keep documentation responsibilities distinct: [README](./README.md) for setup
and operations, [Architecture](./DOCS/ARCHITECTURE.md) for system behavior,
[TODO](./DOCS/TODO.md) for actionable outstanding work. Link to the owning guide
instead of repeating its content. Prefer concise paragraphs and lists over tables.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
