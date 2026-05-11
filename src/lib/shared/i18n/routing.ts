export const routing = {
  locales: ["en-US", "zh-CN"],
  defaultLocale: "en-US",
};

export type Locale = (typeof routing.locales)[number];
