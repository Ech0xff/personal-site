import "server-only";
import { cacheLife, cacheTag } from "next/cache";

import { defaultDeskConfiguration } from "#lib/shared/desk/desk-defaults.const";
import {
  deskConfigurationSchema,
  type DeskConfiguration,
} from "#lib/shared/desk/desk-layout.schema";

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
  return data ? deskConfigurationSchema.parse(data) : defaultDeskConfiguration;
}
export async function saveDeskConfiguration(configuration: DeskConfiguration) {
  const { error } = await makeAdminClient()
    .from("configs")
    .upsert({ key: "desk.configuration", value: configuration });
  if (error) throw error;
  return configuration;
}
