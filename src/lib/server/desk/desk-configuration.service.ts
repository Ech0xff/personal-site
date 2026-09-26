import "server-only";
import { cacheLife, cacheTag } from "next/cache";

import {
  deskConfigurationSchema,
  type DeskConfiguration,
} from "#lib/shared/desk/desk-configuration.schema";
import { defaultDeskConfiguration } from "#lib/shared/desk/desk-defaults.const";

import { requireAdmin } from "../auth/session.service";
import { makeAdminClient, makePublicClient } from "../supabase.client";

export const deskConfigurationTag = "desk:configuration";
export async function readPublicDeskConfiguration(): Promise<DeskConfiguration> {
  "use cache";
  cacheLife("hours");
  cacheTag(deskConfigurationTag);
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
    return defaultDeskConfiguration;
  const { data, error } = await makePublicClient().rpc(
    "read_desk_configuration",
  );
  if (error) throw error;
  return data === null
    ? defaultDeskConfiguration
    : deskConfigurationSchema.parse(data);
}
export async function readAdminDeskConfiguration(): Promise<DeskConfiguration> {
  await requireAdmin();
  const { data, error } = await makeAdminClient()
    .from("configs")
    .select("value")
    .eq("key", "desk.configuration")
    .maybeSingle();
  if (error) throw error;
  return !data || data.value === null
    ? defaultDeskConfiguration
    : deskConfigurationSchema.parse(data.value);
}
export async function saveDeskConfiguration(configuration: DeskConfiguration) {
  const { error } = await makeAdminClient()
    .from("configs")
    .upsert({
      key: "desk.configuration",
      value: { items: [...configuration.items] },
    });
  if (error) throw error;
  return configuration;
}
