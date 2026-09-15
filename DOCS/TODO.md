# TODO

Keep actionable outstanding work here; remove completed entries. Link to the
relevant file or issue when possible.

## Maintenance

- [ ] Apply the updated desk RPCs to hosted and other legacy databases before
      deployment. Follow the additive [database workflow](../README.md#database)
      and verify direct desk saving, legacy migration, visits, and statistics.
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

- [ ] Bring hosted `05_desk.sql` up to date and apply `06_audio.sql` (preview currently lacks the configuration and audio RPCs), then verify a real upload, URL import, and spectrum-only retry in the deployed Vercel Function. See [audio import operations](../README.md#audio-imports).
- [ ] Check explicit playback, curved-slider touch/keyboard behavior, TOC morph smoothness, and visuals on physical Safari/iOS devices before production rollout.

- [ ] Choose a new redesign favicon and visual signature; the public site currently uses a blank favicon.

- [ ] Configure the redesign GitHub, Email, X, and Bilibili destinations; the current icons intentionally have empty destinations.

## Desk Workbench

- [ ] Build schema-driven item metadata forms on the existing item configuration contract.
- [ ] Add explicit item creation, duplication, and removal flows to the desk workbench.

## Desk editor acceptance

- [x] Use server-initialized Jotai configuration with direct Apply and persisted layout history.
- [x] Add paper fields, a passage directory, common appearance settings, and automatic calendar dates.
- [x] Add magnetic icon tabs, scoped Restore, paired initial/hover states, an explicit movement switch, and a compact recording editor. Omit empty content tabs and keep toolbar buttons transparent.
- [x] Preserve fixed item coordinates through collision resolution and layout saves; keep desktop scale independent of movable content.
