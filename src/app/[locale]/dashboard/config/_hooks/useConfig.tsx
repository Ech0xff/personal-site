"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  deleteConfigByBrowser,
  fetchConfigsByBrowser,
  setConfigByBrowser,
} from "@/lib/client/services";
import {
  CONFIG_KEYS,
  type ConfigKey,
  type ConfigValue,
  DEFAULT_SITE_INFO,
} from "@/lib/shared/config";
import { generateConfigKey } from "@/lib/shared/config/utils";
import { type Locale, routing } from "@/lib/shared/i18n/routing";

type UseConfigOptions<K extends ConfigKey> = {
  key: K;
};

const defaultConfigValues = {
  [CONFIG_KEYS.aboutMe]: "",
  [CONFIG_KEYS.playlistUrl]: "",
  [CONFIG_KEYS.oauthProviders]: [],
  [CONFIG_KEYS.siteInfo]: DEFAULT_SITE_INFO,
  [CONFIG_KEYS.recentPlan]: [],
} satisfies ConfigValue;

export default function useConfig<K extends ConfigKey>({
  key,
}: UseConfigOptions<K>) {
  const [value, setValue] = useState<ConfigValue[K]>(defaultConfigValues[key]);
  const [locale, setLocale] = useState<Locale>(routing.defaultLocale);
  const [loading, setLoading] = useState(true);
  const [hasStoredValue, setHasStoredValue] = useState(false);

  const saveConfig = useCallback(async () => {
    try {
      const newValue = await setConfigByBrowser(
        generateConfigKey(key, locale),
        value,
      );
      setValue(newValue);
      setHasStoredValue(true);
      toast.success("Config saved.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save config.");
    }
  }, [key, locale, value]);

  const getConfig = useCallback(async () => {
    setLoading(true);
    try {
      const values = await fetchConfigsByBrowser([key], {
        locale,
        strict: true,
      });
      const value = values.get(key);
      setValue(value !== undefined ? value : defaultConfigValues[key]);
      setHasStoredValue(value !== undefined);
    } catch {
      setHasStoredValue(false);
      setValue(defaultConfigValues[key]);
    } finally {
      setLoading(false);
    }
  }, [key, locale]);

  const deleteConfig = useCallback(async () => {
    if (!hasStoredValue) return;
    try {
      await deleteConfigByBrowser(generateConfigKey(key, locale));
      toast.success("Config deleted.");
      await getConfig();
    } catch {
      toast.error("Failed to delete config.");
    }
  }, [getConfig, hasStoredValue, key, locale]);

  useEffect(() => {
    let ignore = false;
    if (ignore) return;
    getConfig();
    return () => {
      ignore = true;
    };
  }, [getConfig]);

  return {
    value,
    setValue,
    locale,
    setLocale,
    loading,
    hasStoredValue,
    deleteConfig,
    saveConfig,
  };
}
