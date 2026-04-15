import { type NextRequest, NextResponse } from "next/server";
import { makeAdminClient, makeServerClient } from "@/lib/server/supabase";
import { hasEmailIdentity } from "@/lib/shared/utils/tools";
import { appendToastToUrl } from "@/lib/shared/utils/url-toast";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const origin = requestUrl.origin;

  const code = requestUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.redirect(
      appendToastToUrl(`${origin}/auth`, {
        type: "error",
        code: "oauthLoginFailedTryAgain",
      }),
    );
  }

  const supabase = await makeServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(
      appendToastToUrl(`${origin}/auth`, {
        type: "error",
        code: "oauthLoginFailedTryAgain",
      }),
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !hasEmailIdentity(user)) {
    await supabase.auth.signOut();
    await makeAdminClient().auth.admin.deleteUser(user!.id);
    return NextResponse.redirect(
      appendToastToUrl(`${origin}/auth`, {
        type: "error",
        code: "oauthRequiresPrimary",
      }),
    );
  }

  return NextResponse.redirect(new URL("/dashboard/account", origin));
}
