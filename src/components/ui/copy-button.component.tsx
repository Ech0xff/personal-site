"use client";

import { Check, Copy } from "lucide-react";
import { type ButtonHTMLAttributes, useState } from "react";
import { toast } from "sonner";

import { useDictionary } from "#dictionary";
import { cn } from "#lib/shared/utils";

import Button from "./button.component";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
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
  className,
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
      className={cn("gap-1.5", className)}
      {...props}
    >
      {copied ? (
        <Check className="size-[1em]" />
      ) : (
        <Copy className="size-[1em]" />
      )}
      {copied ? copiedLabel : idleLabel}
    </Button>
  );
}
