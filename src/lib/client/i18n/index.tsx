"use client";

import { assert } from "es-toolkit";
import { createContext, useContext, useMemo } from "react";

import { createT, Dictionary } from "#lib/shared/i18n-new";
import type { Locale } from "#lib/shared/i18n-new/i18n.const";

interface I18nContextValue {
  locale: Locale;
  dictionary: Dictionary;
}

const I18nContext = createContext<I18nContextValue | null>(null);

interface I18nProviderProps extends I18nContextValue {
  children: React.ReactNode;
}

export function I18nProvider({
  locale,
  dictionary,
  children,
}: I18nProviderProps) {
  const value = useMemo(() => ({ locale, dictionary }), [locale, dictionary]);

  return <I18nContext value={value}>{children}</I18nContext>;
}

const useI18n = () => {
  const value = useContext(I18nContext);

  assert(value, "useI18n must be used within I18nProvider");

  return value;
};

export const useT = () => {
  const { dictionary } = useI18n();

  return useMemo(() => createT(dictionary), [dictionary]);
};

export const useLocale = (): Locale => useI18n().locale;
