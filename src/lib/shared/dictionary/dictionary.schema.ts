import { z } from "zod";

import { defaultDictionary } from "./dictionary.const";
import { getMessageArguments } from "./dictionary.helper";
import type { DictionaryOverride } from "./dictionary.type";

const makeOverrideSchema = (value: unknown): z.ZodType => {
  if (typeof value === "string") {
    if (!value.includes("{")) return z.string();
    const allowed = getMessageArguments(value);
    return z.string().superRefine((message, context) => {
      try {
        for (const [name, kind] of getMessageArguments(message)) {
          if (allowed.get(name) !== kind)
            context.addIssue({
              code: "custom",
              message: `Unknown placeholder or tag: ${name}.`,
            });
        }
      } catch {
        context.addIssue({
          code: "custom",
          message: "Invalid message syntax.",
        });
      }
    });
  }
  if (Array.isArray(value)) return z.array(z.string());
  if (value !== null && typeof value === "object") {
    return z
      .object(
        Object.fromEntries(
          Object.entries(value).map(([key, child]) => [
            key,
            makeOverrideSchema(child),
          ]),
        ),
      )
      .strict()
      .partial();
  }
  return z.never();
};

const overrideSchema = makeOverrideSchema(defaultDictionary);

// The default object supplies the exact keys and leaf types; dynamic schema
// construction loses that shape, so establish it only after runtime validation.
export const dictionaryOverrideSchema = z
  .custom<DictionaryOverride>()
  .superRefine((value, context) => {
    const result = overrideSchema.safeParse(value);
    if (!result.success)
      result.error.issues.forEach((issue) =>
        context.addIssue({
          code: "custom",
          path: issue.path,
          message: issue.message,
        }),
      );
  });
