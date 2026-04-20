"use client";

import type { Extension } from "@codemirror/state";
import CodeMirror from "@uiw/react-codemirror";
import { useEffect, useState } from "react";

type Props = {
  value: string;
  extensions?: Extension[];
  onChange: (value: string) => void;
};

export default function CodeMirrorEditor({
  value,
  extensions,
  onChange,
}: Props) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const html = document.documentElement;
    const syncTheme = () => {
      setTheme(html.classList.contains("dark") ? "dark" : "light");
    };

    syncTheme();
    const observer = new MutationObserver(syncTheme);
    observer.observe(html, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return (
    <CodeMirror
      value={value}
      height="100%"
      theme={theme}
      basicSetup={{
        autocompletion: true,
        bracketMatching: true,
        closeBrackets: true,
        foldGutter: true,
        highlightActiveLine: true,
        highlightSelectionMatches: true,
        lineNumbers: true,
      }}
      extensions={extensions}
      onChange={onChange}
      className="flex-1 overflow-hidden rounded-lg border border-zinc-200 text-sm dark:border-zinc-800 [&_.cm-editor]:h-full [&_.cm-scroller]:overflow-auto"
    />
  );
}
