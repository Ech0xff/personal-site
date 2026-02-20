"use client";

import { Shield, User as UserIcon } from "lucide-react";

import SectionCard from "@/components/ui/SectionCard";
import StackX from "@/components/ui/StackX";
import StackY from "@/components/ui/StackY";
import { formatTime } from "@/lib/shared/utils";

import DashboardShell from "../components/ui/DashboardShell";
import EditableInfoRow from "./components/ui/EditableInfoRow";
import IdentityCard from "./components/ui/IdentityCard";
import InfoRow from "./components/ui/InfoRow";
import { useAccount } from "./hooks/useAccount";

export default function AccountPage() {
  const { accountObj, loading, handleSaveNickname, handleLink, handleUnlink } =
    useAccount();

  const TitleRender = (title: string, Icon: React.ElementType) => {
    return (
      <StackX className="items-center gap-3">
        <Icon className="h-4 w-4" />
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
          {title}
        </h3>
      </StackX>
    );
  };

  return (
    <DashboardShell title="Account" error={!accountObj} loading={loading}>
      {accountObj && (
        <>
          <StackY className="gap-6">
            <SectionCard divided={true}>
              {TitleRender("Profile", UserIcon)}
              <StackY className="gap-2">
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
              </StackY>
            </SectionCard>

            <SectionCard divided={true}>
              {TitleRender("Connected Accounts", Shield)}
              <StackY className="gap-4 pb-4">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Manage the login methods linked to your account. You must keep
                  at least one login method active.
                </p>
                {accountObj &&
                  accountObj.identities!.map((identity) => (
                    <IdentityCard
                      key={identity.id}
                      identity={identity}
                      canUnlink={identity.provider !== "email"}
                      onUnlink={handleUnlink}
                      unlinking={false}
                    />
                  ))}
              </StackY>

              {/* Link new providers */}
              <StackY>
                <p className="mb-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Link a new provider
                </p>
                <StackX className="gap-2">
                  {!accountObj.identities!.some(
                    (identity) => identity.provider === "github",
                  ) && (
                    <button
                      type="button"
                      onClick={() => handleLink("github")}
                      className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition-all hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
                    >
                      Link GitHub
                    </button>
                  )}
                  {!accountObj.identities!.some(
                    (identity) => identity.provider === "google",
                  ) && (
                    <button
                      type="button"
                      onClick={() => handleLink("google")}
                      className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition-all hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
                    >
                      Link Google
                    </button>
                  )}
                </StackX>
              </StackY>
            </SectionCard>
          </StackY>
        </>
      )}
    </DashboardShell>
  );
}
