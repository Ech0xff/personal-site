"use client";

import * as stylex from "@stylexjs/stylex";
import { useState } from "react";

import { JsonEditor } from "#components/ui/codemirror";
import SegmentedToggle from "#components/ui/segmented-toggle.component";
import { color, font, space, shape } from "#design/tokens.stylex";
import { CONFIG_KEY } from "#lib/shared/config";
import { defaultDictionary } from "#lib/shared/dictionary/dictionary.const";
import { dictionaryOverrideSchema } from "#lib/shared/dictionary/dictionary.schema";

import useConfig from "../_hooks/config.hook";
import EditorShell from "./editor-shell.component";
const styles = stylex.create({
  icon: {
    height: "85%",
    width: "85%",
  },
  container: {
    display: "flex",
    minHeight: "0px",
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "0%",
    flexDirection: "column",
    gap: space.sm,
  },
  description: {
    fontSize: font.control,
    lineHeight: 1.5,
    color: color.muted,
  },
  container2: {
    minHeight: "0px",
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "0%",
    overflow: "hidden",
    borderTopLeftRadius: shape.control,
    borderTopRightRadius: shape.control,
    borderBottomRightRadius: shape.control,
    borderBottomLeftRadius: shape.control,
  },
  icon2: {
    height: "100%",
    minHeight: "0px",
    overflow: "auto",
  },
  description2: {
    maxHeight: "96px",
    overflow: "auto",
    fontSize: font.control,
    lineHeight: 1.5,
    color: color.dangerText,
  },
});
export default function DictionaryEditor() {
  const config = useConfig({
    key: CONFIG_KEY.DICTIONARY,
  });
  if (config.loading)
    return <EditorShell title="Dictionary" loading xstyle={styles.icon} />;
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
      xstyle={styles.icon}
      loading={config.loading}
      onSave={view === "overrides" && !parseError ? save : undefined}
      onDelete={config.hasStoredValue ? config.deleteConfig : undefined}
    >
      <div {...stylex.props(styles.container)}>
        <p {...stylex.props(styles.description)}>
          Edit only the fields you want to override. Missing fields use
          defaults; Delete restores all defaults. Keep existing placeholders
          such as {"{count}"} when needed.
        </p>
        <SegmentedToggle
          value={view}
          onChange={setView}
          options={[
            {
              value: "overrides",
              label: "Overrides",
            },
            {
              value: "defaults",
              label: "Defaults",
            },
            {
              value: "effective",
              label: "Effective",
            },
          ]}
        />
        <div {...stylex.props(styles.container2)}>
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
            xstyle={styles.icon2}
          />
        </div>
        {parseError && (
          <p role="alert" {...stylex.props(styles.description2)}>
            {parseError}
          </p>
        )}
      </div>
    </EditorShell>
  );
}
