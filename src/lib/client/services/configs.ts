import {
  deleteConfig,
  fetchConfig,
  setConfig,
} from "@/lib/shared/services/configs";

import { makeBrowserClient } from "../supabase";

export const fetchConfigByBrowser = async (key: string) => {
  const client = makeBrowserClient();
  return fetchConfig(client, key);
};

export const setConfigByBrowser = async (key: string, value: any) => {
  const client = makeBrowserClient();
  return setConfig(client, key, value);
};

export const deleteConfigByBrowser = async (key: string) => {
  const client = makeBrowserClient();
  return deleteConfig(client, key);
};
