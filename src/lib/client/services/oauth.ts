import { CONFIG_KEYS } from "#lib/shared/config";

import { fetchConfigByBrowser } from "./configs";

export const fetchAvailableOauthProvidersByBrowser = async (
  locale?: string,
) => {
  try {
    const value = await fetchConfigByBrowser(
      CONFIG_KEYS.oauthProviders,
      locale,
    );

    return value ?? [];
  } catch {
    return [];
  }
};
