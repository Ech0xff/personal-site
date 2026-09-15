import "server-only";
import { cacheLife, cacheTag } from "next/cache";

import { defaultDeskConfiguration } from "#lib/shared/desk/desk-defaults.const";
import {
  deskConfigurationSchema,
  workspaceSchema,
  type DeskConfiguration,
} from "#lib/shared/desk/desk-layout.schema";
import { defaultDictionary } from "#lib/shared/dictionary/dictionary.const";

import { InputError } from "../actions/action.service";
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
export async function readDeskWorkspace() {
  const { data, error } = await makeAdminClient()
    .from("configs")
    .select("value")
    .eq("key", "desk.workspace")
    .single();
  if (error) throw error;
  return workspaceSchema.parse(data.value);
}
export async function saveDeskConfiguration(
  revision: number,
  configuration: DeskConfiguration,
  publish: boolean,
) {
  const { data, error } = await makeAdminClient().rpc(
    "save_desk_configuration",
    { expected_revision: revision, configuration, publish },
  );
  if (error?.code === "40001")
    throw new InputError(defaultDictionary.desk.layout.conflict);
  if (error) throw error;
  return workspaceSchema.parse(data);
}
