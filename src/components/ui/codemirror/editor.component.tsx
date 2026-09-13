"use client";

import type { Extension } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import * as stylex from "@stylexjs/stylex";
import type { ReactCodeMirrorProps } from "@uiw/react-codemirror";
import CodeMirror from "@uiw/react-codemirror";
import { useAtomValue } from "jotai";
import type { Ref } from "react";
import { useImperativeHandle, useMemo } from "react";

import type { StyleInput } from "#design/style.type";
import { resolvedThemeAtom } from "#lib/client/theme/theme.atom";

import { createEditorTheme } from "./editor-theme.extension";
const styles = stylex.create({
  codeMirror: {
    height: "100%",
    minHeight: "0px",
    width: "100%",
  },
});
export interface EditorHandle {
  clear: () => void;
}
export interface EditorProps extends Omit<
  ReactCodeMirrorProps,
  "basicSetup" | "extensions" | "onChange"
> {
  xstyle?: StyleInput;
  value: string;
  extensions?: Extension;
  onChange: (value: string) => void;
  ref?: Ref<EditorHandle>;
}
export function Editor({
  value,
  placeholder,
  extensions = [],
  onChange,
  xstyle,
  ref,
  ...props
}: EditorProps) {
  const resolvedTheme = useAtomValue(resolvedThemeAtom);
  const editorTheme = useMemo(
    () => createEditorTheme(resolvedTheme === "dark"),
    [resolvedTheme],
  );
  const editorExtensions = useMemo(
    () => [EditorView.lineWrapping, extensions],
    [extensions],
  );
  useImperativeHandle(ref, () => ({
    clear() {
      onChange("");
    },
  }));
  return (
    <CodeMirror
      {...props}
      value={value}
      placeholder={placeholder}
      height="100%"
      theme={editorTheme}
      basicSetup={{
        autocompletion: true,
        bracketMatching: true,
        closeBrackets: true,
        foldGutter: true,
        highlightActiveLine: true,
        highlightSelectionMatches: true,
        lineNumbers: true,
      }}
      extensions={editorExtensions}
      onChange={onChange}
      {...stylex.props([styles.codeMirror, xstyle])}
    />
  );
}
