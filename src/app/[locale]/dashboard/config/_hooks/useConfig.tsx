"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  deleteConfigByBrowser,
  fetchConfigsByBrowser,
  setConfigByBrowser,
} from "@/lib/client/services";
import type { ConfigKey, ConfigValue } from "@/lib/shared/config";
import { generateConfigKey } from "@/lib/shared/config/utils";

type UseConfigOptions<K extends ConfigKey> = {
  id: K;
};

export default function useConfig<K extends ConfigKey>({
  id,
}: UseConfigOptions<K>) {
  const [value, setValue] = useState<ConfigValue[K] | null>(null);
  const [locale, setLocale] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [hasStoredValue, setHasStoredValue] = useState(false);

  const saveConfig = useCallback(async () => {
    if (!id || value === null) return;
    try {
      await setConfigByBrowser(generateConfigKey(id, locale), value);
      setHasStoredValue(true);
      toast.success("Config saved.");
    } catch {
      toast.error("Failed to save config.");
    }
  }, [id, locale, value]);

  const getConfig = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const values = await fetchConfigsByBrowser([id], { locale });
      const value = values.get(id);
      setValue(value ?? null);
      setHasStoredValue(value !== null && value !== undefined);
    } catch {
      setHasStoredValue(false);
      setValue(null);
    } finally {
      setLoading(false);
    }
  }, [id, locale]);

  const deleteConfig = useCallback(async () => {
    if (!id || !hasStoredValue) return;
    try {
      await deleteConfigByBrowser(generateConfigKey(id, locale));
      toast.success("Config deleted.");
      await getConfig();
    } catch {
      toast.error("Failed to delete config.");
    }
  }, [getConfig, hasStoredValue, id, locale]);

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
