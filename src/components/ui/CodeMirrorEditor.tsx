"use client";

import type { Extension } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import CodeMirror from "@uiw/react-codemirror";
import { useEffect, useMemo, useState } from "react";

import { cn } from "@/lib/shared/utils";

type Props = {
  value: string;
  extensions?: Extension[];
  onChange: (value: string) => void;
  className?: string;
  softWrap?: boolean;
};

export const resolveCodeMirrorTheme = (
  themeClassName?: string,
  prefersDark = false,
): "light" | "dark" => {
  const themeClasses = new Set(
    (themeClassName ?? "").split(/\s+/).filter(Boolean),
  );
  if (themeClasses.has("dark")) return "dark";
  if (themeClasses.has("system")) return prefersDark ? "dark" : "light";
  return "light";
};

export const getCodeMirrorClassName = (className?: string) =>
  cn(
    "h-full min-h-0 w-full overflow-hidden rounded-lg border border-zinc-200 text-sm dark:border-zinc-800 [&_.cm-editor]:h-full [&_.cm-scroller]:h-full [&_.cm-scroller]:overflow-auto",
    className,
  );

export default function CodeMirrorEditor({
  value,
  extensions,
  onChange,
  className,
  softWrap = true,
}: Props) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const resolvedExtensions = useMemo(
    () =>
      softWrap ? [EditorView.lineWrapping, ...(extensions ?? [])] : extensions,
    [extensions, softWrap],
  );

  useEffect(() => {
    const html = document.documentElement;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const syncTheme = () => {
      setTheme(resolveCodeMirrorTheme(html.className, media.matches));
    };

    syncTheme();
    const observer = new MutationObserver(syncTheme);
    observer.observe(html, { attributes: true, attributeFilter: ["class"] });

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", syncTheme);
      return () => {
        observer.disconnect();
        media.removeEventListener("change", syncTheme);
      };
    }

    media.addListener(syncTheme);
    return () => {
      observer.disconnect();
      media.removeListener(syncTheme);
    };
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
      extensions={resolvedExtensions}
      onChange={onChange}
      className={getCodeMirrorClassName(className)}
    />
  );
}
