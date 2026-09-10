"use client";

import { useEffect, useState } from "react";

import { JsonEditor } from "#components/ui/codemirror";
import { CONFIG_KEY } from "#lib/shared/config";
import { dictionaryOverrideSchema } from "#lib/shared/i18n/i18n.schema";

import useConfig from "../_hooks/config.hook";
import EditorShell from "./editor-shell.component";

export default function DictionaryEditor() {
  const {
    value,
    locale,
    setLocale,
    loading,
    hasStoredValue,
    deleteConfig,
    saveConfig,
  } = useConfig({ key: CONFIG_KEY.DICTIONARY });
  const [content, setContent] = useState(() => JSON.stringify(value, null, 2));
  const [parseError, setParseError] = useState<string>();

  useEffect(() => {
    setContent(JSON.stringify(value, null, 2));
    setParseError(undefined);
  }, [value]);

  const handleSave = async () => {
    try {
      const parsed = dictionaryOverrideSchema.parse(JSON.parse(content));
      setParseError(undefined);
      await saveConfig(parsed);
    } catch (error) {
      setParseError(
        error instanceof Error ? error.message : "Invalid dictionary JSON.",
      );
    }
  };

  return (
    <EditorShell
      className="h-[85%] w-[85%]"
      title="Dictionary"
      locale={locale}
      onLocaleChange={setLocale}
      onDelete={hasStoredValue ? deleteConfig : undefined}
      onSave={parseError ? undefined : handleSave}
      loading={loading}
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <div className="min-h-0 flex-1 overflow-hidden rounded-lg">
          <JsonEditor
            value={content}
            onChange={(value) => {
              setContent(value);
              setParseError(undefined);
            }}
            className="h-full min-h-0 overflow-auto"
          />
        </div>
        {parseError ? (
          <p className="max-h-24 overflow-auto text-sm text-red-600 dark:text-red-400">
            {parseError}
          </p>
        ) : null}
      </div>
    </EditorShell>
  );
}
