# AGENTS.md

Locale-aware personal site and lightweight CMS built with Next.js 16, React 19,
Supabase, Tailwind CSS 4, SCSS, and Bun.

## Project Constraints

- Use Bun and the scripts in `package.json`.
- Keep browser, server-session, static-public, and service-role Supabase clients
  within their runtime boundaries. Never expose the service-role key to clients.
- Preserve locale-prefixed routing and localized links; locale configuration
  lives in `src/lib/shared/i18n/i18n.const.ts`.
- Update cache tags, consumers, and invalidation paths together.
- Maintain database structure in `supabase/schemas` and local fixtures in
  `supabase/seed.sql`; follow the database workflow in the README.
- Regenerate Supabase types and SVG icon components rather than editing generated
  files by hand.
- Write source comments and project documentation in English. Update affected
  documentation with the implementation and record deferred work in `DOCS/TODO.md`.
- Preserve unrelated working-tree changes and avoid destructive Git operations
  unless explicitly requested.

## Code Style

- Prefer small, composable functions with explicit inputs and return values.
  Keep transformations pure; handle I/O in services and React effects in hooks.
- Treat inputs, props, and state as immutable. Prefer `const` and readonly types
  at shared boundaries; local mutation is fine when contained and clearer.
- Use `map`, `filter`, and named transformations for data processing. Use
  `es-toolkit/fp` composition when it improves readability; simple branches and
  loops do not need to become pipelines.
- Derive UI values from existing data instead of duplicating state. Use
  functional state updates when the next value depends on the previous value.
- Model distinct states with discriminated unions and use `ts-pattern` for
  complex exhaustive matching. Validate external inputs with Zod and prefer
  inferred types over assertions.
- Reuse the existing `es-toolkit` and `ts-pattern` dependencies. Add abstractions
  or libraries for concrete needs, not to enforce functional purity.

## File Naming

Use `<subject>.<role>.ts` or `.tsx`, with lowercase kebab-case subjects:
`post-editor.component.tsx`. Exported components use PascalCase (`PostEditor`)
and hooks use `useXxx` (`usePosts`).

Some existing files do not follow these conventions. These are legacy issues;
follow this document for subsequent development.

| Suffix       | Responsibility                                               |
| ------------ | ------------------------------------------------------------ |
| `.type`      | Type aliases and interfaces.                                 |
| `.const`     | Shared fixed values, lookup tables, and defaults.            |
| `.schema`    | Runtime validation and parsing rules.                        |
| `.helper`    | Pure transformations and calculations, without state or I/O. |
| `.service`   | Domain data operations and external I/O.                     |
| `.component` | React UI, including editors and providers.                   |
| `.hook`      | React state, effects, and UI behavior.                       |

Use `.helper` rather than `.utils`/`.util`, and `.type` rather than `.types`.
Specialized modules may choose descriptive suffixes such as `.extension` for
editor and directive integration, `.registry` for registrations, `.atom` for
Jotai state, or `.translator` for ICU translation. Supabase factories use
`supabase.client.ts`; their `lib/client`, `lib/server`, or `lib/shared` directory
identifies the runtime. Keep small private helpers, types, and constants in
their owning module. Split modules when they mix independent responsibilities
or runtime dependencies, not just to give every declaration its own file.

Append `.client` or `.server` when an environment distinction is needed, and
`.test` for tests, e.g. `meta.component.client.tsx` and `payload.schema.test.ts`.
Keep framework, tool, generated, declaration, locale, and `index` filenames in
their established formats. `page.client.tsx` is not a framework filename;
name route-local client UI by its subject and place it in `_components`.
Do not add environment suffixes to every Client Component; use them to clarify
a boundary or distinguish related implementations. Colocated styles share the
component basename, including `index.scss` for an existing `index.tsx` component.
Use lowercase kebab-case for ordinary component directories; preserve route
segments and framework directory conventions.

## File Placement

| Location                            | Responsibility                                                                                   |
| ----------------------------------- | ------------------------------------------------------------------------------------------------ |
| `src/app`                           | Routes, layouts, and handlers; route-local UI in `_components` and page-level hooks in `_hooks`. |
| `src/components/ui`                 | Reusable presentation primitives and editor integrations.                                        |
| `src/components/shared`             | Application-wide UI and providers.                                                               |
| `src/components/features/<feature>` | Feature-owned UI and private supporting modules.                                                 |
| `src/lib/client`                    | Browser clients and service adapters.                                                            |
| `src/lib/server`                    | Server clients, services, and cache definitions.                                                 |
| `src/lib/shared`                    | Environment-neutral domain modules and services.                                                 |
| `src/types`                         | Cross-domain types, declarations, and generated database types.                                  |
| `src/styles`                        | Global styles, tokens, and mixins.                                                               |
| `scripts`                           | Maintenance and development utilities.                                                           |
| `supabase`                          | Database configuration, schema sources, and seed data.                                           |
| `public`                            | Static assets addressed by URL.                                                                  |
| `DOCS`                              | Project guides and `TODO.md`.                                                                    |

Keep domain types, schemas, constants, helpers, tests, and styles close to their
owner. A hook used only by one editor or component stays beside that component,
even inside `_components`; `_hooks` is for page-level or route-shared hooks.
Move code to shared locations when actual reuse justifies it. Keep reusable UI
primitives in `components/ui`, site-wide behavior and locale-aware UI in
`components/shared`, and layout-specific content beside its layout.

Keep browser image compression and upload orchestration in `lib/client/images`.
Shared storage queries and session services accept a Supabase client; they must
not import browser-only adapters. The shared utility barrel exports only
environment-neutral utilities; import auth and image services from their owners.

## Imports and Styling

- Use `#components/*`, `#lib/*`, `#styles/*`, and `#types`/`#types/*` for imports
  across source areas, and relative imports within a feature. Alias definitions
  live in `tsconfig.json`; `#i18n` uses conditional imports in `package.json`.
- Prefer Tailwind utilities. Use colocated SCSS for complex selectors,
  generated content, and third-party overrides.
- Global theme tokens belong in `src/styles/variables.scss`; public-layout-only
  variables belong in `src/app/[locale]/(index)/layout.scss`.
- Reserve inline styles for dynamic values or cases not handled cleanly above.

## Development

| Task                     | Command                                  |
| ------------------------ | ---------------------------------------- |
| Install                  | `bun install`                            |
| Develop                  | `bun run dev`                            |
| Build / serve production | `bun run build` / `bun run start`        |
| Check formatting / lint  | `bun run fmt` / `bun run lint`           |
| Fix formatting / lint    | `bun run fmt:fix` / `bun run lint:fix`   |
| Check types / test       | `bun run typecheck` / `bun run test`     |
| Maintenance menu         | `bun run menu dev` / `bun run menu prod` |
| Generate icons           | `bun run gen:icons`                      |

After implementation, apply formatting and lint fixes to affected files, then
run relevant non-mutating checks. See the [README](./README.md#verification)
for verification and Supabase commands.

### Test Scope

- For simple lint, type, schema, or UI changes, use existing checks; do not
  add tests by default.
- Add tests for important behavior or bug regressions, preferably in existing
  suites. Avoid tests that merely repeat implementation or library behavior.

Use focused Conventional Commits (`feat:`, `fix:`, `refactor:`, `chore:`, `docs:`)
with concise imperative subjects. Include only task-related changes and report
checks that could not be run.

## Documentation

Consult the relevant guide for the task:

- [README](./README.md): setup, features, database operations, and deployment.
- [Architecture](./DOCS/ARCHITECTURE.md): data boundaries, caching, i18n, and rendering.
- [TODO](./DOCS/TODO.md): deferred project work.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
