"use client";

import { Provider } from "jotai";
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
  return (
    <Provider>
      <DictionaryContext value={dictionary}>{children}</DictionaryContext>
    </Provider>
  );
}

export const useDictionary = () => useContext(DictionaryContext);
