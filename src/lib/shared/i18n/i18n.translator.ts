import IntlMessageFormat from "intl-messageformat";
import { cloneElement, isValidElement, type ReactNode } from "react";

import type {
  Locale,
  MessageValues,
  RichMessageValues,
  Translator,
} from "./i18n.type";

const createScopedT = <Scope extends object>(
  source: Scope,
  locale: Locale,
): Translator<Scope> => {
  function translate(
    select: (scope: Scope) => string,
    values?: MessageValues,
  ): string;
  function translate<Value>(select: (scope: Scope) => Value): Value;
  function translate<Value>(
    select: (scope: Scope) => Value,
    values?: MessageValues,
  ): Value | string {
    const selected = select(source);
    if (typeof selected !== "string") {
      return selected;
    }

    if (!values) return selected;

    const formatted = new IntlMessageFormat(selected, locale).format<string>(
      values,
    );
    return Array.isArray(formatted) ? formatted.join("") : formatted;
  }

  const rich = (
    select: (scope: Scope) => string,
    values?: RichMessageValues,
  ): ReactNode => {
    const formatted = new IntlMessageFormat(
      select(source),
      locale,
    ).format<ReactNode>(values);
    if (!Array.isArray(formatted)) return formatted;

    return formatted.map((node, index) =>
      isValidElement(node) ? cloneElement(node, { key: index }) : node,
    );
  };

  const scope = <ChildScope extends object>(
    select: (scope: Scope) => ChildScope,
  ) => createScopedT(select(source), locale);

  return Object.assign(translate, { scope, rich });
};

export const createT = <const Source extends object>(
  source: Source,
  locale: Locale,
): Translator<Source> => createScopedT(source, locale);
