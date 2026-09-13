import "server-only";
import { use } from "react";

import { defaultDictionary } from "#lib/shared/dictionary/dictionary.const";
const dictionary = Promise.resolve(defaultDictionary);
export const getDictionary = () => dictionary;
export const useDictionary = () => use(dictionary);
