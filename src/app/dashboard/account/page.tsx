"use client";

import {
  Loader2,
  Shield,
  User as UserIcon
} from "lucide-react";

import { useAccount } from "./hooks/useAccount";

import HeaderSection from "../components/HeaderSection";
import IdentityCard from "./components/ui/IdentityCard";
import InfoRow from "./components/ui/InfoRow";
import SectionCard from "./components/ui/SectionCard";


export default function AccountPage() {
  const {
    accountObj,
    loading,
    handleLink,
    handleUnlink,
  } = useAccount();

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (!accountObj) {
    return (
      <div className="flex h-full items-center justify-center text-zinc-500">
        Unable to load account information.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <HeaderSection title="Account" />

      {/* Account Overview */}
      <SectionCard title="Account Information" icon={UserIcon}>
        <div className="space-y-3">
          <InfoRow label="Nickname" value={accountObj.nickname} />
          <InfoRow label="Role" value={accountObj.role} />
          <InfoRow
            label="Created"
            value={
              accountObj.createdAt
                ? new Date(accountObj.createdAt).toLocaleString()
                : undefined
            }
          />
          <InfoRow
            label="Last Sign In"
            value={
              accountObj.lastSignInAt
                ? new Date(accountObj.lastSignInAt).toLocaleString()
                : undefined
            }
          />
        </div>
      </SectionCard>

      {/* Connected Identities */}
      <SectionCard title="Connected Accounts" icon={Shield}>
        <div className="space-y-4">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Manage the login methods linked to your account. You must keep at
            least one login method active.
          </p>

          <div className="space-y-2">
            {accountObj.identities!.map((identity) => (
              <IdentityCard
                key={identity.id}
                identity={identity}
                canUnlink={identity.provider!=="email"}
                onUnlink={handleUnlink}
                unlinking={false}
              />
            ))}
          </div>

          {/* Link new providers */}
          <div className="border-t border-zinc-100 pt-4 dark:border-zinc-800">
            <p className="mb-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Link a new provider
            </p>
            <div className="flex flex-wrap gap-2">
              {!accountObj.identities!.some(identity => identity.provider === "github") && (
                <button
                  type="button"
                  onClick={() => handleLink("github")}
                  className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition-all hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
                >
                  Link GitHub
                </button>
              )}
              {!accountObj.identities!.some(identity => identity.provider === "google") && (
                <button
                  type="button"
                  onClick={() => handleLink("google")}
                  className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition-all hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
                >
                  Link Google
                </button>
              )}
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
