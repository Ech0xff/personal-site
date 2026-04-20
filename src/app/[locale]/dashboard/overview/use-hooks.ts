import { json, jsonParseLinter } from "@codemirror/lang-json";
import { linter, lintGutter } from "@codemirror/lint";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  fetchConfigByBrowser,
  setConfigByBrowser,
} from "@/lib/client/services";
import {
  formatConfigJson,
  parseConfigJsonResult,
} from "./_components/config-json";

const CONFIG_KEY = "site";
const EMPTY_CONFIG = "{}";

const stringifyConfig = (value: unknown) =>
  JSON.stringify(value ?? {}, null, 2) || EMPTY_CONFIG;

export const useHooks = () => {
  const [configText, setConfigText] = useState(EMPTY_CONFIG);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [saving, setSaving] = useState(false);

  const [refreshingCache, setRefreshingCache] = useState(false);
  const configEditorExtensions = useMemo(
    () => [json(), lintGutter(), linter(jsonParseLinter())],
    [],
  );

  const handleRefreshAllCaches = async () => {
    setRefreshingCache(true);
    try {
      const response = await fetch("/api/admin/cache/revalidate-all", {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Failed to refresh caches");
      }
      await refetch();
      toast.success("All caches refreshed.");
    } catch {
      toast.error("Failed to refresh caches.");
    } finally {
      setRefreshingCache(false);
    }
  };

  const handleFormat = () => {
    try {
      formatConfig();
      toast.success("Config formatted.");
    } catch {
      toast.error("Fix the JSON before formatting.");
    }
  };

  const handleSave = async () => {
    try {
      await saveConfig();
      toast.success("Config saved.");
    } catch {
      toast.error("Failed to save config.");
    }
  };

  const refetch = useCallback(async () => {
    try {
      const data = await fetchConfigByBrowser(CONFIG_KEY);
      const nextText = stringifyConfig(data);
      setConfigText(nextText);
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const parseResult = useMemo(
    () => parseConfigJsonResult(configText),
    [configText],
  );

  const validationError = parseResult.ok ? null : parseResult.error;

  const formatConfig = useCallback(() => {
    setConfigText(formatConfigJson(configText));
  }, [configText]);

  const saveConfig = useCallback(async () => {
    const result = parseConfigJsonResult(configText);
    if (!result.ok) 
      throw new Error(result.error);

    setSaving(true);
    try {
      const savedValue = await setConfigByBrowser(CONFIG_KEY, result.value);
      const nextText = stringifyConfig(savedValue);
      setConfigText(nextText);
    } finally {
      setSaving(false);
    }
  }, [configText]);

  return {
    loading,
    error,
    refetch,
    configText,
    setConfigText,
    validationError,
    saving,
    formatConfig,
    saveConfig,
    handleRefreshAllCaches,
    handleFormat,
    handleSave,
    refreshingCache,
    configEditorExtensions,
  };
};
