"use client";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import * as stylex from "@stylexjs/stylex";
import { useAtomValue } from "jotai";
import { toast } from "sonner";

import { uploadFile } from "#lib/client/files/file-upload.service";
import { resolvedThemeAtom } from "#lib/client/theme/theme.atom";

import { blocknoteStyles } from "./block-editor.style";
import type { BlockEditorProps } from "./block-editor.type";

import "@blocknote/mantine/style.css";
import "./block-editor.css";

export default function BlockEditor({
  initialContent,
  editable = true,
  onChange,
  onUploadChange,
}: BlockEditorProps) {
  const theme = useAtomValue(resolvedThemeAtom);
  const editor = useCreateBlockNote({
    initialContent: initialContent.length ? initialContent : undefined,
    uploadFile: async (file) => {
      onUploadChange?.(1);
      try {
        return await uploadFile(file);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Upload failed.");
        throw error;
      } finally {
        onUploadChange?.(-1);
      }
    },
  });
  return (
    <div
      data-cms-blocknote
      data-readonly={!editable || undefined}
      {...stylex.props(
        blocknoteStyles.root,
        !editable && blocknoteStyles.readonly,
      )}
    >
      <BlockNoteView
        editor={editor}
        theme={theme}
        editable={editable}
        onChange={editable ? () => onChange?.(editor.document) : undefined}
        formattingToolbar={editable}
        linkToolbar={editable}
        slashMenu={editable}
        sideMenu={editable}
        filePanel={editable}
        tableHandles={editable}
      />
    </div>
  );
}
