import { hasLocale } from "next-intl";

import { routing } from "./routing";

export const getNormalizedLocale = (locale?: string) => {
  return hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
};
