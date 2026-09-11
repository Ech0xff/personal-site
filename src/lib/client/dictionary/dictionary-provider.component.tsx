"use client";

import { createContext, useContext, type ReactNode } from "react";

import { defaultDictionary } from "#lib/shared/dictionary/dictionary.const";
import type { Dictionary } from "#lib/shared/dictionary/dictionary.type";

const DictionaryContext = createContext<Dictionary>(defaultDictionary);

export function DictionaryProvider({
  dictionary,
  children,
}: {
  dictionary: Dictionary;
  children: ReactNode;
}) {
  return <DictionaryContext value={dictionary}>{children}</DictionaryContext>;
}

export const useDictionary = () => useContext(DictionaryContext);
