"server-only";

import { getLocale } from "#lib/server/i18n";
import type { ConfigKey } from "#lib/shared/config";
import { loadConfigOverrides, loadConfigs } from "#lib/shared/services/configs";
import { makeStaticClient } from "#lib/shared/supabase";

export const loadConfigsByServer = async <
  const Keys extends readonly ConfigKey[],
>(
  keys: Keys,
) => loadConfigs(makeStaticClient(), keys, { locale: await getLocale() });

export const loadConfigOverridesByServer = async <
  const Keys extends readonly ConfigKey[],
>(
  keys: Keys,
) =>
  loadConfigOverrides(makeStaticClient(), keys, { locale: await getLocale() });
