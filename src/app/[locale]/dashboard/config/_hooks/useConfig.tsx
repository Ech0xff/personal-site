"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import {
  deleteConfigByBrowser,
  fetchConfigsByBrowser,
  setConfigByBrowser,
} from "@/lib/client/services";
import { getLocaleConfigKey } from "@/lib/shared/services/configs";
import type { Json } from "@/types";

export type ResolveConfigValueArgs = {
  key: string;
  currentValue: Json | null;
};

export const resolveConfigValue = ({ currentValue }: ResolveConfigValueArgs) =>
  typeof currentValue === "string" ? currentValue : "";

export const getConfigStorageKey = (key: string, locale: string) =>
  locale ? getLocaleConfigKey(key, locale) : key;

async function loadConfigValue(key: string, locale: string) {
  const storageKey = getConfigStorageKey(key, locale);
  const values = await fetchConfigsByBrowser([storageKey]);
  const currentValue = values.get(storageKey) ?? null;

  return {
    key,
    hasStoredValue: currentValue !== null && currentValue !== undefined,
    currentValue,
  };
}

type UseConfigOptions<T extends Json> = {
  id: string;
  initialValue: T;
  resolveValue?: (args: ResolveConfigValueArgs) => T;
};

export default function useConfig<T extends Json>({
  id,
  initialValue,
  resolveValue,
}: UseConfigOptions<T>) {
  const [value, setValue] = useState<T>(initialValue);
  const [locale, setLocale] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [hasStoredValue, setHasStoredValue] = useState(false);

  const saveConfig = useCallback(async () => {
    if (!id) return;
    try {
      await setConfigByBrowser(getConfigStorageKey(id, locale), value);
      toast.success("Config saved.");
    } catch {
      toast.error("Failed to save config.");
    }
  }, [id, locale, value]);

  const getConfig = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const nextConfig = await loadConfigValue(id, locale);
      const nextValue = resolveValue
        ? resolveValue(nextConfig)
        : ((nextConfig.currentValue ?? initialValue) as T);
      setHasStoredValue(nextConfig.hasStoredValue);
      setValue(nextValue);
    } catch {
      setHasStoredValue(false);
      setValue(initialValue);
    } finally {
      setLoading(false);
    }
  }, [id, initialValue, locale, resolveValue]);

  const deleteConfig = useCallback(async () => {
    if (!id || !hasStoredValue) return;

    try {
      await deleteConfigByBrowser(getConfigStorageKey(id, locale));
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
