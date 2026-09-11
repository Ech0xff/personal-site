# Personal Site

A personal site and lightweight CMS built with Next.js 16, React 19, Supabase, and Tailwind CSS 4.

It includes a public-facing site for posts, thoughts, and events, plus an English-language dashboard for content, tags, images, config, and account management.

## Features

- Public pages for posts, thoughts, and events
- Dashboard for managing posts, thoughts, events, tags, images, site config, and account info
- Supabase-backed auth, database, and storage
- English interface with language-free routes and original-language business content
- Markdown rendering with GFM, syntax highlighting, heading anchors, and custom directives
- PlantUML code block rendering through the public PlantUML server
- Click-to-open image preview
- Cache revalidation webhook for content updates

## Tech Stack

- [Next.js 16](https://nextjs.org/) with App Router
- [React 19](https://react.dev/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Supabase](https://supabase.com/)
- [react-markdown](https://github.com/remarkjs/react-markdown)
- [remark-gfm](https://github.com/remarkjs/remark-gfm)
- [remark-directive](https://github.com/remarkjs/remark-directive)
- [rehype-prism-plus](https://github.com/timlrx/rehype-prism-plus)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide React](https://lucide.dev/)
- [Bun](https://bun.sh/) for local scripts and package management

## Prerequisites

- Node.js 20.9+
- Bun
- Database access: Docker Desktop (or another Docker-compatible runtime) for
  local development, a Supabase project for remote development, or both

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/muyu258/personal-site.git
cd personal-site
```

### 2. Install dependencies

```bash
bun install
```

### 3. Start the local database

Make sure Docker Desktop is running, then run:

```bash
bun run supabase:setup
```

This starts the local Supabase services and writes the local API URL, anon key,
and service-role key to `.env.development`. Existing non-Supabase values in that
file are preserved.

### 4. Configure environment variables

If you used `bun run supabase:setup`, this mapping is done automatically. The
values come from `bunx supabase status`:

- API URL to `NEXT_PUBLIC_SUPABASE_URL`
- anon key to `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- service role key to `SUPABASE_SERVICE_ROLE_KEY`
- any private local value to `WEBHOOK_SECRET`

`NEXT_PUBLIC_APP_TIMEZONE` is optional.
Edit `.env.development` to set `WEBHOOK_SECRET` and any optional application values.
The file is ignored by Git.

Supabase Studio is available at [http://localhost:54323](http://localhost:54323).
The local email inbox is available at
[http://localhost:54324](http://localhost:54324).

### 5. Start the development server

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 6. Access the dashboard

Open [http://localhost:3000/en-US/auth](http://localhost:3000/en-US/auth) or [http://localhost:3000/zh-CN/auth](http://localhost:3000/zh-CN/auth).

The auth page supports email/password sign-in and sign-up, and the dashboard `Config` page controls which OAuth providers are available.

The home page intro markdown and playlist URL are configured in the dashboard `Config` page, not through environment variables.

If you need admin access for an existing user, use the interactive maintenance menu:

```bash
bun run menu dev
```

Then choose `Promote user to admin`.

## Database

### Local

| Command                                    | Use                                             |
| ------------------------------------------ | ----------------------------------------------- |
| `bunx supabase start`                      | Start local Supabase services.                  |
| `bunx supabase status`                     | Get local URLs and keys for `.env.development`. |
| `bun run supabase:setup`                   | Start Supabase and update `.env.development`.   |
| `bun run supabase:env`                     | Update Supabase values in `.env.development`.   |
| `bunx supabase db reset --local`           | Rebuild the local schema and fixtures.          |
| `bunx supabase db reset --local --no-seed` | Rebuild an empty local database.                |
| `bun run supabase:types`                   | Regenerate local database types.                |
| `bunx supabase stop`                       | Stop Supabase while preserving local data.      |

The files under `supabase/schemas` describe the local database structure. After
changing them, rebuild the local database with `bunx supabase db reset --local`,
then regenerate types with `bun run supabase:types`. This repository does not
use Supabase migration history for schema deployment.
The local seed also creates the public `images` storage bucket; uploads and
deletions remain restricted to admins by the storage policy.

Next.js automatically loads `.env.development` during local development.
Environment files are loaded when Next.js starts;
restart the dev server after changing them.

## Markdown Support

Content is rendered with `react-markdown`, `remark-gfm`, and custom directive handling.

### PlantUML

Use a fenced code block with `plantuml` or `puml`:

````md
```plantuml
@startuml
Alice -> Bob: Hello
Bob --> Alice: Hi
@enduml
```
````

The client compresses and encodes the source, then requests SVG output from the public PlantUML server:

```txt
https://www.plantuml.com/plantuml/svg/{encoded}
```

Because diagrams are sent to a public service, avoid putting sensitive content in PlantUML blocks.

### Custom directives

The renderer also supports custom directives such as:

- `:ref[...]` for linking to posts, thoughts, events, files, or external URLs
- `::card{title="..." tone="info"}` for callout-style content blocks
- `:meta{url="https://..."}` for URL metadata cards

## English-only migration

Routes are `/`, `/posts`, `/thoughts`, `/events`, `/auth`, and `/dashboard/*`.
Old language-prefixed URLs and translation-preview URLs return 404; there are
no compatibility redirects. OAuth returns through `/api/auth/callback` to
`/dashboard/account` or `/auth`.

Before deploying to an existing database, apply
[`supabase/updates/english-only.sql`](./supabase/updates/english-only.sql) with
`psql -v ON_ERROR_STOP=1` or the Supabase SQL editor. For the local database:

```bash
psql postgresql://postgres:postgres@127.0.0.1:54322/postgres -v ON_ERROR_STOP=1 -f supabase/updates/english-only.sql
bun run supabase:types
```

The transaction copies English `ABOUT_ME`, `PLAYLIST_URL`, and `RECENT_PLAN`
configuration and dictionary overrides into language-free keys, including
historical camel-case keys.
English content settings replace unused unscoped values; existing global OAuth
settings remain unchanged. It
removes old language keys and drops `translation_cache`
without resetting posts, thoughts, events, tags, images, or their relationships.
Reapplying it preserves subsequent configuration edits. Fresh databases use
`supabase/schemas` and `supabase/seed.sql` directly.

### Editable dictionary

Open **Dashboard → Config → Dictionary** to customize site metadata, homepage,
navigation, search, authentication, and other dictionary-backed copy. **Defaults**
shows all available fields; **Overrides** accepts a partial JSON object and
**Effective** shows the merged result. For example:

```json
{
  "meta": { "siteTitle": "My personal site" },
  "home": { "hero": "Welcome", "bio": "Notes from my corner of the web." },
  "footer": { "filing": "© 2026 My name" }
}
```

Missing fields use `src/lib/shared/dictionary/dictionary.const.ts` defaults.
Arrays such as `home.typing` are replaced completely. Delete an override field to
restore that field's default, or use **Delete** to remove the stored override.
Unknown keys, incorrect value types, invalid message syntax, and unsupported
placeholders are rejected. Dynamic copy supports existing ICU placeholders,
plural forms, and explicitly rendered rich-text tags; overrides are never raw HTML.

The dictionary is stored under the global `DICTIONARY` config key. Saving or
deleting config uses an authenticated admin Server Action, expires the config
cache, and refreshes the current route. Updated metadata and copy appear on the
next render without redeploying. Other already-open browser tabs need a refresh.
No locale selection, language cookies, or translation API is involved.

About Me, recent plans, playlists, and OAuth remain separately editable. Remove
`TRANSLATION_AI_*` variables from deployed environments.
Restart or redeploy after migration to discard cached old configuration and
routes; rebind the ordinary content webhooks if needed. Webhooks only refresh
business caches and require `Authorization: Bearer <WEBHOOK_SECRET>`.

## Scripts

- `bun run dev` - start the Next.js dev server
- `bun run build` - build for production
- `bun run start` - start the production server
- `bun run lint` - run Oxlint checks
- `bun run lint:fix` - apply Oxlint fixes
- `bun run fmt` - check Oxfmt formatting
- `bun run fmt:fix` - apply Oxfmt formatting
- `bun run typecheck` - run TypeScript checks
- `bun run check` - run formatting, lint, and TypeScript checks
- `bun run test` - run Bun tests
- `bun run menu dev` - open the interactive maintenance menu with `.env.development`
- `bun run menu prod` - open the interactive maintenance menu with `.env.production`
- `bun run gen:icons` - regenerate icon components from `public/svg-icons`
- `bun run supabase:setup` - start local Supabase and generate `.env.development`
- `bun run supabase:env` - refresh local Supabase values in `.env.development`
- `bun run supabase:types` - generate Supabase types from the local database

Supabase operations are intentionally kept explicit. Use the local commands
above so the target database is clear.

The interactive menu currently includes:

- Rebind webhooks
- Promote user to admin

## Verification

GitHub Actions runs `fmt`, `lint`, `typecheck`, and `test` on branch pushes.
Pushes do not automatically create pull requests.

`bun install` installs the Husky Git hooks. Before each commit, the pre-commit
hook runs `bun run check` against the whole working tree, including unstaged
changes, and blocks the commit if formatting, lint, or TypeScript checks fail.
The hook does not modify or stage files. Use `bun run fmt:fix` and
`bun run lint:fix` to apply fixes, review them, and stage the intended changes
before retrying. Run `bun run prepare` to reinstall hooks if needed.

Use the relevant checks locally; Markdown-only edits need formatting checks.
Formatter and lint rules live in `.oxfmtrc.json` and `.oxlintrc.json`.

Source filenames follow `subject.role.ts(x)` with framework, generated,
index, and tool exceptions. Keep page-level hooks in `_hooks` and editor-private
hooks beside their editor. See [AGENTS.md](./AGENTS.md#file-naming) for naming
rules and [Architecture](./DOCS/ARCHITECTURE.md#module-ownership) for ownership.

Thought image URLs are deduplicated at the service read/write boundary, keeping
their first occurrence and order. Uploads maintain the same invariant in editor
state, so image lists can use URLs as stable keys. Recent-plan row IDs exist
only in editor state and are omitted from saved configuration.

For routing, cache, or server/client integration changes, also check a production
build with `bun run build`. CI does not build the app. There is currently no
browser test suite; verify affected behavior in the running app: auth roles, cache invalidation, or light/dark and mobile/desktop layouts.

### English-only verification

Verify public routes and original Chinese/English search results, sign-in and
sign-out, dashboard editing, configuration saves, and authenticated cache
refreshes. Confirm `/en-US`, `/zh-CN`, and translation-preview paths return 404.
Check `<html lang="en">` and that no language cookies or translation API calls
are used. Save a partial dictionary override, verify metadata and client/server
copy after refresh, then delete it and verify the defaults return. Compare business-table and image-record digests
before and after applying the SQL update. No new mock or test suite is required.

For schema experiments, use an isolated Supabase workdir with a distinct project
ID and unused ports. Do not reset a database containing content you need to keep.

## Project Structure

```txt
.
├── scripts/                 # Interactive maintenance utilities
├── src/
│   ├── app/                 # App Router pages and API routes
│   ├── components/          # Shared UI and feature components
│   ├── lib/                 # Client/server/shared helpers
│   ├── styles/              # Global styles
│   └── types/               # Shared TypeScript types
├── supabase/
│   ├── config.toml          # Local Supabase CLI configuration
│   ├── schemas/              # Local schema source files
│   └── seed.sql              # Local development fixtures
└── public/                  # Static assets
```

## Deployment Notes

For deployment, provide the same environment variables as local development, especially:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `WEBHOOK_SECRET`

If OAuth is enabled, make sure your Supabase auth redirect URLs include your deployed site URL and the callback route.

## Documentation

- [Development conventions](./AGENTS.md)
- [Architecture](./DOCS/ARCHITECTURE.md)
- [TODO](./DOCS/TODO.md)

## License

[MIT](LICENSE)
