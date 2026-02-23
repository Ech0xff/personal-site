"use client";

import { usePathname } from "next/navigation";

import { Languages } from "lucide-react";

import { getNormalizedLocale } from "@/lib/shared/i18n";
import { routing } from "@/lib/shared/i18n/routing";
import { cn } from "@/lib/shared/utils";

const localeLabelMap: Record<string, string> = {
  "en-US": "EN",
  "zh-CN": "中",
};

export default function LanguageToggle({ className }: { className?: string }) {
  const pathname = usePathname();

  const pathSegments = pathname.split("/").filter(Boolean);
  const pathLocale = pathSegments[0];

  const currentLocale = getNormalizedLocale(pathLocale);

  const currentLocaleIndex = routing.locales.indexOf(currentLocale);
  const targetLocale =
    routing.locales[(currentLocaleIndex + 1) % routing.locales.length];

  const targetPath = ["", targetLocale, ...pathSegments.slice(1)].join("/");
  const label = localeLabelMap[targetLocale] || targetLocale;

  return (
    <a
      title={targetLocale}
      href={targetPath}
      aria-label={targetLocale}
      className={cn(
        "hover:bg-theme-hover inline-flex items-center gap-1 rounded-lg p-2 transition-colors",
        className,
      )}
    >
      <Languages className="h-4 w-4" />
      <span className="text-xs font-medium">{label}</span>
    </a>
  );
}
