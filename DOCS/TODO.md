# TODO

Keep actionable outstanding work here; remove completed entries. Link to the
relevant file or issue when possible.

## Maintenance

- [ ] Decide whether to standardize the casing of the `DOCS` directory.
- [ ] Confirm the project license and add its file; the former README linked
      to a missing `LICENSE`.

## Runtime Verification

- [ ] Cover `uploadImageFromUrl` in a browser integration test, including fetch
      failure and duplicate content. It has no current UI consumer; file upload,
      WebP compression, and duplicate file uploads were verified locally.
- [ ] Add local fixtures for card, ref, and meta directives to
      [seed.sql](../supabase/seed.sql) and verify rendering and external previews.

## Temporary Client Translation

- [ ] Research optional, temporary client-side translation of original content.
      Define privacy, provider, and UX requirements first; do not restore locale
      routes, per-language dictionaries, or server translation storage.

## Redesign Follow-up

See the [redesign guide](./REDESIGN.md) for the implemented prototype and source research.

- [ ] Connect the approved redesign copy and content to CMS configuration and the shared dictionary; update cache consumers and invalidation together.
- [ ] Add CMS audio import from uploaded files or URLs, extract editable title/artist/duration metadata, and store audio plus precomputed spectra durably. Reuse the [built-in analysis format](./REDESIGN.md#built-in-music-and-audio-analysis); production decoding should run as bounded background work.
- [ ] Extend the approved design to content detail pages and plan the final public-route migration.
- [ ] Verify the full production build and legacy public/admin flows with configured Supabase credentials; the prototype can be verified independently.
- [ ] Check explicit playback, curved-slider touch/keyboard behavior, and visuals on physical Safari/iOS devices before production rollout.

- [ ] Choose a new redesign favicon and visual signature; the prototype currently uses a blank favicon.

- [ ] Configure the redesign GitHub, Email, X, and Bilibili destinations; the current icons intentionally have empty destinations.
- [ ] Implement the Posts, Thoughts, and Events pages after their designs are agreed; current routes are placeholders.
- [ ] Add a redesign dark theme by overriding semantic, material, lighting, and shadow tokens together.

- [ ] Replace redesign display fixture statistics and the local guestbook with real data services, moderation, and an explicit email-display policy when backend integration is approved.
