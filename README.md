# Personal Site

An English-only personal site and single-owner CMS built with Next.js 16,
React 19, BlockNote, Supabase, StyleX, and Bun. The public reading desk links to published Posts, Thoughts, and Events. The dashboard
manages block-based content and a public file bucket.

## Getting Started

Requires Node.js 20.9+, Bun, and a running Docker-compatible runtime for local
Supabase. For a hosted Supabase project, skip local setup and configure its keys.

```bash
bun install
bun run supabase:setup
```

Setup writes local Supabase credentials to `.env.development`, preserving other
values. Add a non-empty `ADMIN_TOKEN`, then run `bun run dev`.
Open [the site](http://localhost:3000) or [sign in](http://localhost:3000/auth).
Development also accepts any IPv4 address (including loopback and LAN addresses)
and IPv6 loopback through `allowedDevOrigins`. A bare `*` is not supported by
Next.js's origin matcher; the IPv4 rule is `*.*.*.*`. This setting only applies to
the development server. Without an allowed origin, development scripts are
rejected and the opening curtain remains visible.
The token has no length or complexity requirement. There are no user accounts,
registration, OAuth providers, or Supabase Auth login flows.

Local tools: [Supabase Studio](http://localhost:54323).

### Environment Variables

- `ADMIN_TOKEN`: Server-only dashboard access token. An empty or missing value disables login.
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase API URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Public key used for signed browser uploads.
- `SUPABASE_SERVICE_ROLE_KEY`: Server-only key for authorized content and storage operations.
- `NEXT_PUBLIC_APP_TIMEZONE`: Optional display and editor timezone.

Keep environment files out of Git. Restart after changing them. Rotating
`ADMIN_TOKEN` invalidates existing dashboard sessions. Sessions expire after
seven days; signing out removes the current browser's cookie.

## Development

- Develop: `bun run dev`
- Build / serve production: `bun run build` / `bun run start`
- Check formatting / lint: `bun run fmt` / `bun run lint`
- Fix formatting / lint: `bun run fmt:fix` / `bun run lint:fix`
- Check types / test: `bun run typecheck` / `bun run test`
- Check formatting, lint, and types: `bun run check`
- Regenerate icons from `public/svg-icons`: `bun run gen:icons`

### Verification

Apply formatting and lint fixes to affected files, review the diff, then run
`bun run check` and relevant tests. Routing, caching, and runtime boundary
changes also require `bun run build`. Verify UI flows in a browser, including
session expiry, authorization, saves, uploads, and mobile/light/dark layouts.
The five Bun suites cover sessions, document validation/rendering, file safety,
and pre-paint themes; presentation and desk interactions use targeted browser
verification rather than per-helper test files.

GitHub Actions runs formatting, lint, types, and tests; it does not build the
app. Husky's pre-commit hook runs `bun run check` over the working tree without
modifying or staging files. `bun install` installs hooks; `bun run prepare`
reinstalls them.

## Dashboard

`/dashboard` opens Posts. Navigation contains Guestbook, Posts, Thoughts, Events, and Files.
On narrow screens, navigation stays visible with icons only. Publish dates open
the native date/time picker directly. Timeline years, dates, and color markers use
the shared magnetic interaction. Files provides sorting and pagination without a
search field; preview actions appear inside the image on hover or keyboard focus
and remain available on touch devices.
Content opens in a full-width BlockNote editor with manual saving. Publish time
and visibility live in the top toolbar; there is no separate preview mode.
New entries start hidden, with the current publish time. Posts and Events derive
their titles from the first document heading. Posts require a heading; Events
may contain only body text or media, with an empty stored title. Events also have a color. Images and attachments live in
the content document. There are no author, location, tag, or configuration fields.

The database stores native BlockNote JSON. The editor supports standard blocks,
including headings, lists, tables, code, images, audio, video, and file links.
Use `/Columns`, or drag blocks beside each other, to create a column layout.
The Column layout button beside a block opens controls for column count, percentage
widths, equal widths, and a 0–64 px gap. Removing columns moves their contents to
the last remaining column. Images and videos fill their column width; choose
original proportions, 1:1, 4:3, 16:9, or a shared media height, with crop/full-image
fit controls. Equal card heights aligns corresponding content rows across columns.
Dividers still support dragging. Reading areas at most 640 px wide stack columns
in order, restore natural card heights, and use 4:3 for shared-height media.
Previously saved custom media rows migrate to native columns when opened for editing.
Use `/Link card`, or Turn into link card on a standalone URL, for a saved
website preview. Enter only a URL: Microlink fills the preview automatically after
a short typing pause. The refresh icon retries parsing; titles and descriptions
have no manual fields. Reading pages use the saved preview.
Old Markdown directives, PlantUML, and Markdown source/split modes are removed.
There is no automatic runtime Markdown conversion. The one-time hosted database
conversion and recovery procedure is documented in the
[production migration guide](./DOCS/MIGRATION-2026-09-13.md).

The interface uses the shared English dictionary in source. Changing copy or
metadata requires a code change; business content keeps its original language.
There is no locale routing, dictionary override database, or translation service.

### Files

Files use the public Supabase Storage bucket `files`. Any file type can be
uploaded, up to 50 MiB per file. JPEG, PNG, and WebP images are compressed in the
browser to WebP (1920px maximum dimension, 2 MB target, initial quality 0.85).
GIF, SVG, and other file types keep their original bytes. Compression failures
are reported instead of silently uploading the original photo.

Uploads receive unique object paths and never overwrite existing files. The
original name is kept as metadata. The Files page supports name search,
pagination, time/size sorting, image previews, copying links, downloads, and deletion. Browser
uploads use server-issued signed credentials; the service-role key stays on the
server. Copying a file's public URL grants access to its bytes, including files
referenced only by hidden content.

Canceling an editor or deleting a document leaves uploaded files in the bucket.
Remove files explicitly from Files; deleting a referenced file breaks its link.
The old `/dashboard/images` address redirects to `/dashboard/files`.

## Public Site

The reading-desk homepage is at `/`; its token guide is at `/system`. Public
pages retain their own providers, scrolling, and assets. They
share one neutral Light/Dark token system and a synchronized System/Light/Dark
preference with the dashboard. `/posts` groups all public articles by year, with title/date rows, yearly counts,
and total post and approximate non-whitespace character counts;
`/posts/<uuid>` opens the article with a responsive table of contents.
Thoughts and Events show all public documents in a feed and timeline. Public
pages have no pagination; the dashboard retains its existing pagination.
Show makes content public regardless of publish time, including future events.
The homepage displays public Posts, Thoughts, and Events counts, site likes and
page views through Supabase RPC. Likes are disabled after a successful click,
using the existing browser-local marker. Guestbook notes are public immediately;
optional email addresses remain public. Manage notes at `/dashboard/guestbook`.

Content and counts require the public Supabase URL and anonymous key. Missing
configuration or unavailable data produces a local unavailable state; the rest
of the reading desk remains usable. Public lists, articles, and document rendering use Cache Components; dashboard
mutations invalidate the affected content. The public shell prefetches Posts,
Thoughts, and Events and renews those prefetches when Next.js marks them stale.
See [Architecture](./DOCS/ARCHITECTURE.md#public-content-and-caching) for boundaries.
See the [design guide](./DOCS/REDESIGN.md) for the public UI and audio sources.

## Database

Schema sources live in `supabase/schemas`; fixtures live in `supabase/seed.sql`.
The CLI loads schemas through its seed configuration. This repository does not
use migration history. After schema changes, rebuild the local database and
regenerate types:

```bash
bunx supabase db reset --local
bun run supabase:types
```

Reset deletes local data. Do not point reset at a remote database as part of
ordinary development. `--no-seed` skips both application schemas and fixtures.

The `BEGIN DEMO CONTENT` block in `supabase/seed.sql` adds 9 public Posts,
6 Thoughts, and 5 Events, plus one hidden record per kind. It covers multiple
years, a future publication date, a long article with nested/repeated headings,
an 80-link directory stress case, inline images, and untitled/media-only Events. Demo content has explicit demo
labels and stable UUIDs; its `ON CONFLICT DO NOTHING` inserts can be reapplied
without replacing edited records. To add demos to an existing local database,
apply only that block without resetting the database. Sample images use public
HTTPS URLs so they also work when browsing the site from another LAN device.

- Start services and update local env: `bun run supabase:setup`
- Start / stop while preserving data: `bunx supabase start` / `bunx supabase stop`
- Inspect local service status: `bunx supabase status`
- Refresh local environment: `bun run supabase:env`

`supabase:setup` starts existing services and refreshes environment variables; it
does not apply schema changes.

The application tables are `posts`, `thoughts`, `events`, and `configs`. Anonymous table
access can read only published content. Content and storage writes require
service-role access from the authorized server layer. Desk interactions use
the constrained RPCs described in [Architecture](./DOCS/ARCHITECTURE.md#desk-rpc). Seed creates the public file bucket with a 50 MiB
limit. The `desk.*` configuration keys hold likes, visits, guestbook data, and one saved desktop configuration.
Anonymous clients can execute specific public RPCs but cannot modify tables.
There are no application auth, tag or webhook tables.

To add desk RPCs to an existing local database without resetting data:

```bash
docker exec -i supabase_db_personal-site psql -U postgres -d postgres -v ON_ERROR_STOP=1 < supabase/schemas/05_desk.sql
bun run supabase:types
bun scripts/verify-desk-rpc.ts
```

Desk administrators sign in at `/auth`, then open the homepage display's Settings
and choose Edit desk. The server-loaded configuration opens immediately. Apply
saves an item directly; completed layout gestures, reset, shuffle, undo, and redo
also save. There is no separate Save button. Form inputs remain temporary until
Apply succeeds, and undo/redo history stays in the current editor session.
Visitors' personal positions remain browser-local. Item
metadata defaults and the `items`/`layouts` injection contract are described in
[Architecture](./DOCS/ARCHITECTURE.md#configurable-desk).

For a hosted database, apply `05_desk.sql` using its SQL editor before deploying.
The script migrates the old workspace to one configuration, preferring its published
content and falling back to its draft only when nothing was published. Existing saved
configurations and unrelated config values are preserved. RPC verification
creates and removes an isolated temporary database in the local Docker container;
set `SUPABASE_DB_CONTAINER` when its name differs. It checks permissions, concurrent
updates, moderation and the rolling limit of ten new notes per 60 seconds.
The seed also includes a hidden native-column/link-card editor fixture.

Existing databases with the former mandatory event-title constraint can be
updated without resetting data:

```sql
ALTER TABLE public.events DROP CONSTRAINT IF EXISTS events_title_check;
ALTER TABLE public.events ALTER COLUMN title SET DEFAULT '';
```

## Deployment

Provide the environment variables above at build and runtime, provision the
schema and `files` bucket in the target Supabase project, then build and serve.
For a local production verification using local Supabase credentials:

```bash
bun --env-file=.env.development run build
bun --env-file=.env.development run start
```

The `jsdom` override in `package.json` keeps BlockNote's server renderer compatible
with Lambda's disabled `require(esm)` support. The Bun patch for
`@blocknote/server-util` gives its isolated DOM a non-opaque origin so storage
access during rendering does not throw; this does not fetch the origin URL.
The document rendering suite checks both in native Node with that restriction;
Bun-only tests do not reproduce the module error. See [TODO](./DOCS/TODO.md)
before removing these compatibility fixes.

There are no OAuth callback URLs, webhook secrets, or webhook binding steps.
See [Architecture](./DOCS/ARCHITECTURE.md) for authorization and data flow.

## Documentation

- [AGENTS.md](./AGENTS.md): development conventions and module ownership.
- [Architecture](./DOCS/ARCHITECTURE.md): runtime boundaries and data flow.
- [Design guide](./DOCS/REDESIGN.md): tokens, public UI, and audio.
- [Project review](./DOCS/REVIEW-2026-09-13.md): architecture and quality findings,
  measured performance, and follow-up decisions as of September 13, 2026.
- [TODO](./DOCS/TODO.md): outstanding work.

## License

Project code is available under [GPL-3.0-only](./LICENSE). The official
`@blocknote/xl-multi-column` extension is used under its GPL-3.0 option;
no commercial subscription is needed for this GPL release. Dependencies retain
their own licenses. Blog posts, personal photographs, and other authored content
are not covered by this software license. Corresponding project source is available
at [muyu258/personal-site](https://github.com/muyu258/personal-site).

### Audio imports

Apply `supabase/schemas/06_audio.sql` after the desk schema to provision the protected
asset table, public `audio` bucket and saved-desk audio RPC. This additive script also
preserves the built-in track IDs without changing existing desk snapshots. Regenerate
Supabase types after applying the schema. For local application without a reset:

```bash
docker exec -i supabase_db_personal-site psql -U postgres -d postgres -v ON_ERROR_STOP=1 < supabase/schemas/06_audio.sql
bun run supabase:types
```

The recording editor supports files and public HTTP(S) audio URLs, up to 50 MiB and
15 minutes. Upload completion starts background processing; keep the page open until
the upload completes. Processing continues after the dialog closes. Reopen the audio
library to add completed recordings or retry failures. Removing a recording from a
playlist does not delete its audio or spectrum files.

Production uses a Node.js Vercel Function with Fluid compute and `maxDuration = 300`.
`ffmpeg-static` is a trusted install dependency; install dependencies on the target
platform so its executable matches the deployment. Next's output tracing includes the
binary only for `/api/admin/audio/import`. Do not reuse macOS `node_modules` for Linux
production. Confirm the function bundle contains an executable FFmpeg and stays below
the project's bundle limit. No additional service credentials are required beyond
existing Supabase and admin settings. Runtime decoding is bounded background work,
not a durable queue: failed or interrupted attempts require manual retry.

Before deploying this feature, ensure the hosted desk schema (`05_desk.sql`) is current
and apply the additive audio schema. Home-page prerendering requires both
`read_desk_configuration` and `read_desk_audio` in the target database. Verify a
real upload and URL import on the deployed Function, including spectrum-only retry;
a local successful decode does not validate the Linux deployment artifact. See
[Architecture](./DOCS/ARCHITECTURE.md#item-metadata-and-audio-imports) for permissions,
saved configuration and task-state boundaries.
