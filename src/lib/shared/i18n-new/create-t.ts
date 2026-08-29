/** A translator scoped to the selected dictionary object. */
export type Translator<Scope extends object> = {
  <Value extends string>(select: (scope: Scope) => Value): Value;
  scope<ChildScope extends object>(
    select: (scope: Scope) => ChildScope,
  ): Translator<ChildScope>;
};

const createScopedT = <Scope extends object>(
  dictionary: Scope,
): Translator<Scope> => {
  const translate = <Value extends string>(select: (scope: Scope) => Value) =>
    select(dictionary);

  const scope = <ChildScope extends object>(
    select: (scope: Scope) => ChildScope,
  ) => createScopedT(select(dictionary));

  // A function can expose scope without a wrapper object.
  return Object.assign(translate, { scope });
};

/** Creates a translator while preserving dictionary autocomplete. */
export const createT = <const Source extends object>(
  dictionary: Source,
): Translator<Source> => createScopedT(dictionary);
