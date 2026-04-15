import { type NextRequest, NextResponse } from "next/server";
import { makeAdminClient, makeServerClient } from "@/lib/server/supabase";
import { hasEmailIdentity } from "@/lib/shared/utils/tools";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  try {
    if (!code) throw new Error("oauth");

    const supabase = await makeServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) throw new Error("oauth");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !hasEmailIdentity(user)) {
      await makeAdminClient().auth.admin.deleteUser(user!.id);
      throw new Error("oauth_requires_primary");
    }

    return NextResponse.redirect(
      new URL("/dashboard/account", requestUrl.origin),
    );
  } catch (error: unknown) {
    return NextResponse.redirect(
      new URL(
        `/auth?error=${error instanceof Error ? error.message : "An unknown error occurred"}`,
        requestUrl.origin,
      ),
    );
  }
}
