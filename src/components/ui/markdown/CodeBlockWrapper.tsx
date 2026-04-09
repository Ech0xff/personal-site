"use client";

import { ComponentPropsWithoutRef } from "react";

import CopyButton from "@/components/ui/CopyButton";
import { cn } from "@/lib/shared/utils";

import styles from "./CodeBlockWrapper.module.css";

interface Props extends ComponentPropsWithoutRef<"pre"> {
  "data-raw-code"?: string;
  "data-language"?: string;
}

function CodeBlockHeader({
  language,
  rawCode,
  className,
}: {
  language: string;
  rawCode?: string;
  className: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 font-medium tracking-wide uppercase",
        className,
      )}
    >
      <span className="truncate">{language}</span>
      <CopyButton content={rawCode} className="text-xs" />
    </div>
  );
}

export default function CodeBlockWrapper({
  children,
  "data-raw-code": rawCode,
  "data-language": language = "TEXT",
  ...props
}: Props) {
  return (
    <div className="not-prose overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 text-[0.9em] dark:border-zinc-800 dark:bg-zinc-900">
      <CodeBlockHeader
        language={language}
        rawCode={rawCode}
        className="border-b border-zinc-200 bg-zinc-100/90 px-3 py-1 dark:border-zinc-800 dark:bg-zinc-800/90"
      />
      <pre {...props} className={cn("p-3", styles.codeBlock)}>
        {children}
      </pre>
    </div>
  );
}
