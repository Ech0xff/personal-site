"server-only";

import { deleteConfig, fetchConfig, setConfig } from "@/lib/shared/services/configs";
import type { Json } from "@/types";

import { makeServerClient } from "../supabase";

export const fetchConfigByServer = async (key: string) => {
  const client = await makeServerClient();
  return fetchConfig(client, key);
};

export const setConfigByServer = async (key: string, value: Json) => {
  const client = await makeServerClient();
  return setConfig(client, key, value);
};

export const deleteConfigByServer = async (key: string) => {
  const client = await makeServerClient();
  return deleteConfig(client, key);
}