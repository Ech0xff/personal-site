"server-only";

import type { ConfigKey, ConfigValue } from "@/lib/shared/config";
import {
  deleteConfig,
  fetchConfigs,
  setConfig,
} from "@/lib/shared/services/configs";
import type { Json } from "@/types";

import { makeServerClient } from "../supabase";

export const fetchConfigByServer = async <K extends ConfigKey>(
  key: K,
  locale?: string,
  strict = false,
): Promise<ConfigValue[K] | null> => {
  const client = await makeServerClient();
  const configs = await fetchConfigs([key], { locale, strict }, client);
  return configs.get(key) ?? null;
};

export const setConfigByServer = async (key: string, value: Json) => {
  const client = await makeServerClient();
  return setConfig(key, value, client);
};

export const deleteConfigByServer = async (key: string) => {
  const client = await makeServerClient();
  return deleteConfig(client, key);
};
