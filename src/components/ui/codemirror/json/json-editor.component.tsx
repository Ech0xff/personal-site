"use client";

import { useMemo } from "react";
import { Editor, type EditorProps } from "../editor.component";
import { resolveExtensions } from "./json-editor.extension";

type Props = EditorProps;

export function JsonEditor(props: Props) {
  const editorExtensions = useMemo(() => resolveExtensions(), []);

  return <Editor {...props} extensions={editorExtensions} />;
}
