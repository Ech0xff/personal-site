"server-only";

import {
  createT,
  dictionaries,
  type Dictionary,
  type Locale,
  type Translator,
} from "#lib/shared/i18n-new";

/** Returns the complete server-side dictionary translator. */
export const getT = (locale: Locale): Translator<Dictionary> => {
  return createT(dictionaries[locale]);
};
