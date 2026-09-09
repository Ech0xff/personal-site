import { toMerged } from "es-toolkit";

import type { Dictionary, PartialDictionary } from "../i18n.type";
import { dictionary } from "./default";

export const defineDictionary = (overrides: PartialDictionary): Dictionary =>
  toMerged(dictionary, overrides);
