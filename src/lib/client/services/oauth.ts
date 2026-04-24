import { CONFIG_KEYS } from "@/lib/shared/config";

import { fetchConfigByBrowser } from "./configs";

const normalizeConfigLocale = (locale?: string) => locale?.replace("-", "_");

export const fetchAvailableOauthProvidersByBrowser = async (
  locale?: string,
) => {
  const configLocale = normalizeConfigLocale(locale);

  try {
    const value = await fetchConfigByBrowser(
      CONFIG_KEYS.oauthProviders,
      configLocale,
      Boolean(configLocale),
    );

    return value ?? [];
  } catch {
    return [];
  }
};
