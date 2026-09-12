"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import {
  deleteConfigOverrideByBrowser,
  loadConfigByBrowser,
  setConfigOverrideByBrowser,
} from "#lib/client/services/configs.service";
import {
  type ConfigKey,
  type ConfigOverride,
  type ConfigValue,
  getConfigDefaults,
} from "#lib/shared/config";

export default function useConfig<K extends ConfigKey>({ key }: { key: K }) {
  const router = useRouter();
  const [value, setValue] = useState<ConfigValue<K>>(() =>
    getConfigDefaults(key),
  );
  const [override, setOverride] = useState<ConfigOverride<K> | null>(null);
  const [loading, setLoading] = useState(true);

  const getConfig = useCallback(async () => {
    setLoading(true);
    try {
      const config = await loadConfigByBrowser(key);
      setValue(config.value);
      setOverride(config.override);
    } catch (error) {
      setValue(getConfigDefaults(key));
      setOverride(null);
      toast.error(
        error instanceof Error ? error.message : "Failed to load config.",
      );
    } finally {
      setLoading(false);
    }
  }, [key]);

  const saveConfig = useCallback(
    async (nextOverride: ConfigOverride<K>) => {
      try {
        const saved = await setConfigOverrideByBrowser(key, nextOverride);
        setOverride(saved);
        await getConfig();
        router.refresh();
        toast.success("Config saved.");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to save config.",
        );
      }
    },
    [getConfig, key, router],
  );

  const deleteConfig = useCallback(async () => {
    if (override === null) return;
    try {
      await deleteConfigOverrideByBrowser(key);
      await getConfig();
      router.refresh();
      toast.success("Config deleted.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete config.",
      );
    }
  }, [getConfig, key, override, router]);

  useEffect(() => {
    void getConfig();
  }, [getConfig]);

  return {
    value,
    setValue,
    override,
    loading,
    hasStoredValue: override !== null,
    deleteConfig,
    saveConfig,
  };
}
