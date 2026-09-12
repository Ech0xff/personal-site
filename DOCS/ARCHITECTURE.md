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

Deployments upgraded from localized config must copy the English overrides to
the language-free keys before building. Preview with
`bun run scripts/config-migration.service.ts prod`, then add `--apply` to copy
validated `DICTIONARY`, `ABOUT_ME`, `PLAYLIST_URL`, and `RECENT_PLAN` values from
their `:en-US` keys. Existing targets and all source rows are preserved, including
when the script runs again. The global `OAUTH` key does not need migration.

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

`applyTheme` only writes HTML theme attributes and the color scheme. The theme
atom wraps subsequent updates in `transitionTheme` for a 200ms whole-page View
Transition. It commits DOM attributes and React state together with `flushSync`
inside the snapshot update callback, so theme consumers share the new appearance.
Initialization, reduced motion, and browsers without View Transitions update
immediately. Storage failures fall back to the system theme during initialization.

The Tailwind `transition-colors` utility uses `--duration-state` (180ms) for
ordinary control feedback. Explicit duration utilities can override it when a
different interaction warrants that. During a theme transition, local CSS
transitions are disabled and page animations pause; only the root snapshots
crossfade. The grid, cursor, and marquee use CSS animation pausing; the typewriter
and tag sphere skip their JavaScript animation updates. Cleanup uses the browser's
`finished` promise, resumes previously running animations that remain paused, and
removes the temporary root marker and duration. Canceled local CSS transitions
are not replayed. A new request skips the previous transition without
letting its cleanup affect the new one. Gradient and shadow changes are included
in the whole-page fade. Embedded iframe activity is owned by its provider.

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
