import { defaultDictionary } from "#lib/shared/dictionary/dictionary.const";

import type { DisplayProgram } from "./display-content.schema";
export const displayPrograms: readonly Readonly<{
  id: DisplayProgram;
  label: string;
}>[] = [
  { id: "terminal", label: "CLI" },
  { id: "stats", label: "Stats" },
  { id: "guestbook", label: "Guestbook" },
  { id: "settings", label: defaultDictionary.desk.settings },
];
