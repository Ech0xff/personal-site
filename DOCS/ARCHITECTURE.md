# Architecture

For setup and operations, see [README](../README.md). For naming and placement
rules, see [AGENTS.md](../AGENTS.md).

## Data and Authorization

Shared services accept a Supabase client so callers choose the identity:

- `makeStaticClient`: Anonymous public reads.
- `makeBrowserClient`: Browser session reads and mutations.
- `makeServerClient`: Cookie-backed server session access.
- `makeAdminClient`: Privileged server operations using the service-role key.

The dashboard layout controls sign-in access and navigation. Database RLS and
privileged endpoint checks authorize operations; hiding an admin link does not.

## Cache Invalidation

Public data uses `"use cache"` with shared tags in
`src/lib/server/cache/index.ts`. Lists, summaries, config, and individual posts
have separate tags.

- `/api/webhook`: Validates the bearer secret and payload, maps tables to tags,
  and revalidates with stale-while-revalidate behavior. Post changes also refresh
  the individual post tag.
- Config Server Actions: Require admin access and immediately expire the
  config tag.
- `/api/admin/cache/revalidate-all`: Requires admin access and immediately
  expires all known content tags.

Post detail pages and metadata use the route's `slug` and carry both post and
config tags, so article edits and dictionary overrides invalidate their output.

## Configuration

Global config includes `DICTIONARY`, which merges admin overrides with
`src/lib/shared/dictionary/dictionary.const.ts`. Objects merge recursively;
arrays replace defaults. Zod validates overrides, and dynamic messages use ICU
formatting with supported placeholders and explicit rich-text renderers.

The `#dictionary` conditional import resolves to the server reader or client
provider. Config saves and deletions use admin Server Actions to expire the
config cache; the dashboard refreshes the current route.

The interface uses English without locale routing, language cookies, or a
translation API. Business content keeps its original language. Old
language-prefixed and translation-preview URLs return 404 without redirects.
OAuth returns through `/api/auth/callback` to `/dashboard/account` or `/auth`.

## Content Rendering

`content-renderer.component.tsx` combines Markdown/GFM, directives, heading IDs,
and syntax highlighting. Directives under
`src/components/features/content/_components/directive-render` require both
registration and a renderer. `pre-render.component.tsx` handles code blocks and
PlantUML; see [supported syntax](../README.md#markdown-support).

Root, post-detail, and auth `loading.tsx` files re-export the shared loading UI.
The local boundaries cover page parameter and session reads; they do not cover
runtime reads in a layout at the same directory level.

## Module Ownership

Shared auth/session queries accept the caller's client. Browser image compression
and uploads live in `lib/client/images`; shared image services handle storage
queries and deletion. Search transformations live in `lib/shared/search`, while
browser RPC calls stay in client services. Shared theme logic lives in
`lib/shared/theme`, with browser state in `lib/client/theme.atom.ts`; routes live
in `lib/shared/routes`.

The theme atom owns preference persistence, system and storage listeners, and
HTML theme attributes through a single update path. Subscribing to either theme
atom mounts these listeners; the last unsubscribe removes them. Storage is read
on mount, while ordinary atom reads use in-memory state. The pre-paint
`ThemeScript` applies the initial appearance before React mounts.

Thought image URLs are deduplicated at service read/write boundaries and in
upload state, preserving first occurrence and order so URLs can serve as keys.
Recent-plan row IDs exist only in editor state and are omitted when saving.

Dashboard editors fill their modal boundary and use a flat `Stack` surface.
`ModalPanel` is reserved for floating panels. Inline destructive actions use
transparent icon buttons with danger colors on hover; configuration delete
buttons retain their filled treatment. List rows keep content-driven height
rather than inheriting the fixed height of ordinary buttons.

Tag editors use the dashboard-anchored modal boundary. A continuous saturation
and brightness palette, hue slider, and hex input update only `meta.color`,
preserving other metadata fields. Modal focus follows the active entry ID and
returns to its opener, even while a removed layer is animating out.
