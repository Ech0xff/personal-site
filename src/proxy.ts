import { type NextRequest, NextResponse } from "next/server";

import {
  getLocaleFromPathname,
  LOCALE_COOKIE,
  localizeHref,
  normalizeLocale,
} from "#lib/shared/i18n";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const locale = getLocaleFromPathname(pathname);

  if (!locale) {
    const redirectUrl = request.nextUrl.clone();
    const preferredLocale = normalizeLocale(
      request.cookies.get(LOCALE_COOKIE)?.value,
    );

    redirectUrl.pathname = localizeHref(preferredLocale, pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
