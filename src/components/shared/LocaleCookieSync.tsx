"use client";

import Cookies from "js-cookie";
import { useEffect } from "react";

import { useLocale } from "#i18n";
import { LOCALE_COOKIE } from "#lib/shared/i18n/i18n.const";

const COOKIE_MAX_AGE_DAYS = 365;

/**
 * Persists the locale of the current route as the visitor's preference, so the
 * proxy redirect and the auth callback can honor it on later visits.
 */
export default function LocaleCookieSync() {
  const locale = useLocale();

  useEffect(() => {
    Cookies.set(LOCALE_COOKIE, locale, {
      expires: COOKIE_MAX_AGE_DAYS,
      path: "/",
      sameSite: "lax",
    });
  }, [locale]);

  return null;
}
