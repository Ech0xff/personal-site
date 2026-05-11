import type { SupabaseClient } from "@supabase/supabase-js";

import type { ConfigKey, ConfigValue } from "@/lib/shared/config";
import { routing } from "@/lib/shared/i18n/routing";
import { getNormalizedLocale } from "@/lib/shared/i18n/tools";
import type { Database, Json } from "@/types";
import { generateConfigKey } from "../config/utils";
import { makeStaticClient } from "../supabase";

export type ConfigsMap<K extends ConfigKey> = Map<K, ConfigValue[K] | null> & {
  get<T extends K>(key: T): ConfigValue[T] | null | undefined;
};

/** Fetches multiple configuration values by their keys. */
export const fetchConfigs = async <K extends ConfigKey>(
  keys: readonly K[],
  options?: {
    locale?: string;
  },
  client: SupabaseClient<Database> = makeStaticClient(),
): Promise<ConfigsMap<K>> => {
  const locale = getNormalizedLocale(options?.locale);
  const keySet = new Set<string>();
  keys.forEach((key) => {
    keySet.add(generateConfigKey(key, locale));
    keySet.add(generateConfigKey(key, routing.defaultLocale));
  });

  const { data, error } = await client
    .from("configs")
    .select("key,value")
    .in("key", Array.from(keySet));
  if (error) throw error;

  return new Map(
    keys.map((key) => [
      key,
      (data.find((item) => item.key === generateConfigKey(key, locale))
        ?.value ??
        data.find(
          (item) => item.key === generateConfigKey(key, routing.defaultLocale),
        )?.value ??
        null) as ConfigValue[K] | null,
    ]),
  ) as ConfigsMap<K>;
};

/** Sets a configuration value by its key. */
export const setConfig = async (
  key: string,
  value: Json,
  client: SupabaseClient<Database> = makeStaticClient(),
) => {
  const { data, error } = await client
    .from("configs")
    .upsert({ key, value }, { onConflict: "key" })
    .select("value")
    .single();
  if (error) throw error;
  return data.value;
};

/** Deletes a configuration value by its key. */
export const deleteConfig = async (
  client: SupabaseClient<Database> = makeStaticClient(),
  key: string,
) => {
  const { error } = await client.from("configs").delete().eq("key", key);
  if (error) throw error;
};
