"use client";

import { EditorView } from "@codemirror/view";
import CodeMirror from "@uiw/react-codemirror";
import {
  type ComponentPropsWithoutRef,
  type Ref,
  useImperativeHandle,
} from "react";
import { useTheme } from "#components/providers/theme";
import { cn } from "#lib/shared/utils";

interface Handle {
  clear: () => void;
}

interface Props extends Omit<ComponentPropsWithoutRef<"div">, "onChange"> {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  ref?: Ref<Handle>;
}

export default function CodeMirrorEditor({
  value,
  placeholder,
  onChange,
  className,
  ref,
}: Props) {
  const { resolvedTheme } = useTheme();

  useImperativeHandle(ref, () => ({
    clear() {
      onChange("");
    },
  }));

  return (
    <CodeMirror
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
      extensions={[EditorView.lineWrapping]}
      onChange={onChange}
      className={cn(
        "h-full min-h-0 w-full [&_.cm-editor]:outline-none!",
        className,
      )}
    />
  );
}
