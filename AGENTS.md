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
editor integration or `.translator` for ICU translation. Keep small private
helpers, types, and constants in their owning module.

Append `.client` or `.server` when an environment distinction is needed, and
`.test` for tests, e.g. `meta.component.client.tsx` and `payload.schema.test.ts`.
Keep framework, tool, generated, declaration, locale, and `index` filenames in
their established formats. Colocated styles share the component basename.

## File Placement

| Location                            | Responsibility                                                                        |
| ----------------------------------- | ------------------------------------------------------------------------------------- |
| `src/app`                           | Routes, layouts, and handlers; route-local UI in `_components` and hooks in `_hooks`. |
| `src/components/ui`                 | Reusable presentation primitives and editor integrations.                             |
| `src/components/shared`             | Application-wide UI and providers.                                                    |
| `src/components/features/<feature>` | Feature-owned UI and private supporting modules.                                      |
| `src/lib/client`                    | Browser clients and service adapters.                                                 |
| `src/lib/server`                    | Server clients, services, and cache definitions.                                      |
| `src/lib/shared`                    | Environment-neutral domain modules and services.                                      |
| `src/types`                         | Cross-domain types, declarations, and generated database types.                       |
| `src/styles`                        | Global styles, tokens, and mixins.                                                    |
| `scripts`                           | Maintenance and development utilities.                                                |
| `supabase`                          | Database configuration, schema sources, and seed data.                                |
| `public`                            | Static assets addressed by URL.                                                       |
| `DOCS`                              | Project guides and `TODO.md`.                                                         |

Keep domain types, schemas, constants, helpers, tests, and styles close to their
owner. Move code to shared locations when actual reuse justifies it.

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

Use focused Conventional Commits (`feat:`, `fix:`, `refactor:`, `chore:`, `docs:`)
with concise imperative subjects. Include only task-related changes and report
checks that could not be run.

## Documentation

Consult the relevant guide for the task:

- [README](./README.md): setup, features, database operations, and deployment.
- [Architecture](./DOCS/ARCHITECTURE.md): data boundaries, caching, i18n, and rendering.
- [TODO](./DOCS/TODO.md): deferred project work.
