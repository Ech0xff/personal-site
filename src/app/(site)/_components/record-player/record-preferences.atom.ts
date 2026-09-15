import { z } from "zod";

import { storedPreference } from "#lib/client/storage/stored-preference.atom";
import {
  defaultRecordSession,
  recordSessionSchema,
  recordStorageKey,
} from "#lib/shared/audio/record-session.helper";

import { playbackModeSchema } from "./record-playback.helper";
export const recordSessionAtom = storedPreference(
  recordStorageKey,
  defaultRecordSession,
  recordSessionSchema,
);
export const recordControlsPinnedAtom = storedPreference(
  "redesign:record-controls-pinned:v1",
  false,
  z.boolean(),
);
export const playbackModeAtom = storedPreference(
  "redesign:record-playback-mode:v1",
  "repeat-all",
  playbackModeSchema,
);
