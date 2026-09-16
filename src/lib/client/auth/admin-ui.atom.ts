import { z } from "zod";

import { storedPreference } from "#lib/client/storage/stored-preference.atom";

/** UI hint only; Server Actions still authenticate the admin session. */
export const isAdminAtom = storedPreference(
  "admin:ui-state:v1",
  false,
  z.boolean(),
);
