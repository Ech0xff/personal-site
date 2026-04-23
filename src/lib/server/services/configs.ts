"server-only";

import {
  deleteConfig,
  type FetchConfigOptions,
  fetchConfig,
  setConfig,
} from "@/lib/shared/services/configs";
import type { Json } from "@/types";

import { makeServerClient } from "../supabase";

export const fetchConfigByServer = async (
  key: string,
  locale?: string,
  options: boolean | FetchConfigOptions = {},
) => {
  const client = await makeServerClient();
  return fetchConfig(client, key, locale, options);
};

export const setConfigByServer = async (key: string, value: Json) => {
  const client = await makeServerClient();
  return setConfig(client, key, value);
};

export const deleteConfigByServer = async (key: string) => {
  const client = await makeServerClient();
  return deleteConfig(client, key);
};
