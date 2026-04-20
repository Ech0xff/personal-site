import type { Json } from "@/types";

export type ConfigJsonParseResult =
  | { ok: true; value: Json }
  | { ok: false; error: string };

export const parseConfigJsonResult = (text: string): ConfigJsonParseResult => {
  try {
    return { ok: true, value: JSON.parse(text) as Json };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Invalid JSON.",
    };
  }
};

export const formatConfigJson = (text: string) => {
  const result = parseConfigJsonResult(text);
  if (!result.ok) {
    throw new Error(result.error);
  }

  return JSON.stringify(result.value, null, 2);
};
