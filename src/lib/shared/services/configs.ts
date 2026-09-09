import type { SupabaseClient } from "@supabase/supabase-js";

import {
  type ConfigKey,
  type ConfigOverride,
  type ConfigOverrideSnapshot,
  getConfigDefinition,
  getConfigDefaults,
  CONFIG_SCOPE,
  type ConfigSnapshot,
  type ConfigValue,
} from "#lib/shared/config";
import { defaultLocale, type Locale } from "#lib/shared/i18n";
import type { Database, Json } from "#types";

export type ConfigOptions = {
  locale?: Locale;
};

const getStorageKey = (key: ConfigKey, locale: Locale) =>
  getConfigDefinition(key).scope === CONFIG_SCOPE.LOCALE
    ? `${key}:${locale}`
    : key;

const fetchStoredConfigs = async (
  keys: readonly ConfigKey[],
  locale: Locale,
  client: SupabaseClient<Database>,
) => {
  const storageKeys = keys.map((key) => getStorageKey(key, locale));
  if (storageKeys.length === 0) return new Map<string, Json>();

  const { data, error } = await client
    .from("configs")
    .select("key,value")
    .in("key", storageKeys);
  if (error) throw error;

  return new Map(data.map(({ key, value }) => [key, value]));
};

export const loadConfig = async <K extends ConfigKey>(
  client: SupabaseClient<Database>,
  key: K,
  options: ConfigOptions = {},
): Promise<{ value: ConfigValue<K>; override: ConfigOverride<K> | null }> => {
  const locale = options.locale ?? defaultLocale;
  const storedConfigs = await fetchStoredConfigs([key], locale, client);
  const stored = storedConfigs.get(getStorageKey(key, locale));
  const definition = getConfigDefinition(key);
  const defaults = getConfigDefaults(key, locale);
  if (stored === undefined) return { value: defaults, override: null };
  const override = definition.schema.parse(stored);
  return { value: definition.resolve(defaults, override), override };
};

export function loadConfigs<const Keys extends readonly ConfigKey[]>(
  client: SupabaseClient<Database>,
  keys: Keys,
  options?: ConfigOptions,
): Promise<ConfigSnapshot<Keys[number]>>;
export async function loadConfigs(
  client: SupabaseClient<Database>,
  keys: readonly ConfigKey[],
  options: ConfigOptions = {},
) {
  const locale = options.locale ?? defaultLocale;
  const storedConfigs = await fetchStoredConfigs(keys, locale, client);

  const resolve = <K extends ConfigKey>(key: K): ConfigValue<K> => {
    const definition = getConfigDefinition(key);
    const defaults = getConfigDefaults(key, locale);
    const stored = storedConfigs.get(getStorageKey(key, locale));
    return stored === undefined
      ? defaults
      : definition.resolve(defaults, definition.schema.parse(stored));
  };
  return Object.fromEntries(keys.map((key) => [key, resolve(key)] as const));
}

export function loadConfigOverrides<const Keys extends readonly ConfigKey[]>(
  client: SupabaseClient<Database>,
  keys: Keys,
  options?: ConfigOptions,
): Promise<ConfigOverrideSnapshot<Keys[number]>>;
export async function loadConfigOverrides(
  client: SupabaseClient<Database>,
  keys: readonly ConfigKey[],
  options: ConfigOptions = {},
) {
  const locale = options.locale ?? defaultLocale;
  const storedConfigs = await fetchStoredConfigs(keys, locale, client);

  const parse = <K extends ConfigKey>(key: K): ConfigOverride<K> | null => {
    const stored = storedConfigs.get(getStorageKey(key, locale));
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
  options: ConfigOptions = {},
): Promise<ConfigOverride<K>> => {
  const value = getConfigDefinition(key).schema.parse(override);
  const storageKey = getStorageKey(key, options.locale ?? defaultLocale);
  const { error } = await client
    .from("configs")
    .upsert({ key: storageKey, value }, { onConflict: "key" });
  if (error) throw error;

  return value;
};

export const deleteConfigOverride = async (
  client: SupabaseClient<Database>,
  key: ConfigKey,
  options: ConfigOptions = {},
) => {
  const storageKey = getStorageKey(key, options.locale ?? defaultLocale);
  const { error } = await client.from("configs").delete().eq("key", storageKey);
  if (error) throw error;
};
