import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";

import { routing } from "./routing";

export const getNormalizedLocale = (locale?: string) => {
  return hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
};

export const getI18n = async (namespace: string, locale?: string) => {
  locale = getNormalizedLocale(locale);
  return await getTranslations({ namespace, locale });
};
