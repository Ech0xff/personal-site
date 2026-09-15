"use server";
import { updateTag } from "next/cache";

import { deskConfigurationSchema } from "#lib/shared/desk/desk-layout.schema";

import { adminAction } from "../actions/action.service";
import { validateAudioReferences } from "../audio/audio-assets.service";
import { hasAdminSession } from "../auth/session.service";
import {
  deskConfigurationTag,
  saveDeskConfiguration,
} from "./desk-configuration.service";

export async function readDeskAccess() {
  return hasAdminSession();
}
export async function updateDeskConfiguration(input: unknown) {
  return adminAction(async () => {
    const configuration = deskConfigurationSchema.parse(input);
    await validateAudioReferences(
      configuration.items.flatMap((item) =>
        item.type === "record"
          ? item.config.tracks.map((track) => track.assetId)
          : [],
      ),
    );
    const saved = await saveDeskConfiguration(configuration);
    updateTag(deskConfigurationTag);
    return saved;
  });
}
