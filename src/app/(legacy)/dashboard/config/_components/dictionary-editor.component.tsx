"use client";

import { useState } from "react";

import { JsonEditor } from "#components/ui/codemirror";
import SegmentedToggle from "#components/ui/segmented-toggle.component";
import { CONFIG_KEY } from "#lib/shared/config";
import { defaultDictionary } from "#lib/shared/dictionary/dictionary.const";
import { dictionaryOverrideSchema } from "#lib/shared/dictionary/dictionary.schema";

import useConfig from "../_hooks/config.hook";
import EditorShell from "./editor-shell.component";

export default function DictionaryEditor() {
  const config = useConfig({ key: CONFIG_KEY.DICTIONARY });
  if (config.loading)
    return (
      <EditorShell title="Dictionary" loading className="h-[85%] w-[85%]" />
    );
  return <DictionaryForm config={config} />;
}

function DictionaryForm({
  config,
}: {
  config: ReturnType<typeof useConfig<typeof CONFIG_KEY.DICTIONARY>>;
}) {
  const [content, setContent] = useState(() =>
    JSON.stringify(config.override ?? {}, null, 2),
  );
  const [view, setView] = useState<"overrides" | "defaults" | "effective">(
    "overrides",
  );
  const [parseError, setParseError] = useState<string>();

  const save = async () => {
    try {
      const override = dictionaryOverrideSchema.parse(JSON.parse(content));
      setParseError(undefined);
      await config.saveConfig(override);
    } catch (error) {
      setParseError(
        error instanceof Error ? error.message : "Invalid dictionary JSON.",
      );
    }
  };

  return (
    <EditorShell
      title="Dictionary"
      className="h-[85%] w-[85%]"
      loading={config.loading}
      onSave={view === "overrides" && !parseError ? save : undefined}
      onDelete={config.hasStoredValue ? config.deleteConfig : undefined}
    >
      <div className="flex min-h-0 flex-1 flex-col gap-3">
        <p className="text-sm text-text-muted">
          Edit only the fields you want to override. Missing fields use
          defaults; Delete restores all defaults. Keep existing placeholders
          such as {"{count}"} when needed.
        </p>
        <SegmentedToggle
          value={view}
          onChange={setView}
          options={[
            { value: "overrides", label: "Overrides" },
            { value: "defaults", label: "Defaults" },
            { value: "effective", label: "Effective" },
          ]}
        />
        <div className="min-h-0 flex-1 overflow-hidden rounded-lg">
          <JsonEditor
            aria-label={`Dictionary ${view}`}
            value={
              view === "overrides"
                ? content
                : JSON.stringify(
                    view === "defaults" ? defaultDictionary : config.value,
                    null,
                    2,
                  )
            }
            readOnly={view !== "overrides"}
            onChange={(value) => {
              if (view !== "overrides") return;
              setContent(value);
              setParseError(undefined);
            }}
            className="h-full min-h-0 overflow-auto"
          />
        </div>
        {parseError && (
          <p
            role="alert"
            className="max-h-24 overflow-auto text-sm text-danger-text"
          >
            {parseError}
          </p>
        )}
      </div>
    </EditorShell>
  );
}
