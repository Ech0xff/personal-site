import type { DeepPartial } from "es-toolkit/types";
import type { PrimitiveType } from "intl-messageformat";
import type { ReactNode } from "react";

import type { defaultDictionary } from "./dictionary.const";

export type Dictionary = typeof defaultDictionary;
export type DictionaryOverride = DeepPartial<Dictionary>;
export type MessageValues = Readonly<Record<string, PrimitiveType>>;
export type RichMessageValues = Readonly<
  Record<string, PrimitiveType | ((chunks: ReactNode[]) => ReactNode)>
>;
