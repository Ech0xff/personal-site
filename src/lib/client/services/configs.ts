"use client";

import type { ConfigKey, ConfigOverride } from "#lib/shared/config";
import {
  deleteConfigOverride,
  loadConfigOverrides,
  loadConfigs,
  setConfigOverride,
  type ConfigOptions,
} from "#lib/shared/services/configs";

import { makeBrowserClient } from "../supabase";

export const loadConfigsByBrowser = <const Keys extends readonly ConfigKey[]>(
  keys: Keys,
  options: ConfigOptions = {},
) => loadConfigs(makeBrowserClient(), keys, options);

export const loadConfigOverridesByBrowser = <
  const Keys extends readonly ConfigKey[],
>(
  keys: Keys,
  options: ConfigOptions = {},
) => loadConfigOverrides(makeBrowserClient(), keys, options);

export const setConfigOverrideByBrowser = <K extends ConfigKey>(
  key: K,
  value: ConfigOverride<K>,
  options: ConfigOptions = {},
) => setConfigOverride(makeBrowserClient(), key, value, options);

export const deleteConfigOverrideByBrowser = (
  key: ConfigKey,
  options: ConfigOptions = {},
) => deleteConfigOverride(makeBrowserClient(), key, options);
