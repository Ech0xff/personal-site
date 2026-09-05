"use client";

import { useEffect, useState } from "react";

import { JsonEditor } from "#components/ui/codemirror";
import { CONFIG_KEY, dictionaryOverrideSchema } from "#lib/shared/config";

import useConfig from "../_hooks/useConfig";
import EditorShell from "./EditorShell";

export default function DictionaryEditor() {
  const {
    override,
    locale,
    setLocale,
    loading,
    hasStoredValue,
    deleteConfig,
    saveConfig,
  } = useConfig({ key: CONFIG_KEY.DICTIONARY });
  const [content, setContent] = useState("{}");
  const [parseError, setParseError] = useState<string>();

  useEffect(() => {
    setContent(JSON.stringify(override ?? {}, null, 2));
    setParseError(undefined);
  }, [override]);

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
