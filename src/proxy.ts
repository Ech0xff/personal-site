import { type NextRequest, NextResponse } from "next/server";

import { routing } from "@/lib/shared/i18n/routing";

const locales = new Set(routing.locales);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const locale = pathname.split("/").filter(Boolean)[0];

  if (!locales.has(locale)) {
    const cookieLocale = request.cookies.get("locale")?.value;
    const redirectLocale =
      cookieLocale && locales.has(cookieLocale)
        ? cookieLocale
        : routing.defaultLocale;
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = `/${redirectLocale}${pathname}`;
    return NextResponse.redirect(redirectUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
