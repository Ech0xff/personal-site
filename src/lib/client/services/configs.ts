import {
  deleteConfig,
  type FetchConfigOptions,
  fetchConfig,
  fetchConfigs,
  setConfig,
} from "@/lib/shared/services/configs";
import type { Json } from "@/types";

import { makeBrowserClient } from "../supabase";

export const fetchConfigByBrowser = async (
  key: string,
  locale?: string,
  options: boolean | FetchConfigOptions = {},
) => {
  const client = makeBrowserClient();
  return fetchConfig(client, key, locale, options);
};

export const setConfigByBrowser = async (key: string, value: Json) => {
  const client = makeBrowserClient();
  return setConfig(client, key, value);
};

export const fetchConfigsByBrowser = async (keys: string[]) => {
  const client = makeBrowserClient();
  return fetchConfigs(client, keys);
};

export const deleteConfigByBrowser = async (key: string) => {
  const client = makeBrowserClient();
  return deleteConfig(client, key);
};
