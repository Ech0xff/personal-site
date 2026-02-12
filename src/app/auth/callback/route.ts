import { type NextRequest, NextResponse } from "next/server";

import { makeServerClient } from "@/lib/server/supabase";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next");

  if (code) {
    const supabase = await makeServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // If a `next` redirect was specified (e.g. from OAuth linking), go there
      if (next) {
        return NextResponse.redirect(new URL(next, requestUrl.origin));
      }

      return NextResponse.redirect(new URL("/", requestUrl.origin));
    }
  }

  return NextResponse.redirect(new URL("/auth?error=oauth", requestUrl.origin));
}
