/** The complete dictionary shape shared by every locale. */
import type { DeepPartial, DeepReadonly } from "es-toolkit/types";

import { dictionary } from "./messages/default";

export type Dictionary = DeepReadonly<typeof dictionary>;
export type PartialDictionary = DeepPartial<Dictionary>;

/** A translator scoped to the selected dictionary object. */
export type Translator<Scope extends object> = {
  <Value extends string>(select: (scope: Scope) => Value): Value;
  scope<ChildScope extends object>(
    select: (scope: Scope) => ChildScope,
  ): Translator<ChildScope>;
};
