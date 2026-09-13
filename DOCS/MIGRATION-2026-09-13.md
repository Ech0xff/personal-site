# Production CMS Migration — September 13, 2026

This one-time cutover adapts the former Markdown CMS to the declarative schemas
in `supabase/schemas`. It does not introduce migration history or a runtime
Markdown importer. Follow [README](../README.md#database) for ordinary database
work.

## Data Mapping

The migration preserves all 17 Posts, 6 Thoughts, and 1 Event, including UUIDs,
original-language text, publication timestamps, and visibility. Four Posts remain
hidden. Stored Post and Event titles become the first document heading. Thought
image arrays become image blocks. External `:ref{...}` directives become links.
All 180 fenced code blocks retain their source. The 22 PlantUML diagrams become
locally rendered PNG images with the original source inside a toggle block.

The active public tables are `posts`, `thoughts`, `events`, and `configs`.
The 33 existing config values remain intact as JSONB; the application continues
using the source-controlled English dictionary. Retired tags and relationships
are preserved in `legacy.tags`, `legacy.post_tags`, `legacy.thought_tags`, and
`legacy.event_tags` config keys. `legacy.content-metadata` preserves fields
removed from the content tables, including authors, original image arrays, and
location values. These config entries are accessible only to server operations.

All eight original application tables and five original functions are retained
in the private `legacy_20260913` schema. Anonymous, authenticated, and service-role
clients have no access to that archive. Existing Supabase Auth records are kept;
the application now authenticates administrators with `ADMIN_TOKEN`.

The three original image objects are copied byte-for-byte into `files/legacy/`.
The `images` bucket remains available so existing external links keep working.
The 22 generated diagrams use `files/migration-20260913/`. Every copy is checked
by SHA-256. The new bucket follows the existing public-file policy and 50 MiB
limit described in [README](../README.md#files).

## Backups and Recovery

Private operational artifacts are stored outside Git in the owner's
`~/backups/personal-site/2026-09-13-production-migration/` directory:

- `production.dump`: full PostgreSQL custom-format logical backup.
- `application.dump`: application, Auth, and Storage schema/data backup.
- `before.json`: consistent row snapshot and database definitions.
- `storage/` and `storage-manifest.json`: original object bytes and checksums.
- `repository.bundle`: Git history and branch references before the cutover.
- `migration.sql`, `rollback.sql`, conversion scripts, and verification reports.

Backups and migration SQL contain private data and must never be committed.
PostgreSQL backups contain Storage metadata; the separate object backup contains
the actual file bytes. Platform roles and provider configuration remain managed
by Supabase.

The previous remote `main` is retained at
`codex/backup-production-main-20260913` (`13f1962`). The previous local `main` is
retained at `codex/backup-local-main-20260913`. The final main update uses an
explicit Git lease against the inspected remote commit.

`rollback.sql` preserves the new tables and functions in
`rollback_new_20260913`, restores the archived application objects to `public`,
and restores the legacy storage policy. Pair database rollback with the previous
application deployment. If editors have saved new data after cutover, reconcile
those writes before rolling back. Keep both Storage buckets and the private
archive until a separate cleanup is explicitly approved.

## Verification

The application backup was restored into an isolated local database with the
required extensions and Storage grants. Migration and rollback were executed
there; all eight restored source tables matched the original snapshot. The
migration was then reapplied and checked against every converted record.

Checks cover record values, title derivation, all original prose and code blocks,
metadata retention, published-only anonymous reads, privileged server reads,
private archives/configs, restricted file and moderation RPCs, and desk RPC
responses. The migration locks source tables and aborts if any source row changed
since the inspected snapshot. It swaps the application schema in one transaction
and reloads the PostgREST schema cache. No remote reset or demo seed is used.

Production deployment requires a non-empty `ADMIN_TOKEN` configured in Vercel.
Without it, the public site works but administrator login remains disabled.
The owner configured this as a Production Secret during the cutover.

The production schema transaction completed on September 13, 2026 at 15:26 UTC.
Database verification matched all 24 converted documents and confirmed the 25
files, retained config values, public visibility, and restricted permissions.
The local and remote `main` branches were then replaced by the redesign branch.
