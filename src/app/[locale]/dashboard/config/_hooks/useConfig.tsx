"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { useLocale } from "#i18n";
import {
  deleteConfigOverrideByBrowser,
  loadConfigOverridesByBrowser,
  loadConfigsByBrowser,
  setConfigOverrideByBrowser,
} from "#lib/client/services/configs";
import {
  type ConfigKey,
  type ConfigOverride,
  type ConfigValue,
  CONFIG_REGISTRY,
  CONFIG_SCOPE,
  getConfigDefaults,
} from "#lib/shared/config";
import type { Locale } from "#lib/shared/i18n";

export default function useConfig<K extends ConfigKey>({ key }: { key: K }) {
  const routeLocale = useLocale();
  const [locale, setLocale] = useState<Locale>(routeLocale);
  const [value, setValue] = useState<ConfigValue<K>>(() =>
    getConfigDefaults(key, routeLocale),
  );
  const [override, setOverride] = useState<ConfigOverride<K> | null>(null);
  const [loading, setLoading] = useState(true);
  const localized = CONFIG_REGISTRY[key].scope === CONFIG_SCOPE.LOCALE;

  const getConfig = useCallback(async () => {
    setLoading(true);
    try {
      const options = { locale };
      const [values, overrides] = await Promise.all([
        loadConfigsByBrowser([key], options),
        loadConfigOverridesByBrowser([key], options),
      ]);
      setValue(values[key] as ConfigValue<K>);
      setOverride(overrides[key] as ConfigOverride<K> | null);
    } catch (error) {
      setValue(getConfigDefaults(key, locale));
      setOverride(null);
      toast.error(
        error instanceof Error ? error.message : "Failed to load config.",
      );
    } finally {
      setLoading(false);
    }
  }, [key, locale]);

  const saveConfig = useCallback(
    async (nextOverride?: ConfigOverride<K>) => {
      try {
        const saved = await setConfigOverrideByBrowser(
          key,
          nextOverride ?? (value as ConfigOverride<K>),
          { locale },
        );
        setOverride(saved);
        await getConfig();
        toast.success("Config saved.");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to save config.",
        );
      }
    },
    [getConfig, key, locale, value],
  );

  const deleteConfig = useCallback(async () => {
    if (override === null) return;
    try {
      await deleteConfigOverrideByBrowser(key, { locale });
      await getConfig();
      toast.success("Config deleted.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete config.",
      );
    }
  }, [getConfig, key, locale, override]);

  useEffect(() => {
    void getConfig();
  }, [getConfig]);

  return {
    value,
    setValue,
    override,
    locale,
    setLocale,
    localized,
    loading,
    hasStoredValue: override !== null,
    deleteConfig,
    saveConfig,
  };
}
