"server-only";

import {
  createT,
  type Dictionary,
  type Locale,
  normalizeLocale,
  type Translator,
} from "#lib/shared/i18n-new";
import enUSDictionary from "#lib/shared/i18n-new/messages/en-US";
import zhCNDictionary from "#lib/shared/i18n-new/messages/zh-CN";

const dictionaries: Record<Locale, Dictionary> = {
  "en-US": enUSDictionary,
  "zh-CN": zhCNDictionary,
};

/** Returns the complete server-side dictionary translator. */
export const getT = (locale: string): Translator<Dictionary> => {
  const currentLocale = normalizeLocale(locale);

  return createT(dictionaries[currentLocale]);
};
