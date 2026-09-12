import "server-only";
import { cacheTag } from "next/cache";

import { CACHE_TAGS } from "#lib/server/cache";
import type { ConfigKey } from "#lib/shared/config";
import {
  loadConfigOverrides,
  loadConfigs,
} from "#lib/shared/services/configs.service";
import { makeStaticClient } from "#lib/shared/supabase.client";

export const loadConfigsByServer = async <
  const Keys extends readonly ConfigKey[],
>(
  keys: Keys,
) => {
  "use cache";
  cacheTag(CACHE_TAGS.config);
  return loadConfigs(makeStaticClient(), keys);
};

export const loadConfigOverridesByServer = async <
  const Keys extends readonly ConfigKey[],
>(
  keys: Keys,
) => loadConfigOverrides(makeStaticClient(), keys);
