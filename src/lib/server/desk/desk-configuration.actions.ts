"use server";
import { updateTag } from "next/cache";
import { z } from "zod";

import { deskConfigurationSchema } from "#lib/shared/desk/desk-layout.schema";

import { adminAction } from "../actions/action.service";
import { hasAdminSession } from "../auth/session.service";
import {
  deskConfigurationTag,
  readDeskWorkspace,
  saveDeskConfiguration,
} from "./desk-configuration.service";

export async function readDeskAccess() {
  return hasAdminSession();
}
export async function loadDeskWorkspace() {
  return adminAction(readDeskWorkspace);
}
export async function updateDeskConfiguration(input: unknown) {
  return adminAction(async () => {
    const { revision, configuration, publish } = z
      .object({
        revision: z.number().int().nonnegative(),
        configuration: deskConfigurationSchema,
        publish: z.boolean(),
      })
      .parse(input);
    const workspace = await saveDeskConfiguration(
      revision,
      configuration,
      publish,
    );
    if (publish) updateTag(deskConfigurationTag);
    return workspace;
  });
}
