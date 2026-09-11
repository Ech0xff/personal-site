import type { SupabaseClient } from "@supabase/supabase-js";

import {
  type ConfigKey,
  type ConfigOverride,
  type ConfigOverrideSnapshot,
  getConfigDefinition,
  getConfigDefaults,
  type ConfigSnapshot,
  type ConfigValue,
} from "#lib/shared/config";
import type { Database, Json } from "#types";

const fetchStoredConfigs = async (
  keys: readonly ConfigKey[],
  client: SupabaseClient<Database>,
) => {
  if (keys.length === 0) return new Map<string, Json>();

  const { data, error } = await client
    .from("configs")
    .select("key,value")
    .in("key", keys);
  if (error) throw error;

  return new Map(data.map(({ key, value }) => [key, value]));
};

export const loadConfig = async <K extends ConfigKey>(
  client: SupabaseClient<Database>,
  key: K,
): Promise<{ value: ConfigValue<K>; override: ConfigOverride<K> | null }> => {
  const storedConfigs = await fetchStoredConfigs([key], client);
  const stored = storedConfigs.get(key);
  const definition = getConfigDefinition(key);
  const defaults = getConfigDefaults(key);
  if (stored === undefined) return { value: defaults, override: null };
  const override = definition.schema.parse(stored);
  return { value: definition.resolve(defaults, override), override };
};

export function loadConfigs<const Keys extends readonly ConfigKey[]>(
  client: SupabaseClient<Database>,
  keys: Keys,
): Promise<ConfigSnapshot<Keys[number]>>;
export async function loadConfigs(
  client: SupabaseClient<Database>,
  keys: readonly ConfigKey[],
) {
  const storedConfigs = await fetchStoredConfigs(keys, client);

  const resolve = <K extends ConfigKey>(key: K): ConfigValue<K> => {
    const definition = getConfigDefinition(key);
    const defaults = getConfigDefaults(key);
    const stored = storedConfigs.get(key);
    return stored === undefined
      ? defaults
      : definition.resolve(defaults, definition.schema.parse(stored));
  };
  return Object.fromEntries(keys.map((key) => [key, resolve(key)] as const));
}

export function loadConfigOverrides<const Keys extends readonly ConfigKey[]>(
  client: SupabaseClient<Database>,
  keys: Keys,
): Promise<ConfigOverrideSnapshot<Keys[number]>>;
export async function loadConfigOverrides(
  client: SupabaseClient<Database>,
  keys: readonly ConfigKey[],
) {
  const storedConfigs = await fetchStoredConfigs(keys, client);

  const parse = <K extends ConfigKey>(key: K): ConfigOverride<K> | null => {
    const stored = storedConfigs.get(key);
    return stored === undefined
      ? null
      : getConfigDefinition(key).schema.parse(stored);
  };
  return Object.fromEntries(keys.map((key) => [key, parse(key)] as const));
}

export const setConfigOverride = async <K extends ConfigKey>(
  client: SupabaseClient<Database>,
  key: K,
  override: ConfigOverride<K>,
): Promise<ConfigOverride<K>> => {
  const value = getConfigDefinition(key).schema.parse(override);
  const { error } = await client
    .from("configs")
    .upsert({ key, value }, { onConflict: "key" });
  if (error) throw error;

  return value;
};

export const deleteConfigOverride = async (
  client: SupabaseClient<Database>,
  key: ConfigKey,
) => {
  const { error } = await client.from("configs").delete().eq("key", key);
  if (error) throw error;
};
