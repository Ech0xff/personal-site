"use client";

import { useEffect, useState } from "react";

import { JsonEditor } from "#components/ui/codemirror";
import { CONFIG_KEYS } from "#lib/shared/config";
import useConfig from "../_hooks/useConfig";
import EditorShell from "./EditorShell";

const title = "Site Info";

export default function SiteInfo() {
  const {
    value,
    setLocale,
    loading,
    hasStoredValue,
    deleteConfig,
    saveConfig,
  } = useConfig({
    key: CONFIG_KEYS.siteInfo,
  });
  const [content, setContent] = useState(JSON.stringify(value, null, 2));
  const [parseError, setParseError] = useState(false);

  useEffect(() => {
    setContent(JSON.stringify(value, null, 2));
    setParseError(false);
  }, [value]);

  const handSave = () => {
    try {
      const parsed = JSON.parse(content);
      return saveConfig(parsed);
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
      onSave={parseError ? undefined : handSave}
      loading={loading}
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <div className="min-h-0 flex-1 overflow-hidden rounded-lg">
          <JsonEditor
            value={content}
            onChange={setContent}
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
