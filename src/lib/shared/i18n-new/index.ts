import enUSDictionary from "#lib/shared/i18n-new/messages/en-US";
import zhCNDictionary from "#lib/shared/i18n-new/messages/zh-CN";

import { Locale } from "./i18n.const";
import { Dictionary } from "./i18n.type";

export * from "./i18n.const";
export * from "./i18n.helper";
export * from "./i18n.type";

export const dictionaries: Record<Locale, Dictionary> = {
  "en-US": enUSDictionary,
  "zh-CN": zhCNDictionary,
};
