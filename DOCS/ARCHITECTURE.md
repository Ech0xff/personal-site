# Architecture

For setup and operations, see [README](../README.md). For naming and placement,
see [AGENTS.md](../AGENTS.md).

## Independent UI Roots

The public reading desk lives in `src/app/(site)` at `/`, with `/posts`,
`/thoughts`, `/events`, and `/system`. It owns local content, scene materials,
audio, and Lenis scrolling. Content pages remain placeholders and old article
detail URLs return 404.

Authentication and dashboard live in the separate `(admin)` root. Both roots
share StyleX foundations from `src/design`; each owns its reset and providers.
Public pages never import administration providers or the BlockNote editor.
Public features are grouped by layout, desk, record player, and display. The
System guide owns its samples. Audio fixtures and spectrum parsing are shared
with maintenance scripts through an environment-neutral audio domain.
Crossing roots loads a new document. See the [design guide](./REDESIGN.md).

## Authentication and Data Access

The single owner signs in with server-only `ADMIN_TOKEN`, with no length or
complexity requirement. An empty value disables login. The server compares
fixed-length token hashes and signs a seven-day JWT using a domain-separated
key derived from the configured token. The HttpOnly, SameSite cookie is Secure
in production and contains no original token. Rotation invalidates existing
sessions; logout clears the cookie. No Supabase user session is used.

Protected Server Components read initial data through services. Server Actions
load editor data and perform saves, status changes, deletion, and upload signing.
Every entry point checks the session, including service reads; a layout check
alone is insufficient. Next.js Server Actions enforce browser same-origin
submission. Expected action errors return discriminated results so failed saves
retain editor content. Session reads are behind Suspense and are not shared-cache
entries. Server modules use `import "server-only"`.

Only the server creates the service-role Supabase client. A separate browser
client with session persistence disabled uploads to a signed object path. RLS
allows anonymous reads of `show` content and no anonymous table writes. Storage
object listing and deletion require server access; public bucket URLs allow
anyone to read file bytes, independent of document visibility.

## Content and Editor

Posts, Thoughts, and Events remain separate tables with UUID, native BlockNote
JSONB content, visibility, and publish time. Posts and Events store a title
derived from the first document heading on every save;
Events have a color. There are no author, location, standalone image arrays,
tags, configuration records, or application user tables.

BlockNote provides editing; Thoughts and Events render static HTML through the
server-only BlockNote exporter. Documents are validated before export and text is
escaped by the exporter. Exports run serially because the library temporarily
sets JSDOM globals. The renderer is reused, but private content is not cached.
Lists do not initialize browser editor instances. The editor runtime loads only
when editing. Posts use a table.
Each data page has an explicit Suspense boundary below the shared dashboard
layout, covering session checks, queries, and static document rendering during
both direct visits and client navigation. The route-level loading file alone
cannot cover every sibling navigation. Each page authenticates before returning
content; the shared layout renders only the shell.
Standard blocks are validated with Zod at the service boundary; block
structure, inline formatting, nested children, tables, and media props survive
save/load. Database-generated types are regenerated from the local schema.
Posts send lightweight list summaries; Thoughts and Events send their documents
for inline rendering. Raw JSON is never displayed. New documents
start hidden. Saves are explicit and wait for uploads to finish. Failed saves
keep the current document, including when the session expires.

Owned component styles use StyleX; scoped BlockNote CSS consumes its variables.
The editor uses the resolved administration theme. Old CodeMirror, Markdown
renderers/directives, PlantUML, and external link-preview logic are removed.

## File Storage

Both Files and BlockNote use one browser upload service. Ordinary JPEG/PNG/WebP
photos reuse browser WebP compression; GIF, SVG, and other file types retain their
bytes. Client and server validate upload descriptors against the bucket's 50 MiB
limit. The authorized server generates a unique path and a signed upload token;
the browser uploads bytes directly to Supabase and only then uses the public URL.
The signed credential authorizes that path, not general bucket management.

Storage metadata owns the file name, MIME type, size, and creation time; there
is no duplicate application file table. The service-role-only `list_files` SQL function reads Storage metadata without
modifying it, providing case-insensitive original-name substring search and
stable pagination, time/size sorting, and filtered totals. The standard Storage listing omits original-name metadata. Upload failures can be retried. Canceling an
editor does not remove uploaded objects; deletion is explicit and may break
existing content links. There is no background garbage collector.

## Dictionary and Refresh

The shared English dictionary is source-controlled. The `#dictionary`
conditional import resolves to a static server reader or the client provider.
There are no database overrides, locale prefixes, language cookies, or AI
translation. Business content keeps its original language.

Dashboard data is requested under session authorization without shared caching.
Successful mutations revalidate the relevant dashboard path and refresh the
list. Unused content cache tags, webhook handlers, trigger functions, and cache
maintenance endpoints were removed together. Future public content integration
must introduce cache readers and invalidation as a single change.

## Shared Appearance and Modals

Browser theme state lives in `lib/client/theme`. Both roots mount the same
synchronization component within their own runtime. One `theme` preference is
shared across tabs and roots; System resolves the current OS setting. The
pre-paint ThemeScript and runtime use the same complete sets of color, shadow,
material, and lighting classes. Storage failures fall back to System while local
controls remain usable. Portals inherit the theme from `html`.

All token definitions and light/dark overrides live in `design/tokens.stylex.ts`.
Both roots share neutral surfaces and a blue accent. The reading desk keeps its
material colors with dark ambient variants. Lamp on/off is a local lighting
override independent of the color scheme. See the [design guide](./REDESIGN.md).

Dashboard editors fill the dashboard-anchored modal surface without a maximum
reading width. Metadata and icon controls sit in the top toolbar, and the
document itself owns its heading. Borderless inputs use floating labels.
A shared Loading component fills the content area for navigation, server data,
and editor loading. Focus follows the active modal and returns to its opener when
closed. Files image previews use the native-dialog viewer with fit-to-viewport zoom
and focus restoration; other file previews and downloads retain their URL links.
Reusable controls stay in `components/ui`; feature-specific hooks and
styles remain with their dashboard feature.

## Public Display Composition

The homepage Server Component supplies rendered CLI, Stats, and Guestbook slots
to the client computer shell. Stats and Guestbook each have a local Suspense
boundary; the clock, program buttons, and outer desk remain available while a
slot renders. Program selection is immediate; scan animations do not gate data.
Stats rendering is separate from the local like control. Guestbook form state,
submission effects, and list rendering have separate owners.

Current content remains synchronous local fixtures. The slots support future
server-side Supabase reads initiated during page rendering, rather than fetching
on the first tab click. Public read policies, cache consumers/invalidation,
errors/retries, and moderated writes remain a coordinated follow-up in
[TODO](./TODO.md).

Desk preferences belong to each feature. The shared storage atom factory validates
values, handles storage failures, and subscribes to cross-tab changes. The clock
owns its legacy-value migration. Record session recovery and progress persistence
are separate from playback commands and the audio element lifecycle; external
session changes restore a paused player. Spectrum network I/O lives in the
browser audio service; binary parsing stays environment-neutral.
