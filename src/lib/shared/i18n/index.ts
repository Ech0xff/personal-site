import enUSDictionary from "#lib/shared/i18n/messages/en-US";
import zhCNDictionary from "#lib/shared/i18n/messages/zh-CN";

import type { Locale } from "./i18n.const";
import type { Dictionary } from "./i18n.type";

export * from "./i18n.const";
export * from "./i18n.helper";
export * from "./i18n.type";
export * from "./locale";
export * from "./routing";

export const dictionaries: Record<Locale, Dictionary> = {
  "en-US": enUSDictionary,
  "zh-CN": zhCNDictionary,
};
