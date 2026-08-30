import { assert, toMerged } from "es-toolkit";
import { includes } from "es-toolkit/compat";

import { Locale, locales } from "./i18n.const";
import { Dictionary, PartialDictionary, Translator } from "./i18n.type";
import { dictionary } from "./messages/default";

export const defineDictionary = (overrides: PartialDictionary): Dictionary =>
  toMerged(dictionary, overrides);

export function assertLocal(locale: string): asserts locale is Locale {
  assert(includes(locales, locale), `${locale} is not support`);
}

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
