import "server-only";
import { cache, use } from "react";

import { loadConfigsByServer } from "#lib/server/services/configs.service";
import { CONFIG_KEY } from "#lib/shared/config";

export const getDictionary = cache(async () => {
  const configs = await loadConfigsByServer([CONFIG_KEY.DICTIONARY]);
  return configs.DICTIONARY;
});

export const useDictionary = () => use(getDictionary());
