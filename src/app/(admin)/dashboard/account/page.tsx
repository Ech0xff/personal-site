"use client";

import * as stylex from "@stylexjs/stylex";
import { Shield, User as UserIcon } from "lucide-react";
import { useEffect, useState } from "react";

import Button from "#components/ui/button.component";
import SectionCard from "#components/ui/section-card.component";
import Stack from "#components/ui/stack.component";
import { color, font, space, motionToken } from "#design/tokens.stylex";
import { useDictionary } from "#dictionary";
import { fetchAvailableOauthProvidersByBrowser } from "#lib/client/services";
import { type OAuthProvider } from "#lib/shared/config";
import { formatMessage } from "#lib/shared/dictionary/dictionary.helper";
import { formatTime } from "#lib/shared/utils/date.helper";

import { providerConfig } from "../../auth/_components/providers/provider.const";
import DashboardShell from "../_components/layout/dashboard-shell.component";
import EditableInfoRow from "./_components/ui/editable-info-row.component";
import IdentityCard from "./_components/ui/identity-card.component";
import InfoRow from "./_components/ui/info-row.component";
import { useAccount } from "./_hooks/account.hook";
const styles = stylex.create({
  row: {
    alignItems: "center",
    gap: space.sm,
  },
  icon: {
    height: space.md,
    width: space.md,
  },
  heading: {
    fontSize: font.bodySize,
    lineHeight: 1.5,
    fontWeight: font.semibold,
    color: color.text,
  },
  column: {
    gap: space.lg,
  },
  column2: {
    gap: space.xs,
  },
  column3: {
    gap: space.md,
    paddingBottom: space.md,
  },
  description: {
    fontSize: font.control,
    lineHeight: 1.5,
    color: color.muted,
  },
  description2: {
    marginBottom: space.sm,
    fontSize: font.control,
    lineHeight: 1.5,
    fontWeight: font.medium,
    color: color.secondary,
  },
  row2: {
    flexWrap: "wrap",
    gap: space.xs,
  },
  button: {
    gap: space.xs,
    transitionProperty:
      "color, background-color, border-color, opacity, box-shadow, transform, translate, scale",
    transitionDuration: motionToken.fast,
    transitionTimingFunction: "ease",
  },
});
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
      <Stack x xstyle={styles.row}>
        <Icon {...stylex.props(styles.icon)} />
        <h3 {...stylex.props(styles.heading)}>{title}</h3>
      </Stack>
    );
  };
  return (
    <DashboardShell title="Account" error={!accountObj} loading={loading}>
      {accountObj && (
        <>
          <Stack y xstyle={styles.column}>
            <SectionCard divide={true}>
              {TitleRender("Profile", UserIcon)}
              <Stack y xstyle={styles.column2}>
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
              <Stack y xstyle={styles.column3}>
                <p {...stylex.props(styles.description)}>
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
                  <p {...stylex.props(styles.description2)}>
                    Link a new provider
                  </p>
                  <Stack x xstyle={styles.row2}>
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
                            xstyle={styles.button}
                          >
                            <config.icon {...stylex.props(styles.icon)} />
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
