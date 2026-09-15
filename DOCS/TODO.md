# TODO

Keep actionable outstanding work here; remove completed entries. Link to the
relevant file or issue when possible.

## Maintenance

- [ ] Apply the updated desk RPCs to hosted and other legacy databases before
      deployment. Follow the additive [database workflow](../README.md#database)
      and verify workspace publication, visits, and statistics.
- [ ] Decide whether to standardize the casing of the `DOCS` directory.
- [ ] Remove the `jsdom` 26.1.0 override and `@blocknote/server-util` DOM-origin
      patch once BlockNote's server renderer works
      with Lambda's disabled `require(esm)` support and a production article
      renders without DOM initialization errors. Keep the native Node regression
      check in the document rendering suite.

## Review Follow-up

See the [September 13 project review](./REVIEW-2026-09-13.md) for evidence,
acceptance scenarios, performance baselines, and owner decisions.

- [ ] Coordinate editor pending state and modal dismissal, including Escape,
      metadata edits, and closing the correct modal after saving (R1/R2).
- [ ] Exclude Agentation from production downloads and defer upload dependencies
      until needed; compare production chunks and browser requests (R3/R4).
- [ ] Preserve Files totals when pagination returns no rows and recover from
      out-of-range pages (R5).
- [ ] Pass lean dashboard list items alongside rendered document slots, keeping
      raw BlockNote documents on the server until editing (R6).
- [ ] Preserve public unavailable states while adding bounded server diagnostics
      for query and validation failures (R7).
- [ ] Resolve the review's intro, feed-growth, Files-search, and performance-budget
      decisions before the corresponding UX or query changes.

- [ ] Track upstream BlockNote column-resize undo support: version 0.54.2 excludes width changes from history. Block insertion, movement, and text edits use native undo/redo.

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

## Desk Workbench

- [ ] Build schema-driven item metadata forms on the existing item configuration contract.
- [ ] Add explicit item creation, duplication, and removal flows to the desk workbench.
