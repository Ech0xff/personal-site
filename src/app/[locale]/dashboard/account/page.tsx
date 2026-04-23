"use client";

import { Shield, User as UserIcon } from "lucide-react";
import { useEffect, useState } from "react";

import SectionCard from "@/components/ui/SectionCard";
import Stack from "@/components/ui/Stack";
import { useCurrentLocale } from "@/lib/client/locale";
import { fetchAvailableOauthProvidersByBrowser } from "@/lib/client/services";
import { type OAuthProvider, providerConfig } from "@/lib/shared/config/oauth";
import { getT } from "@/lib/shared/i18n";
import { formatTime } from "@/lib/shared/utils";

import DashboardShell from "../_components/ui/DashboardShell";
import EditableInfoRow from "./_components/ui/EditableInfoRow";
import IdentityCard from "./_components/ui/IdentityCard";
import InfoRow from "./_components/ui/InfoRow";
import { useAccount } from "./hooks/useAccount";

export default function AccountPage() {
  const locale = useCurrentLocale();
  const t = getT("auth", locale);
  const [availableOauthProviders, setAvailableOauthProviders] = useState<
    OAuthProvider[]
  >([]);
  const { accountObj, loading, handleSaveNickname, handleLink, handleUnlink } =
    useAccount();

  useEffect(() => {
    let cancelled = false;

    void fetchAvailableOauthProvidersByBrowser(locale).then((providers) => {
      if (!cancelled) {
        setAvailableOauthProviders(providers);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [locale]);

  const TitleRender = (title: string, Icon: React.ElementType) => {
    return (
      <Stack x className="items-center gap-3">
        <Icon className="h-4 w-4" />
        <h3 className="font-semibold text-base text-zinc-900 dark:text-zinc-100">
          {title}
        </h3>
      </Stack>
    );
  };

  return (
    <DashboardShell title="Account" error={!accountObj} loading={loading}>
      {accountObj && (
        <>
          <Stack y className="gap-6">
            <SectionCard divide={true}>
              {TitleRender("Profile", UserIcon)}
              <Stack y className="gap-2">
                <EditableInfoRow
                  label="Nickname"
                  value={accountObj.nickname}
                  onSave={handleSaveNickname}
                />
                <InfoRow label="Role" value={accountObj.role} />
                <InfoRow
                  label="Created"
                  value={
                    accountObj.createdAt
                      ? formatTime(accountObj.createdAt, "MMM D, YYYY")
                      : undefined
                  }
                />
                <InfoRow
                  label="Last Sign In"
                  value={
                    accountObj.lastSignInAt
                      ? formatTime(
                          accountObj.lastSignInAt,
                          "MMM D, YYYY h:mm A",
                        )
                      : undefined
                  }
                />
              </Stack>
            </SectionCard>

            <SectionCard divide={true}>
              {TitleRender("Connected Accounts", Shield)}
              <Stack y className="gap-4 pb-4">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Email / Password is your primary account and cannot be
                  removed. GitHub and Google are linked sign-in methods you can
                  add or remove from this page.
                </p>
                {accountObj &&
                  accountObj.identities!.map((identity) => (
                    <IdentityCard
                      key={identity.id}
                      identity={identity}
                      onUnlink={handleUnlink}
                    />
                  ))}
              </Stack>

              {/* Link new providers */}
              {availableOauthProviders.length > 0 && (
                <Stack y>
                  <p className="mb-3 font-medium text-sm text-zinc-700 dark:text-zinc-300">
                    Link a new provider
                  </p>
                  <Stack x className="flex-wrap gap-2">
                    {availableOauthProviders
                      .filter(
                        (provider) =>
                          !accountObj.identities!.some(
                            (identity) => identity.provider === provider,
                          ),
                      )
                      .map((provider) => {
                        const config = providerConfig[provider];
                        return (
                          <button
                            key={provider}
                            type="button"
                            onClick={() => handleLink(provider)}
                            className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2 font-medium text-sm text-zinc-900 transition-all hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
                          >
                            <config.icon className="h-4 w-4" />
                            {t("linkProvider", { provider: config.label })}
                          </button>
                        );
                      })}
                  </Stack>
                </Stack>
              )}
            </SectionCard>
          </Stack>
        </>
      )}
    </DashboardShell>
  );
}
