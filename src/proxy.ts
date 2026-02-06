import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { makeServerClient } from "./lib/supabase";

export async function proxy(request: NextRequest) {
  const response = NextResponse.next();

  // only protect /dashboard routes
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    const supabase = await makeServerClient();
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      return NextResponse.redirect(new URL("/auth", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
