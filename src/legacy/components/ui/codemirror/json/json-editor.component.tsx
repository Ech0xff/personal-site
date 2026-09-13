"use client";

import { EditorView } from "@codemirror/view";
import { useMemo } from "react";

import { Editor, type EditorProps } from "../editor.component";
import { resolveExtensions } from "./json-editor.extension";

type Props = EditorProps;

export function JsonEditor({
  "aria-label": label = "JSON editor",
  ...props
}: Props) {
  const editorExtensions = useMemo(
    () => [
      resolveExtensions(),
      EditorView.contentAttributes.of({ "aria-label": label }),
    ],
    [label],
  );

  return <Editor {...props} extensions={editorExtensions} />;
}
