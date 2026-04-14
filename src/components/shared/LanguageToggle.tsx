"use client";

import Cookies from "js-cookie";
import { Languages } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { getNormalizedLocale } from "@/lib/shared/i18n";
import { routing } from "@/lib/shared/i18n/routing";
import { cn } from "@/lib/shared/utils";

const localeLabelMap: Record<string, string> = {
  "en-US": "EN",
  "zh-CN": "中",
};

export default function LanguageToggle({ className }: { className?: string }) {
  const pathSegments = usePathname().split("/").filter(Boolean);
  const currentLocale = getNormalizedLocale(pathSegments[0]);

  const currentLocaleIndex = routing.locales.indexOf(currentLocale);
  const targetLocale =
    routing.locales[(currentLocaleIndex + 1) % routing.locales.length];

  const targetPath = ["", targetLocale, ...pathSegments.slice(1)].join("/");
  const label = localeLabelMap[targetLocale] || targetLocale;

  useEffect(() => {
    Cookies.set("locale", currentLocale, { expires: 365 });
  }, [currentLocale]);

  return (
    <a
      title={targetLocale}
      href={targetPath}
      aria-label={targetLocale}
      className={cn(
        "inline-flex items-center gap-1 rounded-lg p-2 transition-colors hover:bg-theme-hover",
        className,
      )}
    >
      <Languages className="h-4 w-4" />
      <span className="font-medium text-xs">{label}</span>
    </a>
  );
}
