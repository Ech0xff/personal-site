import { json, jsonParseLinter } from "@codemirror/lang-json";
import { linter, lintGutter } from "@codemirror/lint";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  fetchConfigByBrowser,
  setConfigByBrowser,
} from "@/lib/client/services";
import {
  defaultSiteConfig,
  parseSiteConfig,
  SITE_CONFIG_KEY,
} from "@/lib/shared/config/site";
import { getLocaleConfigKey } from "@/lib/shared/services/configs";
import {
  formatConfigJson,
  formatConfigJsonValue,
  parseConfigJsonResult,
} from "./_components/config-json";

export type ConfigScope = "common" | "zh_CN" | "en_US";

const getConfigKey = (scope: ConfigScope) => {
  if (scope === "common") return SITE_CONFIG_KEY;
  return getLocaleConfigKey(SITE_CONFIG_KEY, scope);
};

const getDefaultConfig = (scope: ConfigScope) =>
  scope === "common" ? defaultSiteConfig : {};

export const useHooks = () => {
  const [configScope, setConfigScope] = useState<ConfigScope>("common");
  const [configText, setConfigText] = useState(
    formatConfigJsonValue(defaultSiteConfig),
  );
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
      const data =
        configScope === "common"
          ? await fetchConfigByBrowser(SITE_CONFIG_KEY)
          : await fetchConfigByBrowser(SITE_CONFIG_KEY, configScope);
      const config =
        configScope === "common"
          ? parseSiteConfig(data)
          : (data ?? getDefaultConfig(configScope));
      const nextText = formatConfigJsonValue(config);
      setConfigText(nextText);
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [configScope]);

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
    if (!result.ok) throw new Error(result.error);

    setSaving(true);
    try {
      await setConfigByBrowser(getConfigKey(configScope), result.value);
      setConfigText(formatConfigJsonValue(result.value));
    } finally {
      setSaving(false);
    }
  }, [configScope, configText]);

  return {
    loading,
    error,
    refetch,
    configScope,
    setConfigScope,
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
