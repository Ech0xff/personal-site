import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database, Json } from "@/types";

import { makeStaticClient } from "../supabase";

const isRecord = (value: Json | null): value is Record<string, Json> =>
  Boolean(value && typeof value === "object" && !Array.isArray(value));

const mergeConfig = (base: Json | null, override: Json | null): Json | null => {
  if (!isRecord(base)) return override ?? base;
  if (!isRecord(override)) return override ?? base;

  return Object.fromEntries(
    Array.from(
      new Set([...Object.keys(base), ...Object.keys(override)]),
      (key) => [key, mergeConfig(base[key] ?? null, override[key] ?? null)],
    ),
  );
};

export const getLocaleConfigKey = (key: string, locale: string) =>
  `${key}:${locale}`;

export type FetchConfigOptions = {
  includeBase?: boolean;
  strict?: boolean;
};

const normalizeFetchConfigOptions = (
  options: boolean | FetchConfigOptions = {},
): Required<FetchConfigOptions> =>
  typeof options === "boolean"
    ? { includeBase: options, strict: false }
    : {
        includeBase: options.includeBase ?? false,
        strict: options.strict ?? false,
      };

export const shouldMergeBaseConfig = (
  locale?: string,
  options: boolean | FetchConfigOptions = {},
) => {
  const normalizedOptions = normalizeFetchConfigOptions(options);
  return Boolean(
    locale && normalizedOptions.includeBase && !normalizedOptions.strict,
  );
};

export const fetchConfig = async (
  client: SupabaseClient<Database> = makeStaticClient(),
  key: string,
  locale?: string,
  options: boolean | FetchConfigOptions = {},
) => {
  if (locale && shouldMergeBaseConfig(locale, options)) {
    const localeKey = getLocaleConfigKey(key, locale);
    const { data, error } = await client
      .from("configs")
      .select("key,value")
      .in("key", [key, localeKey]);
    if (error) throw error;

    const common = data?.find((item) => item.key === key)?.value ?? null;
    const localeConfig =
      data?.find((item) => item.key === localeKey)?.value ?? null;
    return mergeConfig(common, localeConfig);
  }

  const targetKey = locale ? getLocaleConfigKey(key, locale) : key;
  const { data, error } = await client
    .from("configs")
    .select("value")
    .eq("key", targetKey)
    .maybeSingle();
  if (error) throw error;
  return data?.value ?? null;
};

export const fetchConfigs = async (
  client: SupabaseClient<Database> = makeStaticClient(),
  keys: string[],
) => {
  const uniqueKeys = Array.from(new Set(keys.filter(Boolean)));
  if (uniqueKeys.length === 0) return new Map<string, Json | null>();

  const { data, error } = await client
    .from("configs")
    .select("key,value")
    .in("key", uniqueKeys);
  if (error) throw error;

  return new Map(
    uniqueKeys.map((key) => [
      key,
      data?.find((item) => item.key === key)?.value ?? null,
    ]),
  );
};

export const setConfig = async (
  client: SupabaseClient<Database> = makeStaticClient(),
  key: string,
  value: Json,
) => {
  const { data, error } = await client
    .from("configs")
    .upsert({ key, value }, { onConflict: "key" })
    .select("value")
    .single();
  if (error) throw error;
  return data.value;
};

export const deleteConfig = async (
  client: SupabaseClient<Database> = makeStaticClient(),
  key: string,
) => {
  const { error } = await client.from("configs").delete().eq("key", key);
  if (error) throw error;
};
