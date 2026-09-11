"use server";

import { updateTag } from "next/cache";
import { z } from "zod";

import { CACHE_TAGS } from "#lib/server/cache";
import { makeServerClient } from "#lib/server/supabase.client";
import {
  CONFIG_KEY,
  type ConfigKey,
  type ConfigOverride,
} from "#lib/shared/config";
import {
  deleteConfigOverride,
  setConfigOverride,
} from "#lib/shared/services/configs.service";

const requireConfigAdmin = async (key: ConfigKey) => {
  z.enum(CONFIG_KEY).parse(key);
  const client = await makeServerClient();
  const {
    data: { user },
    error,
  } = await client.auth.getUser();
  if (error || user?.app_metadata.role !== "admin")
    throw new Error("Unauthorized");
  return client;
};

export async function saveConfigOverride<K extends ConfigKey>(
  key: K,
  value: ConfigOverride<K>,
) {
  const client = await requireConfigAdmin(key);
  const saved = await setConfigOverride(client, key, value);
  updateTag(CACHE_TAGS.config);
  return saved;
}

export async function removeConfigOverride(key: ConfigKey) {
  const client = await requireConfigAdmin(key);
  await deleteConfigOverride(client, key);
  updateTag(CACHE_TAGS.config);
}
