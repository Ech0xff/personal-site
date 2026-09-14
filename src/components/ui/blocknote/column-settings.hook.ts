import { SideMenuExtension } from "@blocknote/core/extensions";
import {
  useEditorState,
  useExtension,
  useExtensionState,
} from "@blocknote/react";
import { useEffect, useState } from "react";

import {
  resizeColumnCount,
  setColumnPercentage,
} from "#lib/shared/content/column-layout.helper";
import {
  columnLayoutSchema,
  type ColumnLayout,
} from "#lib/shared/content/column-layout.schema";

import type { CmsEditor } from "./blocknote.schema";

export function findColumnList(editor: CmsEditor, id: string) {
  let block = editor.getBlock(id);
  while (block) {
    if (block.type === "columnList") return block;
    block = editor.getParentBlock(block);
  }
  return undefined;
}

export function useColumnSettings(editor: CmsEditor) {
  const sideMenu = useExtension(SideMenuExtension);
  const hoveredId = useExtensionState(SideMenuExtension, {
    selector: (state) => state?.block.id,
  });
  const [activeId, setActiveId] = useState<string>();
  const id = activeId ?? hoveredId;
  const row = useEditorState({
    editor,
    selector: () => (id ? findColumnList(editor, id) : undefined),
  });

  useEffect(() => {
    if (!activeId) return;
    const dismiss = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopPropagation();
      setActiveId(undefined);
      sideMenu.unfreezeMenu();
      editor.focus();
    };
    document.addEventListener("keydown", dismiss, true);
    return () => document.removeEventListener("keydown", dismiss, true);
  }, [activeId, editor, sideMenu]);

  const setOpen = (open: boolean) => {
    if (open && row) {
      setActiveId(row.id);
      sideMenu.freezeMenu();
    } else {
      setActiveId(undefined);
      sideMenu.unfreezeMenu();
    }
  };
  const updateLayout = (patch: Partial<ColumnLayout>) => {
    if (row)
      editor.updateBlock(row.id, {
        props: columnLayoutSchema.parse({ ...row.props, ...patch }),
      });
  };
  const setCount = (count: number) => {
    if (row)
      editor.updateBlock(row.id, {
        children: resizeColumnCount(row.children, count),
      });
  };
  const setWidth = (index: number, percentage: number) => {
    if (row)
      editor.updateBlock(row.id, {
        children: setColumnPercentage(row.children, index, percentage),
      });
  };
  const equalize = () => {
    if (row)
      editor.updateBlock(row.id, {
        children: row.children.map((column) =>
          column.type === "column"
            ? { ...column, props: { ...column.props, width: 1 } }
            : column,
        ),
      });
  };
  return {
    freeze: () => sideMenu.freezeMenu(),
    unfreeze: () => {
      if (!activeId) sideMenu.unfreezeMenu();
    },
    row,
    open: Boolean(activeId && row),
    setOpen,
    updateLayout,
    setCount,
    setWidth,
    equalize,
  };
}
