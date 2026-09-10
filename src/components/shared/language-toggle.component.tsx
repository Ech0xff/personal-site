"use client";

import { Languages } from "lucide-react";
import { useRouter } from "next/navigation";

import { useLocale } from "#i18n";
import {
  getNextLocale,
  localeLabels,
  switchLocaleHref,
} from "#lib/shared/i18n";
import { cn } from "#lib/shared/utils";

export default function LanguageToggle({ className }: { className?: string }) {
  const router = useRouter();
  const currentLocale = useLocale();
  const targetLocale = getNextLocale(currentLocale);

  const switchLocale = () => {
    const { pathname, search, hash } = window.location;
    router.push(
      switchLocaleHref(
        currentLocale,
        targetLocale,
        `${pathname}${search}${hash}`,
      ),
    );
  };

  return (
    <button
      type="button"
      title={targetLocale}
      aria-label={targetLocale}
      onClick={switchLocale}
      className={cn(
        "inline-flex cursor-pointer items-center gap-1 rounded-full p-2 text-(--text-muted) transition-all hover:bg-(--surface-hover) hover:text-(--text-primary)",
        className,
      )}
    >
      <Languages className="h-4 w-4" />
      <span className="text-xs font-medium">{localeLabels[targetLocale]}</span>
    </button>
  );
}
