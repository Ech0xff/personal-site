import type { ConfigKey, ConfigValue } from "@/lib/shared/config";
import {
  deleteConfig,
  fetchConfigs,
  setConfig,
} from "@/lib/shared/services/configs";
import type { Json } from "@/types";

import { makeBrowserClient } from "../supabase";

export const fetchConfigByBrowser = async <K extends ConfigKey>(
  key: K,
  locale?: string,
  strict = false,
): Promise<ConfigValue[K] | null> => {
  const client = makeBrowserClient();
  const configs = await fetchConfigs([key], { locale, strict }, client);
  return configs.get(key) ?? null;
};

export const setConfigByBrowser = async (key: string, value: Json) => {
  const client = makeBrowserClient();
  return setConfig(key, value, client);
};

export const fetchConfigsByBrowser = async <K extends ConfigKey>(
  keys: readonly K[],
  options: {
    locale?: string;
    strict?: boolean;
  } = {},
) => {
  const client = makeBrowserClient();
  return fetchConfigs(keys, options, client);
};

export const deleteConfigByBrowser = async (key: string) => {
  const client = makeBrowserClient();
  return deleteConfig(client, key);
};
