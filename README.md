# Personal Site

An English-only personal site and single-owner CMS built with Next.js 16,
React 19, BlockNote, Supabase, StyleX, and Bun. The public reading desk and
administration dashboard share design tokens and appearance preferences.
Development conventions and module ownership live in [AGENTS.md](./AGENTS.md).

## Getting Started

Use the Bun version declared in `package.json`, Node.js 20.9+, and a running
Docker-compatible runtime for local Supabase.

```bash
bun install
bun run supabase:setup
```

Setup writes local Supabase credentials to `.env.development`, preserving other
values. Add a non-empty `ADMIN_TOKEN`, then run `bun run dev`.
Open [the site](http://localhost:3000), [sign in](http://localhost:3000/auth), or
open [Supabase Studio](http://localhost:54323). For hosted Supabase, configure
its keys instead of running local setup.

### Environment Variables

- `ADMIN_TOKEN`: Server-only dashboard access token; empty or missing disables login.
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase API URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Public Supabase key.
- `SUPABASE_SERVICE_ROLE_KEY`: Server-only key for authorized content and storage operations.
- `NEXT_PUBLIC_APP_TIMEZONE`: Optional display and editor timezone.

Keep environment files out of Git and restart after changes. Rotating `ADMIN_TOKEN`
invalidates existing sessions; sessions expire after seven days. There are no user
accounts, OAuth flows, webhook secrets, or Supabase Auth login requirements.
Development accepts IPv4 origins and IPv6 loopback through `allowedDevOrigins`;
the IPv4 matcher is `*.*.*.*`, not a bare `*`.

## Development

- Develop: `bun run dev`
- Build / serve production: `bun run build` / `bun run start`
- Check formatting, lint, and types: `bun run check`
- Fix affected files: `bun run fmt:fix -- <paths>` / `bun run lint:fix -- <paths>`
- Run tests: `bun run test`
- Regenerate icons: `bun run gen:icons`

### Verification

Format and lint affected files, review the diff, then run `bun run check`, relevant
tests, and `git diff --check`. Runtime, routing, and caching changes also require
`bun run build`. Verify changed UI flows in a browser, including authorization,
saves, uploads, and narrow layouts. Bun tests live beside their owning modules
and cover data integrity, authorization, compatibility, and domain logic.

`bun scripts/verify-desk-rpc.ts` creates and removes an isolated temporary database
inside the local Supabase container. It verifies RPC permissions, concurrent
updates, audio task ownership, schema migration, and seed loading without resetting
application data. Override the container with `SUPABASE_DB_CONTAINER` if needed.

GitHub Actions runs formatting, lint, types, and tests. Husky's pre-commit hook runs
`bun run check` without staging or rewriting files; `bun run prepare` reinstalls it.

## Content and Files

`/dashboard` opens Posts; navigation also includes Homepage, Thoughts, Guestbook,
and Files. Content uses BlockNote with manual saving, publish time, and visibility.
New entries start hidden. Show makes content public regardless of its publish time.

Posts derive their title from the first top-level heading in `content`;
there is no separate title column. Posts require a title of at most 500 characters.
Thoughts can contain text or media without a title. Articles render
the title once and build a table of contents from the remaining headings.
Content retains its original language; interface copy uses the shared English
dictionary. There are no locale routes or translation storage.

The editor supports native columns, media, saved link cards, highlighted code, and
PlantUML blocks. Reading pages use the saved document. Public lists, articles, and
rendering use Cache Components; content mutations invalidate their cache tags.
The public pages are `/`, `/posts`, `/posts/<uuid>`, `/thoughts`, and `/system`.

`/dashboard/home` manages the homepage introduction, social links, book and note
copy, display terminal passages, and music playlist. Save changes publishes the
whole content form; Discard changes restores its last saved state. Failed saves
and expired sessions retain the current inputs. View homepage opens the published
page in a new tab. Unsaved changes prompt before dashboard links, logout, refresh,
or closing the page; drafts are kept only in page memory, without browser-history
interception or recovery after leaving the page.

Audio uploads, imports, and retries run independently of the content draft.
Browser uploads must finish before leaving; server-side processing continues
afterward. Playlist changes publish only when saved. Removing a playlist entry
does not delete the recording. Passage and playlist order use move up/down buttons.

Files use the public `files` bucket, up to 50 MiB per file. Browser compression
converts JPEG, PNG, and WebP images to WebP (1920px maximum, 2 MB target); other file
types retain their bytes. Uploads use unique paths and server-issued signed tokens.
The service-role key stays on the server. A public file URL exposes its bytes even
when referenced only by hidden content. Deleting a document leaves its files intact;
deleting a file breaks existing references. `/dashboard/images` redirects to Files.

## Database

The application tables are `posts`, `thoughts`, and `configs`. Anonymous
reads of content tables are restricted to published rows. Configs are private;
constrained RPCs expose public desk data and interactions. Dashboard reads and
writes require the admin session, with privileged database I/O on the server.

`desk.*` keys hold counters, guestbook data, and the saved homepage content.
Each `audio.asset.<id>` key holds one audio resource and its processing state.
The desk playlist references asset IDs; saving the desk does not overwrite audio
jobs. Guestbook notes are public immediately, including optional email addresses;
moderation lives at `/dashboard/guestbook`. `desk.configuration` contains only
`items` with `id`, `type`, `name`, and content `config`. IDs and item types are
unique; missing items and empty playlists remain absent. A null configuration
uses the source-controlled defaults. Layout and appearance belong to the public
components, not the database or browser storage. The public homepage has no
administration mode; dashboard reads and content/audio actions authenticate with
the admin token session. Saving homepage content also invalidates public audio
selection through the shared desk configuration cache tag.

Schema sources are in `supabase/schemas`: `02_tables.sql` holds application
tables and indexes, `03_defaults.sql` provisions required records and buckets,
`04_rpc.sql` holds all RPC definitions and their execute grants, and
`05_security.sql` holds table grants and RLS policies. Numbered files load in
dependency order. Demo fixtures are in `supabase/seed.sql`.
The CLI loads both through its seed configuration; this repository does not keep
migration history. For a disposable local database only:

```bash
bunx supabase db reset --local
bun run supabase:types
```

Reset deletes local data. `--no-seed` skips both application schemas and fixtures.
`supabase:setup` starts services and refreshes environment variables but does not
apply schema changes. Use `bunx supabase stop` to stop services while preserving data.
Demo fixtures use stable IDs and `ON CONFLICT DO NOTHING`; reapplying their blocks
preserves edited records. Generate committed Supabase types from the maintained
schemas. If your database retains unrelated legacy objects, use an isolated database
initialized from these schemas with `bunx supabase gen types --db-url <connection>
--schema public`, rather than adding historical types to the application.

The Events feature and its desktop calendar are retired. Existing databases may
retain their unused `events` table and records; this source change does not delete
them. Apply the updated `04_rpc.sql` definitions to remove the old count and visit
path from public RPCs. Before deploying this version to an existing database,
remove items with type `calendar` from `desk.configuration`.

The homepage uses a scattered composition at every breakpoint. Smaller screens
reflow objects into staggered groups with different horizontal offsets, spacing,
and angles rather than equal columns or centered rows. Paper layers use rigid
rotation, without shearing their shapes or text. Every breakpoint keeps
all configured objects, including the coffee and pencil. The wide desktop
homepage does not scroll; object sizes respond to the window height. The lamp
and introduction share a centered axis, and introduction and note text have no
internal scroll containers. Tablet and phone layouts scroll vertically.
Article routes retain their own scrolling behavior. The display uses a real
responsive width and stacks guestbook fields on narrow screens. Visitors cannot
drag, resize, shuffle, or save object positions; legacy browser positions are
ignored. Existing typography, lighting, and light/dark themes remain shared tokens.

### Upgrade Existing Data

To remove obsolete homepage layout/appearance fields, stored content titles, and
move the old audio table into configs without resetting data, first run the
read-only check:

```bash
bun scripts/simplify-database.ts
```

For the homepage content cutover, pause management writes and wait for active
imports to finish. Deploy the updated application before removing stored layout
fields: it accepts both old objects and the new content-only objects. Then apply
the cleanup and reopen management pages with the new application. For installations
that also require the older title/audio migration, keep the application paused
through the entire migration and restart only after the matching schema is ready:

```bash
bun scripts/simplify-database.ts --apply
bun run supabase:types
```

The script defaults to Docker container `supabase_db_personal-site`, database
`postgres`. Override with `SUPABASE_DB_CONTAINER` / `SUPABASE_DB_NAME`. For hosted
PostgreSQL, set `DATABASE_URL` privately in the process environment and install
`psql` and `pg_dump` compatible with the server version. The same commands then
target that database. Coordinate the maintenance window with deployment: the old
application cannot write after the title columns and audio table are removed.

Apply writes a full `database.dump` and `before.json` outside Git, by default under
`~/backups/personal-site/schema-simplification-<timestamp>/`; override with
`MIGRATION_BACKUP_DIR`. It aborts on mismatched titles, conflicting config records,
active audio jobs, or data changes after preflight. A locked transaction normalizes legacy config JSON to JSONB, copies and
checks every audio field, replaces the RPC source, then removes the old table and
columns. The homepage cleanup removes only `layouts` and item `appearance`,
preserving item IDs, types, names, content, playlist order, empty playlists, and
null defaults. Invalid content or duplicate item types abort preflight rather than
discarding data. Repeating a completed migration is a no-op. It does not move or delete
Storage objects or create migration history.

Afterward verify record counts, titles, Homepage saves, playlists, and audio imports.
Rolling back to an application that requires layouts also requires restoring the
matching configuration snapshot. For
recovery, restore the dump into an isolated database with `pg_restore` and pair the
recovered database with the previous application revision. Reconcile any newer
writes before switching back. PostgreSQL dumps contain Storage metadata, not file
bytes; preserve the existing buckets. Earlier CMS conversion backups remain under
`~/backups/personal-site/2026-09-13-production-migration/`; keep those archives and
Storage objects until explicitly retired.

## Audio Imports

Files and public HTTP(S) audio URLs are limited to 50 MiB and 15 minutes. Uploads
use signed Storage credentials; processing continues after the editor closes.
Reopen the audio library to select completed recordings or retry failures.
Removing a playlist entry leaves the stored audio and spectrum files intact.

Audio records retain source paths, metadata, playback URLs, spectrum state, and
job ownership in configs. Only the service role may call `update_audio_asset`;
it compares `run_id` and merges the patch atomically. `read_desk_audio` returns
only selected, ready recordings and playback fields. Expired imports can be
retried; a frequency-analysis failure does not discard playable audio.

The built-in recordings are the original 16-second “A quiet morning” and
“Miku feat. Hatsune Miku” by Anamanaguchi, obtained from the
[artist's track page](https://anamanaguchi.bandcamp.com/track/miku-feat-hatsune-miku).
Their audio, precomputed spectra, and non-lyrical VTT descriptions live in
`public/redesign`. Regenerate the original recording with
`bun scripts/generate-redesign-audio.ts`, and spectra with `bun run audio:analyze`.
The latter requires FFmpeg or macOS `afconvert`. Playback uses local assets and
precomputed spectra; no browser audio-analysis graph is required.

## Deployment

Provision the maintained database schema before building against a hosted project;
homepage prerendering requires the desk configuration and audio RPCs. For an
existing database, use the checked upgrade procedure above instead of reset.
Configure the environment variables on the host, then build and deploy the matching
application revision. Verify an article and a real audio import on the deployed host.

Audio processing runs in a Node.js Vercel Function with Fluid compute and
`maxDuration = 300`. Install dependencies on the target platform: `ffmpeg-static`
must match its OS. Next.js traces the binary for `/api/admin/audio/import`.
Confirm it is executable and within the deployment bundle limit. Processing is
bounded background work, not a durable queue; interrupted jobs require manual
retry. Verify file upload, URL import, and spectrum-only retry on the deployed
Function, since a successful macOS decode does not validate the Linux artifact.

Keep the `jsdom` 26.1.0 override and the BlockNote server-renderer DOM-origin patch
until upstream works with Lambda's disabled `require(esm)` support and a production
article renders successfully. The document tests include the restricted native
Node check; Bun-only tests cannot reproduce that module-loading failure.

## License

Project code is [GPL-3.0-only](./LICENSE). The official BlockNote multi-column
extension uses its GPL-3.0 option. Dependencies and media retain their own licenses;
blog posts, photographs, and other authored content are not covered by the software
license. Corresponding source is available at
[muyu258/personal-site](https://github.com/muyu258/personal-site).
