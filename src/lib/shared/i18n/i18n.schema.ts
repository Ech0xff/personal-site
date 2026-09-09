import { z } from "zod";

import type { PartialDictionary } from "./i18n.type";
import { dictionary } from "./messages/default";

const makePartialSchema = (value: unknown): z.ZodType => {
  if (typeof value === "string") return z.string();
  if (typeof value === "number") return z.number();
  if (typeof value === "boolean") return z.boolean();
  if (value === null) return z.null();
  if (Array.isArray(value)) {
    const item: unknown = value[0];
    return z.array(item === undefined ? z.never() : makePartialSchema(item));
  }
  if (typeof value === "object") {
    return z
      .object(
        Object.fromEntries(
          Object.entries(value).map(([key, child]) => [
            key,
            makePartialSchema(child),
          ]),
        ),
      )
      .strict()
      .partial();
  }
  return z.never();
};

const partialDictionarySchema = makePartialSchema(dictionary);

// The default dictionary supplies every allowed key and leaf type. This runtime
// check establishes the deep-partial type that dynamic schema construction loses.
export const dictionaryOverrideSchema = z.custom<PartialDictionary>(
  (value) => partialDictionarySchema.safeParse(value).success,
  {
    error: "Invalid dictionary override: unknown key or incorrect value type.",
  },
);
