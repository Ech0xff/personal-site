import Link from "next/link";
import { redirect } from "next/navigation";

import LanguageToggle from "#components/shared/LanguageToggle";
import ThemeToggle from "#components/shared/ThemeToggle";
import { fetchConfigByServer } from "#lib/server/services";
import { makeServerClient } from "#lib/server/supabase";
import { CONFIG_KEYS } from "#lib/shared/config";
import { getT } from "#lib/shared/i18n";
import { getLocalizedRoutes } from "#lib/shared/routes";
import { getUserStatus } from "#lib/shared/utils/tools";

import PageClient from "./page.client";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const routes = getLocalizedRoutes(locale);
  const client = await makeServerClient();
  const { isAuth } = await getUserStatus(client);
  if (isAuth) redirect(routes.DASHBOARD.ACCOUNT);

  const oauthProviders =
    (await fetchConfigByServer(CONFIG_KEYS.oauthProviders, locale)) ?? [];
  const t = getT("auth", locale);

  return (
    <div className="relative flex min-h-dvh items-center justify-center bg-(--theme-bg) p-4">
      <div className="absolute top-4 right-4 flex items-center gap-1">
        <LanguageToggle />
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-(--border-default) bg-(--surface-card) p-8 shadow-xl">
          <PageClient oauthProviders={oauthProviders} locale={locale} />
        </div>

        <p className="mt-6 text-center text-(--text-muted) text-sm">
          <Link
            href={routes.HOME}
            className="transition-colors hover:text-blue-500"
          >
            &larr; {t("backToHome")}
          </Link>
        </p>
      </div>
    </div>
  );
}
