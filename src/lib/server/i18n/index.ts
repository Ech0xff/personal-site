"server-only";

import { cacheTag } from "next/cache";
import { locale as rootLocale } from "next/root-params";

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

const loadDictionary = async (): Promise<Dictionary> => {
  "use cache";
  cacheTag(CACHE_TAGS.config);

  const locale = await getLocale();
  const configs = await loadConfigs(
    makeStaticClient(),
    [CONFIG_KEY.DICTIONARY],
    { locale },
  );
  return configs[CONFIG_KEY.DICTIONARY];
};

export const getT = async (): Promise<Translator<Dictionary>> => {
  const [locale, dictionary] = await Promise.all([
    getLocale(),
    loadDictionary(),
  ]);
  return createT(dictionary, locale);
};

export const getScopedT = async <Scope extends object>(
  select: (dictionary: Dictionary) => Scope,
): Promise<Translator<Scope>> => {
  const translator = await getT();
  return translator.scope(select);
};
