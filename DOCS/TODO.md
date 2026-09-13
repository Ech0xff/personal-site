# TODO

Keep actionable outstanding work here; remove completed entries. Link to the
relevant file or issue when possible.

## Maintenance

- [ ] Decide whether to standardize the casing of the `DOCS` directory.
- [ ] Confirm the project license and add its file; the former README linked
      to a missing `LICENSE`.

## Temporary Client Translation

- [ ] Research optional, temporary client-side translation of original content.
      Define privacy, provider, and UX requirements first; do not restore locale
      routes, per-language dictionaries, or server translation storage.

## Redesign Follow-up

See the [redesign guide](./REDESIGN.md) for the public reading desk and source research.

- [ ] Connect public Posts, Thoughts, and Events to BlockNote content once their designs are agreed; introduce public rendering, cache consumers, and invalidation together. Public copy remains source-controlled.
- [ ] Add CMS audio import from uploaded files or URLs, extract editable title/artist/duration metadata, and store audio plus precomputed spectra durably. Reuse the [built-in analysis format](./REDESIGN.md#built-in-music-and-audio-analysis); production decoding should run as bounded background work.
- [ ] Implement new `/posts/[slug]` detail pages with real CMS content; these URLs currently return 404.
- [ ] Check explicit playback, curved-slider touch/keyboard behavior, and visuals on physical Safari/iOS devices before production rollout.

- [ ] Choose a new redesign favicon and visual signature; the public site currently uses a blank favicon.

- [ ] Configure the redesign GitHub, Email, X, and Bilibili destinations; the current icons intentionally have empty destinations.

- [ ] Connect the server-composed display slots to public Supabase reads. Implement public read policies, cache consumers/invalidation, panel failures/retries, and moderated guestbook writes with an explicit email-display policy together. Verify slow and failed streaming reads; current fixtures are synchronous.
