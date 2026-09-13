import { z } from "zod";

import { storedPreference } from "#lib/client/storage/stored-preference.atom";
export const lampOnAtom = storedPreference(
  "redesign:lamp-on:v1",
  true,
  z.boolean(),
);
