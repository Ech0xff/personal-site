"use client";
import { combineByGroup } from "@blocknote/core";
import {
  filterSuggestionItems,
  insertOrUpdateBlockForSlashMenu,
} from "@blocknote/core/extensions";
import { en } from "@blocknote/core/locales";
import { BlockNoteView } from "@blocknote/mantine";
import {
  useCreateBlockNote,
  type DefaultReactSuggestionItem,
  SuggestionMenuController,
  SideMenuController,
  getDefaultReactSlashMenuItems,
} from "@blocknote/react";
import {
  insertColumnList,
  multiColumnDropCursor,
  locales as columnLocales,
} from "@blocknote/xl-multi-column";
import * as stylex from "@stylexjs/stylex";
import { Columns3 } from "lucide-react";
import { toast } from "sonner";

import { uploadFile } from "#lib/client/files/file-upload.service";
import { useResolvedTheme } from "#lib/client/theme/theme.hook";
import { migrateMediaRows } from "#lib/shared/content/document.helper";
import { defaultDictionary } from "#lib/shared/dictionary/dictionary.const";

import { blocknoteStyles } from "./block-editor.style";
import type { BlockEditorProps } from "./block-editor.type";
import { ColumnSideMenu } from "./column-settings.component";
import { editableCmsSchema } from "./custom-blocks.component";
import { EditorTools } from "./editor-tools.component";

import "@blocknote/mantine/style.css";
import "./block-editor.css";

export default function BlockEditor({
  initialContent,
  editable = true,
  onChange,
  onUploadChange,
}: BlockEditorProps) {
  const theme = useResolvedTheme();
  const editor = useCreateBlockNote({
    schema: editableCmsSchema,
    dropCursor: multiColumnDropCursor,
    dictionary: { ...en, multi_column: columnLocales.en },
    initialContent: initialContent.length
      ? editable
        ? migrateMediaRows(initialContent)
        : initialContent
      : undefined,
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
  const columnItems: DefaultReactSuggestionItem[] = [
    {
      title: copy.columns.insert,
      subtext: copy.columns.insertHint,
      group: "Basic blocks",
      aliases: ["columns", "two columns", "three columns", "layout"],
      icon: <Columns3 size={18} />,
      onItemClick: () => insertColumnList(editor, 2),
    },
  ];
  const linkCardItem: DefaultReactSuggestionItem = {
    title: copy.linkCard,
    subtext: copy.linkCardHint,
    group: "Media",
    aliases: ["bookmark", "url"],
    onItemClick: () => {
      insertOrUpdateBlockForSlashMenu(editor, {
        type: "linkCard",
        props: { url: "" },
      });
    },
  };
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
        slashMenu={false}
        sideMenu={false}
        filePanel={editable}
        tableHandles={editable}
      >
        {editable && (
          <>
            <SideMenuController sideMenu={ColumnSideMenu} />
            <EditorTools editor={editor} />
            <SuggestionMenuController
              triggerCharacter="/"
              getItems={async (query) =>
                filterSuggestionItems(
                  combineByGroup<DefaultReactSuggestionItem>(
                    getDefaultReactSlashMenuItems(editor),
                    columnItems,
                    [linkCardItem],
                  ),
                  query,
                )
              }
            />
          </>
        )}
      </BlockNoteView>
    </div>
  );
}

const copy = defaultDictionary.editor;
