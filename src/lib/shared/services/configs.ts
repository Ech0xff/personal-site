import type { SupabaseClient } from "@supabase/supabase-js";

import type { ConfigKey, ConfigValue } from "@/lib/shared/config";
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
    strict?: boolean;
  },
  client: SupabaseClient<Database> = makeStaticClient(),
): Promise<ConfigsMap<K>> => {
  const { locale, strict } = options || {};
  const keySet = new Set<string>(keys);
  if (locale) {
    keys.forEach((key) => {
      if (!strict) keySet.delete(key); // Remove non-locale key if strict mode is off
      keySet.add(generateConfigKey(key, locale));
    });
  }
  if (keySet.size === 0) {
    return new Map<K, ConfigValue[K] | null>() as ConfigsMap<K>;
  }

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
        data.find((item) => item.key === key)?.value ??
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
