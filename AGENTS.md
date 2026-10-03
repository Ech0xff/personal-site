# AGENTS.md

English-only personal site and CMS using Next.js 16, React 19, Supabase, StyleX,
and Bun. Public and administration roots share design tokens.

## Constraints

- Use Bun and `package.json` scripts. Preserve unrelated changes; avoid destructive
  Git operations unless requested.
- Authenticate dashboard reads and Server Actions with the admin token session.
  Keep signed browser uploads and server-only service-role operations separate;
  never expose the service-role key to clients.
- Keep English defaults in the shared dictionary, routes without locale prefixes,
  and business content in its original language. No AI translation.
- Update cache tags, consumers, and invalidation together. Maintain schemas in
  `supabase/schemas`, fixtures in `supabase/seed.sql`, and regenerate Supabase types.
  Follow the [database workflow](./README.md#database).
- Write English comments and documentation. Keep setup/operations in README.md,
  development rules here, and deferred work in handoffs; update docs with changes.

## Code Style

- Use small functions with explicit inputs/returns; pure transformations, service
  I/O, and hook effects. Prefer `const`, immutable inputs/state, and readonly shared
  boundaries; contained mutation is fine when clearer.
- Prefer named transformations, `map`/`filter`, and existing `es-toolkit` helpers;
  simple branches/loops are fine. Derive UI values and use functional state updates.
- Model distinct states with discriminated unions and complex exhaustive matching
  with `ts-pattern`. Validate external inputs with Zod; prefer inferred types to
  assertions. Add abstractions/dependencies only for concrete needs.

## Naming and Placement

New files use lowercase kebab-case `<subject>.<role>.ts(x)`; components use
PascalCase and hooks `useXxx`. Roles: `.type` (types), `.const` (defaults), `.schema`
(validation), `.helper` (pure transformations), `.service` (I/O), `.component` (UI),
and `.hook` (state/effects). Use `.helper`, not `.utils`/`.util`; `.type`, not `.types`.
Specialized `.extension`, `.registry`, and `.atom` suffixes are valid.

Supabase factories use `supabase.client.ts`; add `.client`/`.server` only for runtime
boundaries and `.test` for tests. Preserve framework/tool/generated/declaration and
`index` filenames; never edit generated files. `page.client.tsx` is not a framework
filename: put named UI in `_components`. Styles share the component basename:
`.style.ts` for StyleX, `.css` for adapters. Directories use lowercase kebab-case,
except route/framework conventions.

- `src/app`: Routes/layouts/handlers; local UI in `_components`, page-level or
  route-shared hooks in `_hooks`. Editor-private hooks stay beside the editor.
- `src/components/ui` and `shared`: Reusable primitives/editors and site-wide UI.
- `src/app/(admin)/dashboard/_components/features/<feature>`: Dashboard feature UI
  and private modules, including Homepage editors/audio library in `home`.
- `src/lib/client`, `server`, `shared`: Browser adapters, server services/caches,
  and environment-neutral domains. Auth/content/storage I/O stays server-side;
  browser image compression belongs in `client/images`, uploads in `client/files`,
  and appearance state in `client/theme`.
- `src/types`: Cross-domain/generated types and declarations; `src/design`: tokens,
  themes, and style input types. `scripts`, `supabase`, and `public` hold maintenance
  tools, database sources, and URL-addressed assets.

Colocate domain types, schemas, helpers, tests, and styles with their owner; keep
layout content beside its layout. Share for actual reuse and split independent
responsibilities/runtime dependencies, not every private declaration. Shared
utility barrels export only environment-neutral utilities; import auth/image
services from their owners. Server Actions authenticate before services.

The public desk owns fixed responsive composition and visitor interactions.
Persist only item IDs, types, names, and content config; geometry/appearance stay
in public components. No visitor layout storage, public admin state, or imports
between public and dashboard route components. Derive content titles from the
first top-level heading; persist only content, visibility, and publish time.
Store each recording in private `audio.asset.<id>` config, separate from desk
state; use the task-owner RPC for atomic updates and expose only selected, ready
recordings through the public audio RPC.

## Imports and Styling

- Use `#components/*`, `#design/*`, `#lib/*`, and `#types` aliases across areas;
  relative imports within features. `#dictionary` uses conditional package imports.
- Use StyleX; all tokens, scene materials, lighting, and light/dark overrides live
  in `src/design/tokens.stylex.ts`. Scene composition and interaction markers stay
  in `(site)/_design`; geometry stays with components, rendered colors in tokens.
- Compose typed `xstyle`, explicit variants, and sizes. Plain CSS is only for root
  resets/scoped third-party adapters consuming StyleX variables. No Tailwind/Sass.
- Group public UI under `layout`, `desk`, `record-player`, and `display`; keep the
  system guide local. Shared modules/scripts must not import route modules.
- Public and admin roots own their shells, providers, scrolling, and assets; reuse
  environment-neutral theme controls without importing admin providers publicly.

## Verification

Follow [README commands](./README.md#development) and
[verification](./README.md#verification): fix formatting/lint on affected files,
then run relevant non-mutating checks. Use existing checks for simple changes;
add meaningful behavior/regression tests near their domain/runtime, prioritizing
integrity, authorization, compatibility, and algorithms. Verify UI and desktop
interactions through targeted browser scenarios.

Use focused Conventional Commits (`feat:`, `fix:`, `refactor:`, `chore:`, `docs:`)
with imperative subjects. Include task-related changes only and report unrun checks.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
