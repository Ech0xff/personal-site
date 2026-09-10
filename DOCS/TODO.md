# TODO

This is the project's single list for deferred work. Keep entries actionable and
link them to an issue or a relevant file when possible.

## File organization

- [x] Migrate ordinary source modules to `subject.role.ts` or
      `subject.role.tsx`, following the suffix table and exceptions in `AGENTS.md`.
- [x] Consolidate utility naming under `.helper` and use `.type` consistently;
      update consumers when migrating existing files.
- [x] Review duplicate naming conventions under `src/lib`, `src/components`,
      and route-local `_components` directories.
- [ ] Decide whether the `DOCS` directory should eventually be renamed to
      lowercase `docs` for consistency with `todo.md`.

## Documentation maintenance

- [ ] Keep `README.md`, `AGENTS.md`, and the documents in `DOCS/` synchronized
      when commands, paths, or architectural boundaries change.

## Runtime verification

- [ ] Resolve the anonymous auth route's blocking-prerender diagnostic for
      uncached `loadConfigsByServer` calls in `src/app/[locale]/auth/page.tsx`.
      Observed during the naming refactor; the configuration read and rendering
      behavior were retained. Verify anonymous hard and soft navigation.
- [ ] Exercise `uploadImageFromUrl` in a browser integration test, including
      fetch failure and duplicate content. File upload, WebP compression, and
      duplicate file uploads were verified against local Supabase; URL upload
      has no current UI consumer.
- [ ] Add a local content fixture covering card, ref, and meta directives for
      browser verification. The naming refactor passed compilation and ordinary
      Markdown rendering checks; the existing local posts did not cover every
      directive or external preview service.
