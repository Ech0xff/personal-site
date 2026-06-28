import { json } from "@codemirror/lang-json";
import type { Extension } from "@codemirror/state";

const languageExtension = json();

export const resolveExtensions = (): Extension => {
  return [languageExtension];
};
