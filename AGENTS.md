# AGENTS.md

English-only personal site and lightweight CMS built with Next.js 16, React 19,
Supabase, StyleX, and Bun. Public and administration roots share design tokens.

## Project Constraints

- Use Bun and the scripts in `package.json`.
- Keep signed browser uploads and service-role Supabase operations within their
  runtime boundaries. Authenticate dashboard reads and Server Actions with the
  admin token session. Never expose the service-role key to clients.
- Keep English defaults in the source-controlled shared dictionary, routes
  without language prefixes, and business content in its original language.
  Do not add locale routing or AI translation.
- Update cache tags, consumers, and invalidation paths together.
- Maintain schemas in `supabase/schemas` and fixtures in `supabase/seed.sql`;
  follow the [database workflow](./README.md#database).
- Regenerate Supabase types and SVG icon components; do not edit generated files.
- Write comments and documentation in English. Update affected docs with the
  implementation. Keep project documentation in README.md and AGENTS.md.
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
`_components`. Colocated styles share the component basename, using `.style.ts` for StyleX declarations or `.css` for third-party adapters. Ordinary directories use lowercase kebab-case;
preserve route segments and framework conventions.

## File Placement

- `src/app`: Routes, layouts, handlers; local UI in `_components`, page-level
  hooks in `_hooks`.
- `src/components/ui`: Reusable presentation primitives and editor integrations.
- `src/components/shared`: Site-wide UI and providers.
- `src/app/(admin)/dashboard/_components/features/<feature>`: Dashboard feature UI and private supporting modules.
- `src/lib/client`: Browser clients and service adapters.
- `src/lib/server`: Server clients, services, and caches.
- `src/lib/shared`: Environment-neutral domain modules and services.
- `src/types`: Cross-domain types, declarations, and generated database types.
- `src/design`: Shared StyleX tokens, light/dark themes, and style input types.
- `src/lib/client/theme`: Browser appearance preference state.
- `scripts`: Maintenance and development utilities.
- `supabase`: Database configuration, schemas, and seed data.
- `public`: Static assets addressed by URL.

Keep domain types, schemas, constants, helpers, tests, and styles with their owner.
Editor-private hooks stay beside the editor; `_hooks` is for page-level or
route-shared hooks. Keep layout-specific content beside its layout. Share code
when actual reuse warrants it; split modules for independent responsibilities
or runtime dependencies, not for every private declaration.

Browser image compression belongs in `lib/client/images`; general file uploads
belong in `lib/client/files`. Auth, content, and storage I/O belong in their
`lib/server` domains. Server Actions authenticate before invoking services. The shared utility barrel exports only environment-neutral
utilities; import auth and image services from their owners.

## Imports and Styling

- Use `#components/*`, `#design/*`, `#lib/*`, and `#types`/`#types/*`
  across source areas; use relative imports within a feature.
  Aliases live in `tsconfig.json`; `#dictionary` uses conditional imports in
  `package.json` for server reads and the client provider.
- Use StyleX for owned component styles. All token definitions, including scene materials, lighting, and light/dark
  overrides, belong in `src/design/tokens.stylex.ts`. Public scene composition
  styles and interaction markers remain in `(site)/_design`.
- Compose component overrides with typed `xstyle` inputs, explicit variants, and
  sizes. Keep geometry with its component and rendered colors in tokens.
- Plain CSS is reserved for root resets and scoped third-party adapters. Adapters
  consume variables supplied by StyleX; do not add Tailwind or Sass.
- Group public feature UI under `layout`, `desk`, `record-player`, and `display`;
  keep the system guide local to its route. Do not import route modules from
  shared modules or maintenance scripts.
- The public root keeps its own shell, providers, scrolling behavior, and assets.
  Both roots reuse environment-neutral theme synchronization and controls,
  without importing administration features or providers into the public root.

## Development and Documentation

Follow the [README commands](./README.md#development) and
[verification workflow](./README.md#verification): apply formatting and lint
fixes to affected files, then run relevant non-mutating checks.

Use existing checks for simple lint, type, schema, or UI changes. Add tests for
important behavior or regressions, preferably in existing suites; avoid tests
that repeat implementation or library behavior. Colocate tests with their owning
domain and runtime; prioritize data integrity, authorization, compatibility, and
nontrivial algorithms. Verify presentation and desktop interactions through
targeted browser scenarios.

Use focused Conventional Commits (`feat:`, `fix:`, `refactor:`, `chore:`,
`docs:`) with imperative subjects. Include only task-related changes and report
checks that could not run.

Keep [README](./README.md) for setup and operations, and this file for development
rules and ownership. Report deferred work in the task handoff rather than creating
additional project guides. Prefer concise paragraphs and lists over tables.

Content titles are derived from the first top-level document heading; persist only
content, visibility, and publish time. Audio resources use one private
`audio.asset.<id>` config per recording. Keep their job state separate from the desk
configuration, use the task-owner RPC for atomic updates, and expose only selected,
ready recordings through the public audio RPC.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
