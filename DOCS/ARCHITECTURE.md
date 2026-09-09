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

`ContentRenderer.tsx` combines Markdown/GFM parsing, custom directive
transforms, heading IDs, and syntax highlighting. The directive registry under
`src/components/features/content/_components/directive-render` connects parsed
nodes to their renderers; new directives need both registration and rendering.

`PreRender.tsx` handles code blocks and PlantUML output. PlantUML source is sent
to a public rendering service; supported content syntax is documented in the
[README](../README.md#markdown-support).
