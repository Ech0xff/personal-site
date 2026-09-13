"use client";
import { useEditorState } from "@blocknote/react";
import * as stylex from "@stylexjs/stylex";

import { webUrlSchema } from "#lib/shared/content/link-metadata.schema";
import { defaultDictionary } from "#lib/shared/dictionary/dictionary.const";

import type { CmsEditor } from "./blocknote.schema";
import { cardStyles as styles } from "./link-card.style";
export function EditorTools({ editor }: Readonly<{ editor: CmsEditor }>) {
  const { block } = useEditorState({
    editor,
    selector: () => {
      const block = editor.getTextCursorPosition().block;
      return { block };
    },
  });
  const text =
    block.type === "paragraph"
      ? block.content
          .map((part) =>
            part.type === "text"
              ? part.text
              : part.content.map((child) => child.text).join(""),
          )
          .join("")
          .trim()
      : "";
  if (!webUrlSchema.safeParse(text).success) return null;
  return (
    <div
      role="toolbar"
      aria-label="Media tools"
      {...stylex.props(styles.tools)}
    >
      {webUrlSchema.safeParse(text).success && (
        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() =>
            editor.updateBlock(block, {
              type: "linkCard",
              props: { url: text },
              content: undefined,
            })
          }
          {...stylex.props(styles.button)}
        >
          {copy.convertCard}
        </button>
      )}
    </div>
  );
}

const copy = defaultDictionary.editor;
