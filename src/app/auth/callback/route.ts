import { type NextRequest, NextResponse } from "next/server";

import { makeServerClient } from "@/lib/supabase";

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

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (profile?.role === "admin") {
          return NextResponse.redirect(
            new URL("/dashboard", requestUrl.origin),
          );
        }
      }

      return NextResponse.redirect(new URL("/", requestUrl.origin));
    }
  }

  return NextResponse.redirect(new URL("/auth?error=oauth", requestUrl.origin));
}
