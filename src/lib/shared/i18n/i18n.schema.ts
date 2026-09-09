import { z } from "zod";

import type { PartialDictionary } from "./i18n.type";
import { dictionary } from "./messages/default";

const makePartialSchema = (value: unknown): z.ZodTypeAny => {
  if (typeof value === "string") return z.string();
  if (typeof value === "number") return z.number();
  if (typeof value === "boolean") return z.boolean();
  if (value === null) return z.null();
  if (Array.isArray(value)) {
    const item = value[0];
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

// Object.fromEntries loses the relationship between dictionary keys and schemas.
// Keep this assertion at the schema construction boundary; parsed overrides are
// validated by the recursively generated strict schema.
export const dictionaryOverrideSchema = makePartialSchema(
  dictionary,
) as z.ZodType<PartialDictionary>;
