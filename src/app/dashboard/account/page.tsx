"use client";

import {
  Github,
  Key,
  Loader2,
  Mail,
  Shield,
  User as UserIcon,
} from "lucide-react";

import { useAccount } from "./hooks/use-account";

import HeaderSection from "../components/HeaderSection";
import IdentityCard from "./components/ui/IdentityCard";
import InfoRow from "./components/ui/InfoRow";
import SectionCard from "./components/ui/SectionCard";
import StatusBadge from "./components/ui/StatusBadge";
import SubmitButton from "./components/ui/SubmitButton";

// -- Main page ----------------------------------------------------------------

export default function AccountPage() {
  const {
    accountObj,
    loading,
    username,
    setUsername,
    hasPassword,
    linkedProviders,
    canUnlink,
    profileMsg,
    profilePending,
    handleProfileSubmit,
    passwordMsg,
    passwordPending,
    handlePasswordSubmit,
    oauthMsg,
    linkPending,
    handleLink,
    unlinkingId,
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
          <InfoRow label="UserName" value={accountObj.username} />
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
                canUnlink={canUnlink}
                onUnlink={handleUnlink}
                unlinking={unlinkingId === identity.id}
              />
            ))}
          </div>

          {/* Link new providers */}
          <div className="border-t border-zinc-100 pt-4 dark:border-zinc-800">
            <p className="mb-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Link a new provider
            </p>
            <div className="flex flex-wrap gap-2">
              {!linkedProviders.has("github") && (
                <button
                  type="button"
                  disabled={linkPending}
                  onClick={() => handleLink("github")}
                  className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition-all hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
                >
                  {linkPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Github className="h-4 w-4" />
                  )}
                  Link GitHub
                </button>
              )}
              {!linkedProviders.has("google") && (
                <button
                  type="button"
                  disabled={linkPending}
                  onClick={() => handleLink("google")}
                  className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition-all hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
                >
                  {linkPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Mail className="h-4 w-4" />
                  )}
                  Link Google
                </button>
              )}
              {linkedProviders.has("github") &&
                linkedProviders.has("google") && (
                  <p className="text-sm text-zinc-400 dark:text-zinc-500">
                    All supported providers are linked.
                  </p>
                )}
            </div>
          </div>

          {oauthMsg && (
            <StatusBadge type={oauthMsg.type} message={oauthMsg.text} />
          )}
        </div>
      </SectionCard>

      {/* Change Password */}
      <SectionCard title="Change Password" icon={Key}>
        <form action={handlePasswordSubmit} className="space-y-4">
          {hasPassword && (
            <div>
              <label
                htmlFor="currentPassword"
                className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Current Password
              </label>
              <input
                id="currentPassword"
                name="currentPassword"
                type="password"
                placeholder="Enter current password"
                className="w-full max-w-md rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="newPassword"
              className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              New Password
            </label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              placeholder="At least 6 characters"
              className="w-full max-w-md rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
              required
              minLength={6}
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Re-enter new password"
              className="w-full max-w-md rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
              required
              minLength={6}
            />
          </div>

          {!hasPassword && (
            <p className="text-sm text-amber-600 dark:text-amber-400">
              You signed up via OAuth. Setting a password will allow you to also
              log in with email + password.
            </p>
          )}

          {passwordMsg && (
            <StatusBadge type={passwordMsg.type} message={passwordMsg.text} />
          )}

          <SubmitButton pending={passwordPending} label="Update Password" />
        </form>
      </SectionCard>
    </div>
  );
}
