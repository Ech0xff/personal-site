# TODO

Keep actionable outstanding work here; remove completed entries. Link to the
relevant file or issue when possible.

## Maintenance

- [ ] Decide whether to standardize the casing of the `DOCS` directory.
- [ ] Confirm the project license and add its file; the former README linked
      to a missing `LICENSE`.

## Existing Authentication Debt

- [ ] Replace server authorization based on `getSession()` in
      [session.service.ts](../src/lib/shared/auth/session.service.ts) with
      verified user or claims checks, while keeping browser session reads
      separate. Verify forged and expired sessions cannot pass admin checks.
- [ ] Persist refreshed cookies from
      [supabase.client.ts](../src/lib/server/supabase.client.ts) through a
      writable response boundary; Server Component cookie writes are currently
      swallowed. Verify a session survives an expired access token and reload.

## Runtime Verification

- [ ] Configure and verify production content webhook triggers. The database
      has webhook functions but no active public-table triggers; confirm
      content and tag changes refresh all affected public caches using the
      [deployment setup](../README.md#deployment).

- [ ] Verify snapshot theme changes with dashboard editors, the tag sphere, and
      notifications open in an authenticated browser; the current verification
      session has no admin login. Compare the result in Safari on macOS as well.

- [ ] Cover `uploadImageFromUrl` in a browser integration test, including fetch
      failure and duplicate content. It has no current UI consumer; file upload,
      WebP compression, and duplicate file uploads were verified locally.
- [ ] Add local fixtures for card, ref, and meta directives to
      [seed.sql](../supabase/seed.sql) and verify rendering and external previews.

## Temporary Client Translation

- [ ] Research optional, temporary client-side translation of original content.
      Define privacy, provider, and UX requirements first; do not restore locale
      routes, per-language dictionaries, or server translation storage.
