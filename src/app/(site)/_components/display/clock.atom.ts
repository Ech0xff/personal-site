import { z } from "zod";

import { storedPreference } from "#lib/client/storage/stored-preference.atom";
export const clockFormatAtom = storedPreference(
  "redesign:clock-format:v1",
  "24h",
  z.enum(["12h", "24h"]),
  (raw) => (raw === "12h" || raw === "24h" ? JSON.stringify(raw) : raw),
);
