# Architecture

## Data and Authorization

Shared services contain reusable queries and accept a Supabase client so the
caller selects the appropriate identity:

| Client              | Use                                                      |
| ------------------- | -------------------------------------------------------- |
| `makeStaticClient`  | Anonymous public reads.                                  |
| `makeBrowserClient` | Browser session reads and mutations.                     |
| `makeServerClient`  | Cookie-backed server session access.                     |
| `makeAdminClient`   | Privileged server operations using the service-role key. |

The dashboard layout controls navigation and sign-in access. Database RLS and
authorization checks in privileged endpoints protect the underlying operations;
hiding an admin link is not authorization.

## Cache Invalidation

Public data uses `"use cache"` with tags defined in
`src/lib/server/cache/index.ts`. Lists, summaries, config, and individual posts
have separate tags so updates invalidate only their consumers.

Supabase changes reach `/api/webhook`, which validates the bearer secret and
payload, maps tables to tags, and revalidates with stale-while-revalidate behavior.
Post changes also invalidate the individual post tag. The admin-only
`/api/admin/cache/revalidate-all` endpoint expires all known content tags
immediately. These paths and cached consumers share the same tag definitions.

## Internationalization

`#i18n` uses conditional exports in `package.json`: Server Components read
route locale and cached dictionaries; Client Components read the serialized
dictionary from `I18nProvider`. This lets shared synchronous components use the
same translation API without forcing them into the client bundle. Async server
code uses `getT` or `getScopedT`.

The ICU translator receives its dictionary and locale explicitly. Dictionary
validation belongs to i18n; config owns storage and overrides. The shared i18n
entrypoint excludes dictionary data and schemas to keep them out of client
imports. Dictionary caches use the config tag, so configuration changes also
invalidate translations.

## Content Rendering

`content-renderer.component.tsx` combines Markdown/GFM parsing, custom directive
transforms, heading IDs, and syntax highlighting. The directive registry under
`src/components/features/content/_components/directive-render` connects parsed
nodes to their renderers; new directives need both registration and rendering.

`pre-render.component.tsx` handles code blocks and PlantUML output. PlantUML source is sent
to a public rendering service; supported content syntax is documented in the
[README](../README.md#markdown-support).

## Module Ownership

Files use `subject.role.ts(x)` as described in `AGENTS.md`. Existing index
entrypoints, framework files, generated icons and database types, locale files,
and maintenance scripts retain their established names.

Page-level hooks live in each route's `_hooks`; editor-private hooks stay beside
their editor. Reusable presentation primitives and the modal system belong to
`components/ui`. Locale-aware links and global toast handling belong to
`components/shared`; the public footer belongs to the public layout.

The client, server, and shared data layers remain separate. Supabase factories
are named `supabase.client.ts` within each layer. Shared session queries live in
`lib/shared/auth/session.service.ts` and receive the caller's Supabase client.
Browser image compression and uploads live in `lib/client/images`; shared image
services provide storage queries and deletion without importing browser code.

Search transformations and types live in `lib/shared/search`, while browser RPC
calls stay in client services. Theme constants, types, and transformations live
in `lib/shared/theme`, with Jotai state in `lib/client/theme.atom.ts`. Route
constants and localized route transformations live in `lib/shared/routes`.
Date conversion, file-size formatting, and hashing are separate shared utilities;
date utilities retain the existing timezone initialization and fallback behavior.
