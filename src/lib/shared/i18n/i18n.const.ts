export const locales = ["en-US", "zh-CN"] as const;
export const defaultLocale: Locale = "en-US";

export type Locale = (typeof locales)[number];
