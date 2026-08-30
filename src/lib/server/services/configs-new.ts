"server-only";

import type { ConfigKey, ConfigOverride } from "#lib/shared/config-new";
import {
  deleteConfigOverride,
  loadConfigOverrides,
  loadConfigs,
  setConfigOverride,
  type ConfigOptions,
} from "#lib/shared/services/configs-new";

import { makeServerClient } from "../supabase";

export const loadConfigsByServer = async <
  const Keys extends readonly ConfigKey[],
>(
  keys: Keys,
  options: ConfigOptions = {},
) => loadConfigs(await makeServerClient(), keys, options);

export const loadConfigOverridesByServer = async <
  const Keys extends readonly ConfigKey[],
>(
  keys: Keys,
  options: ConfigOptions = {},
) => loadConfigOverrides(await makeServerClient(), keys, options);

export const setConfigOverrideByServer = async <K extends ConfigKey>(
  key: K,
  value: ConfigOverride<K>,
  options: ConfigOptions = {},
) => setConfigOverride(await makeServerClient(), key, value, options);

export const deleteConfigOverrideByServer = async (
  key: ConfigKey,
  options: ConfigOptions = {},
) => deleteConfigOverride(await makeServerClient(), key, options);
