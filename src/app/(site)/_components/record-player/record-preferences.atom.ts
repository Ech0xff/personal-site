import { z } from "zod";

import { storedPreference } from "#lib/client/storage/stored-preference.atom";

import { playbackModeSchema } from "./record-playback.helper";
import {
  defaultRecordSession,
  normalizeRecordSession,
  recordSessionSchema,
  recordStorageKey,
} from "./record-session.helper";
export const recordSessionAtom = storedPreference(
  recordStorageKey,
  defaultRecordSession,
  recordSessionSchema.transform(normalizeRecordSession),
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
