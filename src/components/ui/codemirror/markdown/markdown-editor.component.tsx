"use client";

import { useMemo } from "react";

import { Editor, type EditorProps } from "../editor.component";
import { resolveExtensions } from "./markdown-editor.extension";

interface Props extends EditorProps {
  mode?: "source" | "live";
}

export function MarkdownEditor({ mode = "source", ...props }: Props) {
  const editorExtensions = useMemo(() => resolveExtensions(mode), [mode]);
  return <Editor {...props} extensions={editorExtensions} />;
}
