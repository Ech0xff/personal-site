import { mergeWith } from "es-toolkit";
import IntlMessageFormat from "intl-messageformat";
import { cloneElement, isValidElement, type ReactNode } from "react";

import type {
  Dictionary,
  DictionaryOverride,
  MessageValues,
  RichMessageValues,
} from "./dictionary.type";

export const mergeDictionary = (
  defaults: Dictionary,
  override: DictionaryOverride,
): Dictionary =>
  mergeWith(structuredClone(defaults), override, (_, value) =>
    Array.isArray(value) ? value : undefined,
  );

export const formatMessage = (
  message: string,
  values: MessageValues,
): string => {
  const formatted = new IntlMessageFormat(message, "en").format<string>(values);
  return Array.isArray(formatted) ? formatted.join("") : formatted;
};

export const formatRichMessage = (
  message: string,
  values: RichMessageValues,
): ReactNode => {
  const formatted = new IntlMessageFormat(message, "en").format<ReactNode>(
    values,
  );
  if (!Array.isArray(formatted)) return formatted;
  return formatted.map((node, index) =>
    isValidElement(node) ? cloneElement(node, { key: index }) : node,
  );
};

export const getMessageArguments = (
  message: string,
): ReadonlyMap<string, "tag" | "value"> => {
  const names = new Map<string, "tag" | "value">();
  const visit = (elements: ReturnType<IntlMessageFormat["getAst"]>) => {
    for (const element of elements) {
      if (element.type !== 0 && "value" in element)
        names.set(element.value, "children" in element ? "tag" : "value");
      if ("children" in element) visit(element.children);
      if ("options" in element)
        Object.values(element.options).forEach((option) => visit(option.value));
    }
  };
  visit(new IntlMessageFormat(message, "en").getAst());
  return names;
};
