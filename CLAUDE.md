# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common commands

- Install dependencies: `bun install`
- Start dev server: `bun run dev`
- Build production app: `bun run build`
- Start production server: `bun run start`
- Lint + typecheck: `bun run lint`
- Auto-fix formatting/lint issues: `bun run format`
- Generate Supabase types from development env: `bun run gen:types:dev`
- Generate Supabase types from production env: `bun run gen:types:prod`
- Regenerate SVG icon components: `bun run gen:icons`

## Notes on verification

- There is no dedicated test runner configured in `package.json`; validation is primarily `bun run lint` plus targeted manual checks in the app.
- There is no built-in single-test command in this repo today.
- `bun run lint` runs both Biome and `tsc --noEmit`, so use it as the default verification step after code changes.

## Stack and runtime

- Framework: Next.js 16 App Router with React 19.
- Package manager/runtime used by repo scripts: Bun.
- Styling mixes Tailwind CSS v4 with SCSS globals/modules.
- Data layer is Supabase; the generated database types live in `src/types/supabase.ts` and are re-exported through `src/types/index.ts`.
- Markdown rendering uses `react-markdown` with GFM, custom directives, Prism highlighting, and custom code block/table renderers.

## High-level architecture

### Routing and app shape

- The app is locale-prefixed. `src/proxy.ts` redirects requests without a locale segment to the cookie locale or the default locale from `src/lib/shared/i18n/routing.ts`.
- The root app shell is `src/app/[locale]/layout.tsx`. It sets metadata, loads global styles, injects the theme init script, mounts the toast provider, and wraps the app in the shared `ImageViewer`.
- Public pages live under `src/app/[locale]/(index)/*`.
- Admin/auth flows live under `src/app/[locale]/auth/*` and `src/app/[locale]/dashboard/*`.

### Public site vs dashboard

- The public side renders blog content, thoughts, events, and the home page summary.
- The dashboard layout in `src/app/[locale]/dashboard/layout.tsx` gates access with Supabase auth and `getUserStatus`, then renders a role-aware navigation shell.
- Admin-only operations such as cache revalidation are implemented as route handlers under `src/app/api/admin/*` and re-check auth/admin status on the server.

### Data access pattern

- Shared CRUD-style service modules live in `src/lib/shared/services/*` for posts, thoughts, events, images, RPCs, and summary data.
- These service functions accept an optional Supabase client. By default they use the static public client from `src/lib/shared/supabase.ts`, which is suitable for public reads.
- Server-only auth/session work uses `src/lib/server/supabase.ts` (`makeServerClient`, `makeAdminClient`).
- Client-side authenticated browser usage uses `src/lib/client/supabase.ts`.
- When changing data fetching, preserve this separation between shared service logic and client/server-specific client construction.

### Caching model

- Public pages commonly use Next.js cache components (`"use cache"`) plus explicit cache tags from `src/lib/server/cache`.
- Example pages such as `src/app/[locale]/(index)/(index)/page.tsx` and `src/app/[locale]/(index)/posts/[slug]/page.tsx` tag cached data and metadata separately.
- Admin cache invalidation is centralized in `src/app/api/admin/cache/revalidate-all/route.ts`, which revalidates summary/list/detail tags.
- If you add new cached content types, update both the page tags and the revalidation path together.

### Content rendering pipeline

- Markdown rendering enters through `src/components/ui/content/ContentRenderer.tsx`.
- The renderer wires together `remark-gfm`, `remark-directive`, custom directive transforms, heading-id generation, Prism highlighting, and custom `<pre>` / `<table>` rendering.
- Custom directive rendering lives under `src/components/ui/content/_components/directive-render/*`.
- Code block behavior is handled by `src/components/ui/content/_components/PreRender.tsx`.
- Changes to markdown features usually span renderer setup, directive renderers, and styling together.

### Styling model

- Global styles are loaded from `src/styles/globals.scss`, `src/styles/tailwind.css`, and `src/styles/variables.scss` in the root layout.
- Component styling is a mix of Tailwind utility classes and local SCSS/CSS modules.
- Public-page-only CSS variables belong in `src/app/[locale]/(index)/layout.scss`; keep `src/styles/globals.scss` reserved for truly app-wide variables shared across public pages, auth, and dashboard.
- This repo is mid-migration toward SCSS in at least some areas, so check for related stylesheet/type updates before making styling changes.

### Internationalization

- Locale config is intentionally small and lives in `src/lib/shared/i18n/routing.ts`.
- Pages obtain translations through helpers such as `getT` rather than via a large framework wrapper.
- Because locale is encoded in the route segment, most page/layout params include `locale` and should preserve it in links/navigation.

## Important repo-specific details

- README script examples are partially outdated relative to `package.json`; prefer `package.json` as the source of truth.
- The dashboard route for events is `/dashboard/event` (singular in the route tree/navigation), even though the content type and service layer are named `events`.
- PlantUML support is rendered from markdown content on the client side using encoded requests to the public PlantUML server; avoid introducing a server proxy unless explicitly requested.
