"use client";
import { Shield, User as UserIcon } from "lucide-react";
import { useEffect, useState } from "react";

import Button from "#components/ui/button.component";
import SectionCard from "#components/ui/section-card.component";
import Stack from "#components/ui/stack.component";
import { useDictionary } from "#dictionary";
import { fetchAvailableOauthProvidersByBrowser } from "#lib/client/services";
import { type OAuthProvider, providerConfig } from "#lib/shared/config";
import { formatMessage } from "#lib/shared/dictionary/dictionary.helper";
import { formatTime } from "#lib/shared/utils/date.helper";

import DashboardShell from "../_components/layout/dashboard-shell.component";
import EditableInfoRow from "./_components/ui/editable-info-row.component";
import IdentityCard from "./_components/ui/identity-card.component";
import InfoRow from "./_components/ui/info-row.component";
import { useAccount } from "./_hooks/account.hook";

export default function AccountPage() {
  const dictionary = useDictionary();
  const [availableOauthProviders, setAvailableOauthProviders] = useState<
    OAuthProvider[]
  >([]);
  const { accountObj, loading, handleSaveNickname, handleLink, handleUnlink } =
    useAccount();

  useEffect(() => {
    let cancelled = false;

    void fetchAvailableOauthProvidersByBrowser().then((providers) => {
      if (!cancelled) {
        setAvailableOauthProviders(providers);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const TitleRender = (title: string, Icon: React.ElementType) => {
    return (
      <Stack x className="items-center gap-3">
        <Icon className="h-4 w-4" />
        <h3 className="text-base font-semibold text-text-primary">{title}</h3>
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
                <p className="text-sm text-text-muted">
                  Email / Password is your primary account and cannot be
                  removed. GitHub and Google are linked sign-in methods you can
                  add or remove from this page.
                </p>
                {accountObj.identities.map((identity) => (
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
                  <p className="mb-3 text-sm font-medium text-text-secondary">
                    Link a new provider
                  </p>
                  <Stack x className="flex-wrap gap-2">
                    {availableOauthProviders
                      .filter(
                        (provider) =>
                          !accountObj.identities.some(
                            (identity) => identity.provider === provider,
                          ),
                      )
                      .map((provider) => {
                        const config = providerConfig[provider];
                        return (
                          <Button
                            variant="secondary"
                            key={provider}
                            onClick={() => handleLink(provider)}
                            className="gap-2 transition"
                          >
                            <config.icon className="h-4 w-4" />
                            {formatMessage(dictionary.auth.linkProvider, {
                              provider: config.label,
                            })}
                          </Button>
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
