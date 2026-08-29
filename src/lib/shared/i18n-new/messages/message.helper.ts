import { toMerged } from "es-toolkit";
import type { DeepPartial, DeepReadonly } from "es-toolkit/types";

const dictionary = {
  meta: {
    siteTitle: "Ech0's Little Nest",
    siteDescription: "A place where technology and life intersect.",
  },
};

/** The complete dictionary shape shared by every locale. */
export type Dictionary = DeepReadonly<typeof dictionary>;
export type PartialDictionary = DeepPartial<Dictionary>;

export const defineDictionary = (overrides: PartialDictionary): Dictionary =>
  toMerged(dictionary, overrides);
