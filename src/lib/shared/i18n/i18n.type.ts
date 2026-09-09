import type { DeepPartial } from "es-toolkit/types";
import type { PrimitiveType } from "intl-messageformat";
import type { ReactNode } from "react";

import type { locales } from "./i18n.const";
import type { dictionary } from "./messages/default";

export type Locale = (typeof locales)[number];

export type Dictionary = typeof dictionary;
export type PartialDictionary = DeepPartial<Dictionary>;

export type MessageValues = Record<string, PrimitiveType>;

export type RichMessageValues = Record<
  string,
  MessageValues[string] | ((chunks: ReactNode) => ReactNode)
>;

export type Translator<Scope extends object> = {
  (select: (scope: Scope) => string, values?: MessageValues): string;
  <Value>(select: (scope: Scope) => Value): Value;
  rich(select: (scope: Scope) => string, values?: RichMessageValues): ReactNode;
  scope<ChildScope extends object>(
    select: (scope: Scope) => ChildScope,
  ): Translator<ChildScope>;
};
