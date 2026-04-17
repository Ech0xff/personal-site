"use client";

import { useParams, usePathname } from "next/navigation";

import { getLocaleFromPathname, normalizeLocale } from "@/lib/shared/i18n";

export const useCurrentLocale = () => {
  const params = useParams<{ locale?: string }>();
  const pathname = usePathname();
  const localeFromParams =
    typeof params.locale === "string" ? params.locale : undefined;

  if (localeFromParams) return normalizeLocale(localeFromParams);

  return normalizeLocale(getLocaleFromPathname(pathname));
};
