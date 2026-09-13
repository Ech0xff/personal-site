"use client";

import * as stylex from "@stylexjs/stylex";
import { Check, Copy } from "lucide-react";
import { type ButtonHTMLAttributes, useState } from "react";
import { toast } from "sonner";

import type { StyleInput } from "#design/style.type";
import { useDictionary } from "#dictionary";

import Button from "./button.component";
const styles = stylex.create({
  button: {
    gap: "6px",
  },
  check: {
    width: "1em",
    height: "1em",
  },
});
interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  xstyle?: StyleInput;
  content?: string;
  idleLabel?: string;
  copiedLabel?: string;
  emptyMessage?: string;
  successMessage?: string;
  errorMessage?: string;
}
export default function CopyButton({
  content,
  idleLabel: customIdleLabel,
  copiedLabel: customCopiedLabel,
  emptyMessage: customEmptyMessage,
  successMessage,
  errorMessage: customErrorMessage,
  xstyle,
  ...props
}: Props) {
  const dictionary = useDictionary();
  const idleLabel = customIdleLabel ?? dictionary.common.copy;
  const copiedLabel = customCopiedLabel ?? dictionary.common.copied;
  const emptyMessage = customEmptyMessage ?? dictionary.common.nothingToCopy;
  const errorMessage = customErrorMessage ?? dictionary.common.copyFailed;
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    if (!content) {
      toast.error(emptyMessage);
      return;
    }
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      if (successMessage) toast.success(successMessage);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(errorMessage);
    }
  };
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleCopy}
      title={idleLabel}
      aria-label={idleLabel}
      xstyle={[styles.button, xstyle]}
      {...props}
    >
      {copied ? (
        <Check {...stylex.props(styles.check)} />
      ) : (
        <Copy {...stylex.props(styles.check)} />
      )}
      {copied ? copiedLabel : idleLabel}
    </Button>
  );
}
