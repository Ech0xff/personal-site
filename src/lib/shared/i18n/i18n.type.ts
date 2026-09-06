import type { DeepPartial } from "es-toolkit/types";
import type { ReactNode } from "react";

import { dictionary } from "./messages/default";

export type Dictionary = typeof dictionary;
export type PartialDictionary = DeepPartial<Dictionary>;

export type MessageValues = Record<
  string,
  string | number | boolean | Date | null | undefined
>;

export type RichMessageValues = Record<
  string,
  MessageValues[string] | ((chunks: ReactNode) => ReactNode)
>;

export type Translator<Scope extends object> = {
  <Value extends string>(
    select: (scope: Scope) => Value,
    values?: MessageValues,
  ): string;
  <Value>(select: (scope: Scope) => Value): Value;
  rich<Value extends string>(
    select: (scope: Scope) => Value,
    values?: RichMessageValues,
  ): ReactNode;
  scope<ChildScope extends object>(
    select: (scope: Scope) => ChildScope,
  ): Translator<ChildScope>;
};
