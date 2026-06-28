"use client";

import type { Extension } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import type { ReactCodeMirrorProps } from "@uiw/react-codemirror";
import CodeMirror from "@uiw/react-codemirror";
import type { Ref } from "react";
import { useImperativeHandle, useMemo } from "react";
import { useTheme } from "#components/providers/theme";
import { cn } from "#lib/shared/utils";

export interface EditorHandle {
  clear: () => void;
}

export interface EditorProps
  extends Omit<ReactCodeMirrorProps, "basicSetup" | "extensions" | "onChange"> {
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
  className,
  ref,
  ...props
}: EditorProps) {
  const { resolvedTheme } = useTheme();

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
      theme={resolvedTheme}
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
      className={cn(
        "h-full min-h-0 w-full [&_.cm-editor]:outline-none!",
        className,
      )}
    />
  );
}
