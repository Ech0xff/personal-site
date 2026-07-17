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
- `scripts`: interactive database and maintenance utilities.
- `supabase`: schema, RPC, seed-data, and row-level security SQL.

## Routing and app shape

- Routes are prefixed with a locale. `src/proxy.ts` redirects requests without a
  locale segment to the cookie locale or the default locale from
  `src/lib/shared/i18n/routing.ts`.
- The root shell is `src/app/[locale]/layout.tsx`. It generates site metadata,
  loads global styles, initializes theme state, mounts toast and modal providers,
  and wraps the application with the shared image viewer.
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

- Locale configuration lives in `src/lib/shared/i18n/routing.ts`. The supported
  locales are `en-US` and `zh-CN`, with `en-US` as the default.
- Translation dictionaries live under `src/lib/shared/i18n/messages` and are
  accessed through helpers such as `getT`.
- Because the locale is part of the route, preserve the locale parameter in
  page and layout APIs, links, redirects, and navigation helpers.
