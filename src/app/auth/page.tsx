import Link from "next/link";
import { redirect } from "next/navigation";

import ThemeToggle from "#components/shared/theme-toggle.component";
import { useDictionary } from "#dictionary";
import { loadConfigsByServer } from "#lib/server/services/configs.service";
import { makeServerClient } from "#lib/server/supabase.client";
import { getUserStatus } from "#lib/shared/auth/session.service";
import { CONFIG_KEY, type OAuthProvider } from "#lib/shared/config";
import { ROUTES } from "#lib/shared/routes/routes.const";

import AuthForm from "./_components/auth-form.component.client";

export default async function Page() {
  const client = await makeServerClient();
  const { isAuth } = await getUserStatus(client);
  if (isAuth) redirect(ROUTES.DASHBOARD.ACCOUNT);

  const configs = await loadConfigsByServer([CONFIG_KEY.OAUTH]);
  const oauthProviders = configs[CONFIG_KEY.OAUTH];

  return (
    <AuthPageContent oauthProviders={oauthProviders} homeHref={ROUTES.HOME} />
  );
}

function AuthPageContent({
  oauthProviders,
  homeHref,
}: {
  oauthProviders: OAuthProvider[];
  homeHref: string;
}) {
  const dictionary = useDictionary();

  return (
    <div className="relative flex min-h-dvh items-center justify-center bg-(--theme-bg) p-4">
      <div className="absolute top-4 right-4 flex items-center gap-1">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-(--border-default) bg-(--surface-card) p-8 shadow-xl">
          <AuthForm oauthProviders={oauthProviders} />
        </div>

        <p className="mt-6 text-center text-sm text-(--text-muted)">
          <Link
            href={homeHref}
            className="transition-colors hover:text-blue-500"
          >
            &larr; {dictionary.auth.backToHome}
          </Link>
        </p>
      </div>
    </div>
  );
}
