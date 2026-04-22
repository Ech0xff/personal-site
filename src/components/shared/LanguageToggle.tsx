"use client";

import Cookies from "js-cookie";
import { Languages } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { useCurrentLocale } from "@/lib/client/locale";
import { routing, switchLocaleInPathname } from "@/lib/shared/i18n";
import { cn } from "@/lib/shared/utils";

const localeLabelMap: Record<string, string> = {
  "en-US": "EN",
  "zh-CN": "中",
};

export default function LanguageToggle({ className }: { className?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentLocale = useCurrentLocale();
  const currentLocaleIndex = routing.locales.indexOf(currentLocale);
  const targetLocale =
    routing.locales[(currentLocaleIndex + 1) % routing.locales.length];
  const search = searchParams.toString();
  const currentHref = search ? `${pathname}?${search}` : pathname;
  const targetPath = switchLocaleInPathname(currentHref, targetLocale);
  const label = localeLabelMap[targetLocale] || targetLocale;

  useEffect(() => {
    Cookies.set("locale", currentLocale, { expires: 365 });
  }, [currentLocale]);

  return (
    <button
      type="button"
      title={targetLocale}
      aria-label={targetLocale}
      onClick={() => router.push(targetPath)}
      className={cn(
        "inline-flex cursor-pointer items-center gap-1 rounded-full p-2 text-zinc-500 transition-all hover:bg-theme-hover hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100",
        className,
      )}
    >
      <Languages className="h-4 w-4" />
      <span className="font-medium text-xs">{label}</span>
    </button>
  );
}
