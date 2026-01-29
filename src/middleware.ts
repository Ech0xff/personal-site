import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // only protect /dashboard routes
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    // check Cookie
    const adminSession = request.cookies.get("admin_session");

    // if no Cookie or value is incorrect, redirect to login page
    if (!adminSession || adminSession.value !== "true") {
      return NextResponse.redirect(new URL("/auth", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
