import type { SupabaseClient } from "@supabase/supabase-js";

import {
  type ConfigDefinition,
  type ConfigKey,
  type ConfigOverride,
  type ConfigOverrideSnapshot,
  CONFIG_REGISTRY,
  CONFIG_SCOPE,
  type ConfigSnapshot,
} from "#lib/shared/config";
import { defaultLocale, type Locale } from "#lib/shared/i18n";
import type { Database, Json } from "#types";

export type ConfigOptions = {
  locale?: Locale;
};

type RuntimeDefinition = ConfigDefinition<Json, unknown>;

const getDefinition = (key: ConfigKey) =>
  CONFIG_REGISTRY[key] as unknown as RuntimeDefinition;

const getStorageKey = (key: ConfigKey, locale: Locale) =>
  getDefinition(key).scope === CONFIG_SCOPE.LOCALE ? `${key}:${locale}` : key;

const getDefaults = (key: ConfigKey, locale: Locale) => {
  const definition = getDefinition(key);
  return definition.scope === CONFIG_SCOPE.LOCALE
    ? definition.defaults({ locale })
    : definition.defaults();
};

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

export const loadConfigs = async <const Keys extends readonly ConfigKey[]>(
  client: SupabaseClient<Database>,
  keys: Keys,
  options: ConfigOptions = {},
): Promise<ConfigSnapshot<Keys[number]>> => {
  const locale = options.locale ?? defaultLocale;
  const storedConfigs = await fetchStoredConfigs(keys, locale, client);

  return Object.fromEntries(
    keys.map((key) => {
      const definition = getDefinition(key);
      const defaults = getDefaults(key, locale);
      const stored = storedConfigs.get(getStorageKey(key, locale));
      const value =
        stored === undefined
          ? defaults
          : definition.resolve(defaults, definition.schema.parse(stored));

      return [key, value];
    }),
  ) as ConfigSnapshot<Keys[number]>;
};

export const loadConfigOverrides = async <
  const Keys extends readonly ConfigKey[],
>(
  client: SupabaseClient<Database>,
  keys: Keys,
  options: ConfigOptions = {},
): Promise<ConfigOverrideSnapshot<Keys[number]>> => {
  const locale = options.locale ?? defaultLocale;
  const storedConfigs = await fetchStoredConfigs(keys, locale, client);

  return Object.fromEntries(
    keys.map((key) => {
      const stored = storedConfigs.get(getStorageKey(key, locale));
      return [
        key,
        stored === undefined ? null : getDefinition(key).schema.parse(stored),
      ];
    }),
  ) as ConfigOverrideSnapshot<Keys[number]>;
};

export const setConfigOverride = async <K extends ConfigKey>(
  client: SupabaseClient<Database>,
  key: K,
  override: ConfigOverride<K>,
  options: ConfigOptions = {},
): Promise<ConfigOverride<K>> => {
  const value = getDefinition(key).schema.parse(override);
  const storageKey = getStorageKey(key, options.locale ?? defaultLocale);
  const { error } = await client
    .from("configs")
    .upsert({ key: storageKey, value }, { onConflict: "key" });
  if (error) throw error;

  return value as ConfigOverride<K>;
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
