# Personal Site

An English-only personal site and single-owner CMS using Next.js 16, React 19,
BlockNote, Supabase, StyleX, and Bun. Development rules live in [AGENTS.md](./AGENTS.md).

## Getting Started

Use the Bun version in `package.json`, Node.js 20.9+, and Docker for local Supabase.

```bash
bun install
bun run supabase:setup
```

Setup writes local credentials to `.env.development`, preserving other values.
Add `ADMIN_TOKEN`, then run `bun run dev`. Open [the site](http://localhost:3000),
[sign in](http://localhost:3000/auth), or visit [Studio](http://localhost:54323).
For hosted Supabase, configure its keys instead of running local setup.

### Environment Variables

- `ADMIN_TOKEN`: Server-only dashboard token; missing or empty disables login.
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase API URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Public Supabase key.
- `SUPABASE_SERVICE_ROLE_KEY`: Server-only content and storage key.
- `NEXT_PUBLIC_APP_TIMEZONE`: Optional display and editor timezone.

Keep environment files out of Git and restart after changes. Sessions last seven
days; rotating `ADMIN_TOKEN` invalidates them. Supabase Auth is not used.
Development allows IPv4 origins (`*.*.*.*`) and IPv6 loopback.

## Development

- Develop: `bun run dev`
- Build / serve: `bun run build` / `bun run start`
- Check formatting, lint, and types: `bun run check`
- Fix affected files: `bun run fmt:fix -- <paths>` / `bun run lint:fix -- <paths>`
- Test: `bun run test`

### Verification

Format and lint affected files, review the diff, then run `bun run check`, relevant
tests, and `git diff --check`. Build after runtime, routing, or caching changes;
verify changed UI flows in a browser, including authorization, saves, uploads, and
narrow layouts. Colocated tests cover data integrity, authorization, compatibility,
and domain logic.

`bun scripts/verify-desk-rpc.ts` verifies permissions, concurrent updates, audio
ownership, migration, and fixtures in an isolated temporary database inside local
Supabase. It leaves application data intact; `SUPABASE_DB_CONTAINER` overrides the
container. GitHub Actions runs checks and tests. Husky runs non-mutating
`bun run check` before commits; `bun run prepare` reinstalls the hook.

## Content and Files

Posts and Thoughts use BlockNote, manual saving, visibility, and publish time.
New entries start hidden; Show publishes regardless of publish time. Post titles
come from the first top-level heading and must be at most 500 characters;
Thoughts need no title. Content retains its original language. Public routes are
`/`, `/posts`, `/posts/<uuid>`, `/thoughts`, and `/system`; mutations invalidate
Cache Components tags.

`/dashboard/home` edits introduction, social links, book/note copy, terminal
passages, and playlists. Save publishes the whole form; Discard restores the saved
state. Failed saves retain inputs, and leaving prompts for unsaved changes. Drafts
exist only in page memory. Audio processing runs independently: browser uploads
must finish before leaving, but server jobs continue. Playlist edits publish on
save; removing an entry does not delete its recording.

Files use the public `files` bucket, unique paths, and server-issued signed upload
tokens, with a 50 MiB limit. JPEG, PNG, and WebP uploads are compressed to WebP
(1920px maximum, 2 MB target); other bytes are preserved. File URLs remain public
when used by hidden content. Deleting content retains files; deleting files breaks
references. `/dashboard/images` redirects to Files.

## Database

Tables are `posts`, `thoughts`, and `configs`. Anonymous content reads expose only
published rows; configs are private and constrained RPCs expose desk data.
Dashboard access requires the admin session; privileged I/O stays on the server.
`desk.configuration` stores item IDs, unique types, names, and content config.
Missing items and empty playlists stay absent; null uses source defaults.
Composition and appearance belong to public components. Guestbook entries,
including optional email addresses, are immediately public; moderate them at
`/dashboard/guestbook`.

Maintain numbered schemas in `supabase/schemas`: tables/indexes in `02_tables.sql`,
required records/buckets in `03_defaults.sql`, RPCs/grants in `04_rpc.sql`, and
security in `05_security.sql`. Demo fixtures are in `supabase/seed.sql`. The CLI
loads both as seeds; there is no migration history. For disposable local data:

```bash
bunx supabase db reset --local
bun run supabase:types
```

Reset deletes data; `--no-seed` skips application schemas and fixtures.
`supabase:setup` does not apply schema changes. `bunx supabase stop` preserves data.
Fixtures use stable IDs and `ON CONFLICT DO NOTHING` to preserve edits.
Regenerate types from maintained schemas; if local legacy objects remain, use an
isolated database and `bunx supabase gen types --db-url <connection> --schema public`.

Existing installations may retain the retired `events` table; it is not deleted.
Apply current `04_rpc.sql` definitions and remove `calendar` items from
`desk.configuration` before deployment.

### Upgrade Existing Data

To remove obsolete layout/appearance fields and stored titles, and migrate the old
audio table to configs, first run the read-only preflight:

```bash
bun scripts/simplify-database.ts
```

Pause management writes and finish active imports. For the homepage-only cleanup,
deploy the compatible application first, apply cleanup, then reopen management.
If title/audio migration is also needed, keep the application paused until the
matching schema is ready; the old application cannot write after those removals.

```bash
bun scripts/simplify-database.ts --apply
bun run supabase:types
```

Defaults are container `supabase_db_personal-site` and database `postgres`;
override with `SUPABASE_DB_CONTAINER` / `SUPABASE_DB_NAME`. For hosted PostgreSQL,
privately set `DATABASE_URL` and install server-compatible `psql` and `pg_dump`.

Apply saves a full `database.dump` and `before.json` outside Git under
`~/backups/personal-site/schema-simplification-<timestamp>/` (override with
`MIGRATION_BACKUP_DIR`). Preflight rejects conflicting titles/configs, active jobs,
invalid content, and duplicate types; changed data aborts the locked transaction.
The transaction normalizes config JSON, verifies copied audio fields, replaces
RPCs, and removes obsolete structures. It preserves content, IDs, names, playlist
order, empty playlists, and null defaults. Repeating it is a no-op; Storage bytes
are untouched.

Verify counts, titles, Homepage saves, playlists, and imports afterward. To recover,
restore the dump into an isolated database with `pg_restore`, pair it with the
previous application revision, and reconcile newer writes before switching.
Layout-dependent rollbacks also need the matching configuration snapshot. Dumps
contain Storage metadata, not bytes: preserve buckets and earlier conversion
backups at `~/backups/personal-site/2026-09-13-production-migration/` until retired.

## Audio Imports

Uploads and public HTTP(S) imports support at most 50 MiB and 15 minutes.
Each private `audio.asset.<id>` config owns its metadata and processing state,
separate from the desk draft. Service-role `update_audio_asset` atomically merges
updates only for the matching `run_id`; `read_desk_audio` exposes selected, ready
recordings. Desk saves invalidate public audio selection. Reopen the library to
select completed recordings or retry expired/failed jobs; spectrum failure retains
playable audio.

Built-in recordings are the original 16-second “A quiet morning” and
“Miku feat. Hatsune Miku” by Anamanaguchi from the
[artist's track page](https://anamanaguchi.bandcamp.com/track/miku-feat-hatsune-miku).
Audio, precomputed spectra, and non-lyrical VTT descriptions live in `public/audio`;
six exact `/redesign/` rewrites preserve saved URLs. Regenerate the original with
`bun scripts/generate-audio.ts` and spectra with `bun run audio:analyze`
(requires FFmpeg or macOS `afconvert`). Playback uses precomputed spectra.

## Deployment

Provision maintained schemas before building against hosted Supabase; homepage
prerendering needs desk/audio RPCs. Use the upgrade procedure for existing data.
Configure environment variables, deploy the matching application, and verify an
article, file upload, URL audio import, and spectrum-only retry on the host.

Audio runs in a Node.js Vercel Function with Fluid compute and `maxDuration = 300`.
Install dependencies on the target OS; Next.js traces `ffmpeg-static` for
`/api/admin/audio/import`. Check binary execution and bundle size on the host;
macOS decoding does not validate Linux deployment. Interrupted background jobs
require manual retry; processing is not a durable queue.

Keep the `jsdom` 26.1.0 override for Lambda's disabled `require(esm)` support and
the BlockNote DOM-origin patch so toggle content can render without opaque-origin
storage errors. Remove them only after restricted native Node tests and a
production article render pass with upstream replacements; Bun alone cannot
verify the module-loading constraint.

## License

Code is [GPL-3.0-only](./LICENSE); BlockNote multi-column uses its GPL-3.0 option.
Dependencies and media retain their licenses; posts, photographs, and other
authored content are outside the software license. Corresponding source:
[muyu258/personal-site](https://github.com/muyu258/personal-site).
