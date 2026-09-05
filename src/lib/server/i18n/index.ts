"server-only";

import { cacheTag } from "next/cache";
import { locale as rootLocale } from "next/root-params";
import { cache, use } from "react";

import { CACHE_TAGS } from "#lib/server/cache";
import { CONFIG_KEY } from "#lib/shared/config";
import {
  assertLocale,
  createT,
  type Dictionary,
  type Locale,
  type Translator,
} from "#lib/shared/i18n";
import { loadConfigs } from "#lib/shared/services/configs";
import { makeStaticClient } from "#lib/shared/supabase";

export const getLocale = async (): Promise<Locale> => {
  const value = await rootLocale();
  assertLocale(value);
  return value;
};

const loadDictionary = async (locale: Locale): Promise<Dictionary> => {
  "use cache";
  cacheTag(CACHE_TAGS.config);

  const configs = await loadConfigs(
    makeStaticClient(),
    [CONFIG_KEY.DICTIONARY],
    { locale },
  );
  return configs[CONFIG_KEY.DICTIONARY];
};

export const getI18nConfig = cache(async () => {
  const locale = await getLocale();
  const dictionary = await loadDictionary(locale);

  return { locale, dictionary };
});

// The #i18n import resolves here only for React Server Components.
export const useT = (): Translator<Dictionary> => {
  const { locale, dictionary } = use(getI18nConfig());
  return createT(dictionary, locale);
};

export const useLocale = (): Locale => use(getI18nConfig()).locale;

export const getT = async (): Promise<Translator<Dictionary>> => {
  const { locale, dictionary } = await getI18nConfig();
  return createT(dictionary, locale);
};

export const getScopedT = async <Scope extends object>(
  select: (dictionary: Dictionary) => Scope,
): Promise<Translator<Scope>> => {
  const translator = await getT();
  return translator.scope(select);
};
