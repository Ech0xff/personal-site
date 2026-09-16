import * as stylex from "@stylexjs/stylex";
import { Eye, EyeOff, RotateCcw, Shuffle, Save, X } from "lucide-react";
import { createPortal } from "react-dom";

import { color, font, shadow, shape } from "#design/tokens.stylex";
import { defaultDictionary } from "#lib/shared/dictionary/dictionary.const";

import { DeskAction } from "../desk-action.component";
import type { useDeskEditor } from "./desk-editor.hook";

const styles = stylex.create({
  dock: {
    position: "fixed",
    bottom: "max(20px, env(safe-area-inset-bottom))",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 40,
    width: "max-content",
    maxWidth: "calc(100vw - 24px)",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: "4px",
    padding: "6px",
    borderRadius: shape.panel,
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: color.line,
    backgroundColor: color.surface,
    color: color.text,
    boxShadow: shadow.panel,
  },
  group: { display: "flex", gap: "2px", alignItems: "center" },
  notice: {
    position: "absolute",
    bottom: "calc(100% + 12px)",
    left: "50%",
    transform: "translateX(-50%)",
    width: "max-content",
    maxWidth: "min(360px, calc(100vw - 32px))",
    padding: "12px",
    borderRadius: shape.control,
    backgroundColor: color.surface,
    color: color.text,
    boxShadow: shadow.panel,
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: color.line,
    fontFamily: font.body,
    fontSize: font.small,
    lineHeight: 1.5,
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
});
const icon = { size: 18, strokeWidth: 1.6, "aria-hidden": true } as const;

export function DeskEditorToolbar({
  editor,
  reset,
  shuffle,
}: Readonly<{
  editor: ReturnType<typeof useDeskEditor>;
  reset: () => void;
  shuffle: () => void;
}>) {
  return createPortal(
    <div
      role="toolbar"
      aria-label={copy.label}
      aria-busy={editor.busy}
      {...stylex.props(styles.dock)}
    >
      <div aria-label="Desk actions" {...stylex.props(styles.group)}>
        <DeskAction
          label={copy.shuffle}
          disabled={editor.busy || editor.preview}
          onClick={shuffle}
        >
          <Shuffle {...icon} />
        </DeskAction>
        <DeskAction
          label={copy.reset}
          disabled={editor.busy || editor.preview}
          onClick={reset}
        >
          <RotateCcw {...icon} />
        </DeskAction>
        <DeskAction
          label={editor.preview ? copy.backToEditing : copy.preview}
          disabled={editor.busy}
          pressed={editor.preview}
          onClick={editor.togglePreview}
        >
          {editor.preview ? <EyeOff {...icon} /> : <Eye {...icon} />}
        </DeskAction>
        <DeskAction
          label={copy.save}
          disabled={!editor.dirty || editor.busy || editor.preview}
          onClick={() => void editor.save()}
        >
          <Save {...icon} />
        </DeskAction>
        <DeskAction
          label={copy.exit}
          disabled={editor.busy}
          onClick={editor.exit}
        >
          <X {...icon} />
        </DeskAction>
      </div>
      {(editor.notice || editor.dirty) && (
        <div {...stylex.props(styles.notice)}>
          <output>{editor.notice || copy.unsaved}</output>
        </div>
      )}
    </div>,
    document.body,
  );
}
const copy = defaultDictionary.desk.layout;
