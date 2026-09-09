# Architecture

## Stack and runtime

- Next.js 16 App Router with React 19.
- Bun for dependency management and repository scripts.
- Tailwind CSS 4 with SCSS for styling.
- Supabase for authentication, database access, and storage.
- `react-markdown` with GFM, custom directives, Prism highlighting, and custom
  code block and table renderers.

## Directory layout

- `src/app`: locale-prefixed pages, layouts, dashboard routes, and API route
  handlers.
- `src/components`: shared UI, providers, and feature-level components.
- `src/lib/client`: browser-only clients and services.
- `src/lib/server`: server-only clients, services, and cache definitions.
- `src/lib/shared`: environment-neutral configuration, i18n, services, and
  utilities.
- `src/styles`: global Tailwind entrypoint, theme variables, and SCSS mixins.
- `src/types`: application types and generated Supabase database types.
- `supabase/config.toml`: local Supabase CLI service and database configuration.
- `supabase/schemas`: declarative tables, functions, grants, and RLS policies.
- `supabase/migrations`: generated schema changes plus explicit bucket and
  deployable baseline-data changes.
- `supabase/seed.sql`: development-only local fixtures.
- `scripts`: interactive webhook and admin maintenance utilities.
- `supabase`: CLI configuration, versioned migrations, and local seed data.

## Routing and app shape

- Routes are prefixed with a locale. `src/proxy.ts` redirects requests without a
  locale segment to the locale preference cookie or the default locale from
  `src/lib/shared/i18n/i18n.const.ts`. `src/components/shared/LocaleCookieSync.tsx`
  keeps that cookie aligned with the locale of the route being viewed.
- The root shell is `src/app/[locale]/layout.tsx`. It generates site metadata,
  loads global styles, applies the theme class from `ThemeScript` before first
  paint, mounts toast and modal providers, and wraps the application with the
  shared image viewer.
- Theme state is client-owned: `ThemeScript` reads `localStorage` during the
  first paint and `src/lib/client/theme.ts` exposes the Jotai atoms that
  components read and write. No theme value is read on the server, which keeps
  the root document prerenderable.
- Public pages live under `src/app/[locale]/(index)`.
- Authentication and administration live under `src/app/[locale]/auth` and
  `src/app/[locale]/dashboard`.
- The dashboard event route is `/dashboard/event` (singular), although the
  content type and service modules use the plural name `events`.

## Public site and dashboard

- The public side renders the home summary, posts, thoughts, and events.
- `src/app/[locale]/dashboard/layout.tsx` creates a session-aware Supabase
  client, requires an authenticated user, and renders navigation according to
  the user's admin status.
- Privileged server operations must repeat their own authorization checks. Do
  not rely on the dashboard layout as the only security boundary.
- Admin cache invalidation lives in
  `src/app/api/admin/cache/revalidate-all/route.ts` and verifies authentication
  and admin status before revalidating data.

## Data access boundaries

- Shared data operations live in `src/lib/shared/services`. Public read methods
  commonly default to the static anonymous client from
  `src/lib/shared/supabase.ts`; authenticated mutations receive an explicit
  client.
- Browser-authenticated access uses `src/lib/client/supabase.ts`. Browser-specific
  service wrappers live in `src/lib/client/services`.
- Cookie-backed server session access uses `makeServerClient` from
  `src/lib/server/supabase.ts`.
- Service-role access uses `makeAdminClient` from the same server-only module. It
  must never be imported into client code or expose the service-role key.
- Keep reusable query logic in shared services while constructing the correct
  Supabase client at the browser or server boundary.

## Database lifecycle

- PostgreSQL 17 runs locally through the Supabase CLI and Docker.
- `bunx supabase db reset --local` owns destructive local rebuilds. Migration
  files must not drop the public schema as a reset mechanism.
- Declarative files under `supabase/schemas` are the maintained schema source of
  truth. Versioned migrations remain the deployment history.
- The initial migration contains the generated schema snapshot, public `images`
  storage bucket, and deployable baseline content.
- `supabase/seed.sql` is applied only to local resets and contains development
  fixtures that must not be deployed.
- Hosted projects advance through migration history with
  `bunx supabase db push --linked`; application code continues to access the same
  public database and storage interfaces.

## Caching model

- Public pages use Next.js cache components (`"use cache"`) and explicit tags
  from `src/lib/server/cache/index.ts`.
- List, summary, configuration, and post-detail data use separate tags so they
  can be invalidated independently.
- `src/app/api/webhook/route.ts` maps Supabase table changes to cache tags through
  `TABLE_CACHE_TAGS`.
- `src/app/api/admin/cache/revalidate-all/route.ts` provides authenticated bulk
  invalidation, including individual post-detail tags.
- When adding a cached content type, update its tag definitions, page consumers,
  webhook table mapping, and bulk invalidation behavior together.

## Content rendering pipeline

- Markdown enters through
  `src/components/features/content/ContentRenderer.tsx`.
- The renderer combines `remark-gfm`, `remark-directive`, custom directive
  transforms, heading ID generation, Prism highlighting, and custom paragraph,
  `<pre>`, and table renderers.
- Directive parsing and rendering live under
  `src/components/features/content/_components/directive-render`.
- Code block and PlantUML behavior live in
  `src/components/features/content/_components/PreRender.tsx`.
- Markdown feature changes commonly require coordinated parser, renderer, type,
  and style updates.
- PlantUML source is encoded by the renderer and requested from the public
  PlantUML server. Do not put sensitive information in PlantUML blocks or add a
  server proxy unless explicitly requested.

## Styling model

- `src/app/[locale]/layout.tsx` loads `src/styles/tailwind.css` and
  `src/styles/variables.scss` globally.
- Theme tokens are generated from SCSS maps in `src/styles/variables.scss` and
  consumed as CSS variables.
- Component styling mixes Tailwind utility classes with local SCSS files.
- Public-layout-only variables belong in
  `src/app/[locale]/(index)/layout.scss`; global theme variables belong in
  `src/styles/variables.scss`.

## Internationalization

- Locale configuration lives in `src/lib/shared/i18n/i18n.const.ts`: the locale
  list, the default locale, the toggle labels, and the locale preference cookie
  name. The supported locales are `en-US` and `zh-CN`, with `en-US` as the
  default.
- Shared domain constants belong in `i18n.const.ts`, shared types in
  `i18n.type.ts`, and ordinary environment-neutral pure functions in
  `i18n.helper.ts`. Keep local variables and implementation helpers private and
  close to their callers. Split a dedicated module when a group of functions
  has an independent dependency or responsibility, as with the ICU translator
  and dictionary construction. This convention is being piloted in i18n;
  migrate other domains when working on them.
- `i18n.helper.ts` handles locale parsing and localized href transformations.
  `parseLocale` returns `Locale | null`; `normalizeLocale` falls back to the
  default for invalid preferences. The proxy parses the leading pathname segment
  with `getLocaleFromPathname`; the server adapter validates root parameters
  with `assertLocale`. Internal operations accept a validated `Locale`.
- `localizeHref(locale, href)` prepends a locale to a locale-free href such as a
  `ROUTES` constant or `/posts/123`; it never inspects the href for an existing
  prefix. `switchLocaleHref(from, to, href)` rewrites an already localized href
  and treats the `from` prefix as a precondition, failing loudly if it is absent.
- `src/components/shared/LanguageToggle.tsx` derives its target locale from the
  route locale and reads `window.location` only when the user switches, so it
  renders inside the static shell instead of behind a `Suspense` boundary.
- Translation dictionaries live under `src/lib/shared/i18n/messages`;
  `messages/index.ts` is the registry that maps a locale to its dictionary, and
  `messages/default.ts` is the shape that `Dictionary` is derived from.
  `messages/messages.helper.ts` owns `defineDictionary`, which merges built-in
  translations with the default dictionary without mutating it.
- `i18n.schema.ts` owns dictionary override validation. The config registry and
  dashboard dictionary editor import that schema directly; config owns storage
  and registration, while i18n owns the dictionary rules. The schema and message
  registry are separate entry points from the shared i18n barrel.
- `i18n.translator.ts` owns `createT` and ICU formatting. It receives its source
  and locale explicitly and has no runtime dependency on built-in dictionaries,
  React, request state, or storage. Dictionary types use type-only imports.
  Translator overloads preserve selected data types and return strings for
  interpolated messages; ICU generics distinguish plain text from rich React
  output. The dynamically generated override schema retains one documented type
  assertion because TypeScript cannot infer its dictionary keys from
  `Object.fromEntries`; schema tests cover full dictionaries and partial inputs.
- Components import `useT` and `useLocale` from `#i18n`. The package `imports`
  map in `package.json` resolves that specifier to the server implementation
  under the `react-server` condition and to the client Context implementation
  otherwise. This keeps synchronous shared components as Server Components
  while allowing the same source to run inside Client Components.
- `#i18n` is the runtime surface only. Pure helpers, constants, translator
  construction, and types come from the explicit exports in `#lib/shared/i18n`.
  Use relative concrete modules within i18n. The shared barrel does not export
  the dictionary registry or schema, keeping those data dependencies out of the
  client runtime's import graph through i18n.
- Server `getLocale` is memoized with React `cache`; `useLocale` reads only that
  value without loading a dictionary. Translation access loads the dictionary
  through the existing locale-keyed cache and configuration cache tag. The
  server entry uses `import "server-only"` to enforce its environment boundary.
- The client `I18nProvider` remains a separate provider around the application;
  it supplies the serialized dictionary to interactive Client Components.
- React Hooks cannot run in async Server Components or metadata functions. Keep
  translations in a synchronous Server Component child and use `getT` or
  `getScopedT` for metadata and other async server-only functions.
- Because the locale is part of the route, preserve the locale parameter in
  page and layout APIs, links, redirects, and navigation helpers.
