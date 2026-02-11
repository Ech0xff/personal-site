import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { makeServerClient } from "@/lib/server/supabase";

export async function proxy(request: NextRequest) {
  const response = NextResponse.next({ request });

  const supabase = await makeServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isDashboard = request.nextUrl.pathname.startsWith("/dashboard");
  const isAuth = request.nextUrl.pathname.startsWith("/auth");

  if (isDashboard && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth";
    return NextResponse.redirect(url);
  }

  if (isAuth && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth"],
};
