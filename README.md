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

`/dashboard` opens Posts. Navigation contains Posts, Thoughts, Events, and Files.
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
Old Markdown directives, PlantUML, and Markdown source/split modes are removed.
Existing Markdown data is not converted.

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
The homepage displays live public Posts and Thoughts counts.

Content and counts require the public Supabase URL and anonymous key. Missing
configuration or unavailable data produces a local unavailable state; the rest
of the reading desk remains usable. Public queries run on each request. Cache
Components reuse document rendering, not database reads or visibility decisions.
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

The application tables are `posts`, `thoughts`, and `events`. Anonymous database
access can read only published content; writes require service-role access from
the authorized server layer. Seed creates the public file bucket with a 50 MiB
limit. There are no application auth, tag, configuration, or webhook tables/functions.

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

There are no OAuth callback URLs, webhook secrets, or webhook binding steps.
See [Architecture](./DOCS/ARCHITECTURE.md) for authorization and data flow.

## Documentation

- [AGENTS.md](./AGENTS.md): development conventions and module ownership.
- [Architecture](./DOCS/ARCHITECTURE.md): runtime boundaries and data flow.
- [Design guide](./DOCS/REDESIGN.md): tokens, public UI, and audio.
- [TODO](./DOCS/TODO.md): outstanding work.
