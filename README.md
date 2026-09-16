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
saves, uploads, and narrow layouts. The five Bun suites cover authentication,
documents, file safety, and theme initialization.

`bun scripts/verify-desk-rpc.ts` creates and removes an isolated temporary database
inside the local Supabase container. It verifies RPC permissions, concurrent
updates, audio task ownership, schema migration, and seed loading without resetting
application data. Override the container with `SUPABASE_DB_CONTAINER` if needed.

GitHub Actions runs formatting, lint, types, and tests. Husky's pre-commit hook runs
`bun run check` without staging or rewriting files; `bun run prepare` reinstalls it.

## Content and Files

`/dashboard` opens Posts; navigation also includes Thoughts, Events, Guestbook, and
Files. Content uses BlockNote with manual saving, publish time, and visibility.
New entries start hidden. Show makes content public regardless of its publish time.

Posts and Events derive their title from the first top-level heading in `content`;
there is no separate title column. Posts require a title of at most 500 characters;
Events allow no title and accept headings up to 255 characters. Articles render
the title once and build a table of contents from the remaining headings.
Content retains its original language; interface copy uses the shared English
dictionary. There are no locale routes or translation storage.

The editor supports native columns, media, saved link cards, highlighted code, and
PlantUML blocks. Reading pages use the saved document. Public lists, articles, and
rendering use Cache Components; content mutations invalidate their cache tags.
The public pages are `/`, `/posts`, `/posts/<uuid>`, `/thoughts`, `/events`, and `/system`.

Files use the public `files` bucket, up to 50 MiB per file. Browser compression
converts JPEG, PNG, and WebP images to WebP (1920px maximum, 2 MB target); other file
types retain their bytes. Uploads use unique paths and server-issued signed tokens.
The service-role key stays on the server. A public file URL exposes its bytes even
when referenced only by hidden content. Deleting a document leaves its files intact;
deleting a file breaks existing references. `/dashboard/images` redirects to Files.

## Database

The application tables are `posts`, `thoughts`, `events`, and `configs`. Anonymous
reads of content tables are restricted to published rows. Configs are private;
constrained RPCs expose public desk data and interactions. Dashboard reads and
writes require the admin session, with privileged database I/O on the server.

`desk.*` keys hold counters, guestbook data, and the saved desk configuration.
Each `audio.asset.<id>` key holds one audio resource and its processing state.
The desk playlist references asset IDs; saving the desk does not overwrite audio
jobs. Guestbook notes are public immediately, including optional email addresses;
moderation lives at `/dashboard/guestbook`. Visitor desk positions remain local to
the browser; administrator changes persist to the saved configuration.

Schema sources are in `supabase/schemas`; fixtures are in `supabase/seed.sql`.
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

### Upgrade Existing Data

To remove stored content titles and move the old audio table into configs without
resetting data, first run the read-only check:

```bash
bun scripts/simplify-database.ts
```

Pause the application and all content/audio writers; wait for active imports to
finish. Then apply, regenerate types, and restart with the updated application:

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
columns. Repeating a completed migration is a no-op. It does not move or delete
Storage objects or create migration history.

Afterward verify record counts, titles, playlists, saves, and audio imports. For
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
