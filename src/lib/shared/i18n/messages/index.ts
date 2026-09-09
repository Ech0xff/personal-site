import type { Dictionary, Locale } from "../i18n.type";
import enUSDictionary from "./en-US";
import zhCNDictionary from "./zh-CN";

export const dictionaries: Record<Locale, Dictionary> = {
  "en-US": enUSDictionary,
  "zh-CN": zhCNDictionary,
};
