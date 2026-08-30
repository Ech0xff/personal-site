import Link from "next/link";
import { redirect } from "next/navigation";

import LanguageToggle from "#components/shared/LanguageToggle";
import ThemeToggle from "#components/shared/ThemeToggle";
import { getLocale, getScopedT } from "#lib/server/i18n";
import { loadConfigsByServer } from "#lib/server/services/configs";
import { makeServerClient } from "#lib/server/supabase";
import { CONFIG_KEY } from "#lib/shared/config";
import { getLocalizedRoutes } from "#lib/shared/routes";
import { getUserStatus } from "#lib/shared/utils/tools";

import PageClient from "./page.client";

export default async function Page() {
  const locale = await getLocale();
  const routes = getLocalizedRoutes(locale);
  const client = await makeServerClient();
  const { isAuth } = await getUserStatus(client);
  if (isAuth) redirect(routes.DASHBOARD.ACCOUNT);

  const configs = await loadConfigsByServer([CONFIG_KEY.OAUTH]);
  const oauthProviders = configs[CONFIG_KEY.OAUTH];
  const t = await getScopedT((d) => d.auth);

  return (
    <div className="relative flex min-h-dvh items-center justify-center bg-(--theme-bg) p-4">
      <div className="absolute top-4 right-4 flex items-center gap-1">
        <LanguageToggle />
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-(--border-default) bg-(--surface-card) p-8 shadow-xl">
          <PageClient oauthProviders={oauthProviders} />
        </div>

        <p className="mt-6 text-center text-sm text-(--text-muted)">
          <Link
            href={routes.HOME}
            className="transition-colors hover:text-blue-500"
          >
            &larr; {t((d) => d.backToHome)}
          </Link>
        </p>
      </div>
    </div>
  );
}
