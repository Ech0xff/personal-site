# TODO

This is the project's single list for deferred work. Keep entries actionable and
link them to an issue or a relevant file when possible.

## File organization

- [ ] Gradually migrate modules in planned refactors to `subject.role.ts` or
      `subject.role.tsx`, following the suffix table in `AGENTS.md`.
- [ ] Consolidate utility naming under `.helper` and use `.type` consistently;
      update consumers when migrating existing files.
- [ ] Review duplicate naming conventions under `src/lib`, `src/components`,
      and route-local `_components` directories.
- [ ] Decide whether the `DOCS` directory should eventually be renamed to
      lowercase `docs` for consistency with `todo.md`.

## Documentation maintenance

- [ ] Keep `README.md`, `AGENTS.md`, and the documents in `DOCS/` synchronized
      when commands, paths, or architectural boundaries change.
