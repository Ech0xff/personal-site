import { storedPreference } from "#lib/client/storage/stored-preference.atom";
import {
  personalLayoutsSchema,
  type PersonalLayouts,
} from "#lib/shared/desk/desk-layout.schema";
export const personalDeskLayoutsAtom = storedPreference<PersonalLayouts>(
  "desk:personal-layouts:v1",
  {},
  personalLayoutsSchema,
);
