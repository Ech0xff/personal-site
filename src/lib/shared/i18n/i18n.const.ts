import type { Locale } from "./i18n.type";

export const locales = ["en-US", "zh-CN"] as const;
export const defaultLocale: Locale = "en-US";

export const localeLabels: Record<Locale, string> = {
  "en-US": "EN",
  "zh-CN": "中",
};

export const LOCALE_COOKIE = "locale";
