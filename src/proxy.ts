import { NextRequest, NextResponse } from "next/server";

import { routing } from "@/lib/shared/i18n/routing";

const locales = new Set(routing.locales);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const locale = pathname.split("/").filter(Boolean)[0];

  if (!locales.has(locale)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = `/${routing.defaultLocale}${pathname}`;
    return NextResponse.redirect(redirectUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
