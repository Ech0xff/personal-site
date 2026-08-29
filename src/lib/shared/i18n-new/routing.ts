const defineRouting = <const Locales extends readonly string[]>(
  locales: Locales,
  defaultLocale: Locales[number],
) => ({ locales, defaultLocale });

export const routing = defineRouting(["en-US", "zh-CN"], "en-US");

export type Locale = (typeof routing.locales)[number];

export const isLocale = (value?: string | null): value is Locale =>
  routing.locales.some((locale) => locale === value);

export const 
= (value?: string | null): Locale =>
  isLocale(value) ? value : routing.defaultLocale;
