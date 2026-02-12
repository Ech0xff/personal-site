import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { checkLoggedIn } from "@/lib/shared/utils";

import { makeServerClient } from "./lib/server/supabase";

export async function proxy(request: NextRequest) {
  const response = NextResponse.next({ request });
  const pathname = request.nextUrl.pathname;

  const client = await makeServerClient();
  const isLoggedIn = await checkLoggedIn(client);
  const isDashboard = pathname.startsWith("/dashboard");
  const isAuth = pathname.startsWith("/auth");

  if (isDashboard && !isLoggedIn) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth";
    return NextResponse.redirect(url);
  }

  if (isAuth && isLoggedIn) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth"],
};
