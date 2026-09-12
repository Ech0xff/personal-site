"use client";

import {
  saveConfigOverride,
  removeConfigOverride,
} from "#lib/server/services/config-mutations.service";
import type { ConfigKey, ConfigOverride } from "#lib/shared/config";
import {
  loadConfigOverrides,
  loadConfigs,
  loadConfig,
} from "#lib/shared/services/configs.service";

import { makeBrowserClient } from "../supabase.client";

export const loadConfigByBrowser = <K extends ConfigKey>(key: K) =>
  loadConfig(makeBrowserClient(), key);

export const loadConfigsByBrowser = <const Keys extends readonly ConfigKey[]>(
  keys: Keys,
) => loadConfigs(makeBrowserClient(), keys);

export const loadConfigOverridesByBrowser = <
  const Keys extends readonly ConfigKey[],
>(
  keys: Keys,
) => loadConfigOverrides(makeBrowserClient(), keys);

export const setConfigOverrideByBrowser = <K extends ConfigKey>(
  key: K,
  value: ConfigOverride<K>,
) => saveConfigOverride(key, value);

export const deleteConfigOverrideByBrowser = (key: ConfigKey) =>
  removeConfigOverride(key);
