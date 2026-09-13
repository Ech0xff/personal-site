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

- [ ] Add CMS audio import from uploaded files or URLs, extract editable title/artist/duration metadata, and store audio plus precomputed spectra durably. Reuse the [built-in analysis format](./REDESIGN.md#built-in-music-and-audio-analysis); production decoding should run as bounded background work.
- [ ] Check explicit playback, curved-slider touch/keyboard behavior, TOC morph smoothness, and visuals on physical Safari/iOS devices before production rollout.

- [ ] Choose a new redesign favicon and visual signature; the public site currently uses a blank favicon.

- [ ] Configure the redesign GitHub, Email, X, and Bilibili destinations; the current icons intentionally have empty destinations.

- [ ] Connect visits to analytics and Guestbook to moderated persistent storage with an explicit email-display policy. Public content and Posts/Thoughts counts already use live Supabase reads.
