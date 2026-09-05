import { assert, toMerged } from "es-toolkit";
import { includes } from "es-toolkit/compat";
import IntlMessageFormat from "intl-messageformat";
import type { ReactNode } from "react";

import { type Locale, locales } from "./i18n.const";
import type {
  Dictionary,
  MessageValues,
  PartialDictionary,
  RichMessageValues,
  Translator,
} from "./i18n.type";
import { dictionary } from "./messages/default";

export const defineDictionary = (overrides: PartialDictionary): Dictionary =>
  toMerged(dictionary, overrides);

export function assertLocale(locale: string): asserts locale is Locale {
  assert(includes(locales, locale), `${locale} is not supported`);
}

const createScopedT = <Scope extends object>(
  dictionary: Scope,
  locale: Locale,
): Translator<Scope> => {
  const format = (
    message: string,
    values?: MessageValues | RichMessageValues,
  ) => new IntlMessageFormat(message, locale).format(values as never);

  const translate = <Value>(
    select: (scope: Scope) => Value,
    values?: MessageValues,
  ): Value => {
    const selected = select(dictionary);
    if (typeof selected !== "string") {
      return selected;
    }

    if (!values) return selected as Value;

    const formatted = format(selected, values);
    return (
      Array.isArray(formatted) ? formatted.join("") : String(formatted)
    ) as Value;
  };

  const rich = <Value extends string>(
    select: (scope: Scope) => Value,
    values?: RichMessageValues,
  ): ReactNode => format(select(dictionary), values) as ReactNode;

  const scope = <ChildScope extends object>(
    select: (scope: Scope) => ChildScope,
  ) => createScopedT(select(dictionary), locale);

  return Object.assign(translate, { scope, rich }) as Translator<Scope>;
};

export const createT = <const Source extends object>(
  dictionary: Source,
  locale: Locale,
): Translator<Source> => createScopedT(dictionary, locale);
