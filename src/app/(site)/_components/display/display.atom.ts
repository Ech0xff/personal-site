import { storedPreference } from "#lib/client/storage/stored-preference.atom";

import { displayProgramSchema } from "./display-content.schema";
export const displayProgramAtom = storedPreference(
  "redesign:display-program:v1",
  "terminal",
  displayProgramSchema,
);
