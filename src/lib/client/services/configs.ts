import {
  deleteConfig,
  fetchConfig,
  setConfig,
} from "@/lib/shared/services/configs";
import type { Json } from "@/types";

import { makeBrowserClient } from "../supabase";

export const fetchConfigByBrowser = async (key: string) => {
  const client = makeBrowserClient();
  return fetchConfig(client, key);
};

export const setConfigByBrowser = async (key: string, value: Json) => {
  const client = makeBrowserClient();
  return setConfig(client, key, value);
};

export const deleteConfigByBrowser = async (key: string) => {
  const client = makeBrowserClient();
  return deleteConfig(client, key);
};
