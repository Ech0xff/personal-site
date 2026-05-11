"use client";

import { useEffect, useState } from "react";

import CodeMirrorEditor from "@/components/ui/CodeMirrorEditor";
import {
  CONFIG_KEYS,
  DEFAULT_SITE_INFO,
  resolveSiteInfoConfig,
  type SiteInfoConfig,
} from "@/lib/shared/config";
import useConfig from "../_hooks/useConfig";
import EditorShell from "./editor-shell";

const title = "Site Info";

const formatSiteInfo = (value: SiteInfoConfig) =>
  JSON.stringify(value, null, 2);

export default function SiteInfo() {
  const {
    value,
    setValue,
    setLocale,
    loading,
    hasStoredValue,
    deleteConfig,
    saveConfig,
  } = useConfig({
    key: CONFIG_KEYS.siteInfo,
  });
  const [content, setContent] = useState(formatSiteInfo(DEFAULT_SITE_INFO));
  const [parseError, setParseError] = useState(false);

  useEffect(() => {
    setContent(formatSiteInfo(value));
    setParseError(false);
  }, [value]);

  const handleChange = (nextValue: string) => {
    setContent(nextValue);
    try {
      setValue(resolveSiteInfoConfig(JSON.parse(nextValue)));
      setParseError(false);
    } catch {
      setParseError(true);
    }
  };

  return (
    <EditorShell
      className="h-[80%] w-[80%]"
      title={title}
      onLocaleChange={setLocale}
      onDelete={hasStoredValue ? deleteConfig : undefined}
      onSave={parseError ? undefined : saveConfig}
      loading={loading}
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <div className="min-h-0 flex-1 overflow-hidden rounded-lg">
          <CodeMirrorEditor
            value={content}
            onChange={handleChange}
            className="h-full min-h-0 overflow-auto"
          />
        </div>
        {parseError && (
          <p className="text-red-600 text-sm dark:text-red-400">
            Invalid JSON. Fix it before saving.
          </p>
        )}
      </div>
    </EditorShell>
  );
}
