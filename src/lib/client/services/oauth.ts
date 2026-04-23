import {
  AUTH_CONFIG_KEYS,
  resolveOauthProviders,
} from "@/lib/shared/config/oauth";

import { fetchConfigByBrowser } from "./configs";

const normalizeConfigLocale = (locale?: string) => locale?.replace("-", "_");

export const fetchAvailableOauthProvidersByBrowser = async (
  locale?: string,
) => {
  const configLocale = normalizeConfigLocale(locale);

  try {
    const [value, legacyValue] = await Promise.all([
      fetchConfigByBrowser(
        AUTH_CONFIG_KEYS.oauthProviders,
        configLocale,
        Boolean(configLocale),
      ),
      fetchConfigByBrowser(
        AUTH_CONFIG_KEYS.legacyOauthEnabled,
        configLocale,
        Boolean(configLocale),
      ),
    ]);

    return resolveOauthProviders(value ?? legacyValue);
  } catch {
    return resolveOauthProviders(null);
  }
};
