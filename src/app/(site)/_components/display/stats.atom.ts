import { z } from "zod";

import { storedPreference } from "#lib/client/storage/stored-preference.atom";
export const deskLikedAtom = storedPreference(
  "redesign:desk-liked:v1",
  false,
  z.boolean(),
);
