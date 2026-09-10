import { type NextRequest, NextResponse } from "next/server";

import { makeAdminClient, makeServerClient } from "#lib/server/supabase.client";
import { hasEmailIdentity } from "#lib/shared/auth/account.helper";
import { LOCALE_COOKIE, normalizeLocale } from "#lib/shared/i18n";
import { getLocalizedRoutes } from "#lib/shared/routes/routes.helper";
import { appendToastToUrl } from "#lib/shared/utils/url-toast.helper";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const origin = requestUrl.origin;
  const locale = normalizeLocale(request.cookies.get(LOCALE_COOKIE)?.value);
  const routes = getLocalizedRoutes(locale);
  const authUrl = new URL(routes.AUTH, origin).toString();

  const code = requestUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.redirect(
      appendToastToUrl(authUrl, {
        type: "error",
        code: "oauthLoginFailedTryAgain",
      }),
    );
  }

  const supabase = await makeServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(
      appendToastToUrl(authUrl, {
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
      appendToastToUrl(authUrl, {
        type: "error",
        code: "oauthRequiresPrimary",
      }),
    );
  }

  return NextResponse.redirect(new URL(routes.DASHBOARD.ACCOUNT, origin));
}
