import { type NextRequest, NextResponse } from "next/server";

import {
  getLocaleFromPathname,
  getPreferredLocale,
  localizeHref,
} from "@/lib/shared/i18n";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const locale = getLocaleFromPathname(pathname);

  if (!locale) {
    const redirectUrl = request.nextUrl.clone();
    const redirectLocale = getPreferredLocale(
      request.cookies.get("locale")?.value,
    );

    redirectUrl.pathname = localizeHref(redirectLocale, pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
