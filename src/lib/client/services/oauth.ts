import { CONFIG_KEY } from "#lib/shared/config";

import { loadConfigsByBrowser } from "./configs";

export const fetchAvailableOauthProvidersByBrowser = async () => {
  try {
    const configs = await loadConfigsByBrowser([CONFIG_KEY.OAUTH]);
    return configs[CONFIG_KEY.OAUTH];
  } catch {
    return [];
  }
};
