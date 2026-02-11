"use client";

import { useEffect, useState, useTransition } from "react";

import {
  AlertTriangle,
  Check,
  Github,
  Key,
  Link2,
  Link2Off,
  Loader2,
  Mail,
  Shield,
  User as UserIcon,
} from "lucide-react";

import {
  getAccountInfo,
  unlinkOAuthProvider,
  updatePassword,
  updateProfile,
} from "@/actions";
import { makeBrowserClient } from "@/lib/supabase/make-browser-client";

import HeaderSection from "../components/HeaderSection";

type AccountInfo = Awaited<ReturnType<typeof getAccountInfo>>;
type Identity = NonNullable<AccountInfo>["identities"][number];

// -- Reusable UI primitives --------------------------------------------------

function SectionCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center gap-3 border-b border-zinc-100 px-6 py-4 dark:border-zinc-800">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/20">
          <Icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
          {title}
        </h3>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  mono,
}: {
  label: string;
  value?: string | null;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
      <span className="w-36 shrink-0 text-sm font-medium text-zinc-500 dark:text-zinc-400">
        {label}
      </span>
      <span
        className={`text-sm text-zinc-900 dark:text-zinc-100 ${mono ? "font-mono text-xs" : ""}`}
      >
        {value || "—"}
      </span>
    </div>
  );
}

function StatusBadge({
  type,
  message,
}: {
  type: "success" | "error";
  message: string;
}) {
  const styles =
    type === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400"
      : "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400";
  const Icon = type === "success" ? Check : AlertTriangle;

  return (
    <div
      className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${styles}`}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {message}
    </div>
  );
}

function SubmitButton({ pending, label }: { pending: boolean; label: string }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      {label}
    </button>
  );
}

// -- Provider identity card ---------------------------------------------------

const providerConfig: Record<
  string,
  { label: string; icon: React.ElementType; color: string }
> = {
  github: {
    label: "GitHub",
    icon: Github,
    color: "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900",
  },
  google: {
    label: "Google",
    icon: Mail,
    color: "bg-red-500 text-white",
  },
  email: {
    label: "Email / Password",
    icon: Mail,
    color: "bg-blue-500 text-white",
  },
};

function IdentityCard({
  identity,
  canUnlink,
  onUnlink,
  unlinking,
}: {
  identity: Identity;
  canUnlink: boolean;
  onUnlink: (id: string) => void;
  unlinking: boolean;
}) {
  const provider = identity.provider;
  const config = providerConfig[provider] ?? {
    label: provider,
    icon: Link2,
    color: "bg-zinc-500 text-white",
  };
  const Icon = config.icon;

  return (
    <div className="flex items-center justify-between rounded-lg border border-zinc-200 px-4 py-3 transition-colors dark:border-zinc-700">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${config.color}`}
        >
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {config.label}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {identity.identity_data?.email ??
              identity.identity_data?.preferred_username ??
              "Connected"}
          </p>
        </div>
      </div>

      {provider !== "email" && (
        <button
          type="button"
          disabled={!canUnlink || unlinking}
          onClick={() => onUnlink(identity.id)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition-all hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
        >
          {unlinking ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Link2Off className="h-3 w-3" />
          )}
          Unlink
        </button>
      )}
    </div>
  );
}

// -- Main page ----------------------------------------------------------------

export default function AccountPage() {
  const [info, setInfo] = useState<AccountInfo>(null);
  const [loading, setLoading] = useState(true);

  // Profile form
  const [username, setUsername] = useState("");
  const [profileMsg, setProfileMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [profilePending, startProfileTransition] = useTransition();

  // Password form
  const [passwordMsg, setPasswordMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [passwordPending, startPasswordTransition] = useTransition();

  // OAuth
  const [oauthMsg, setOauthMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [unlinkingId, setUnlinkingId] = useState<string | null>(null);
  const [linkPending, startLinkTransition] = useTransition();

  const fetchInfo = async () => {
    const data = await getAccountInfo();
    setInfo(data);
    setUsername(data?.profile?.username ?? "");
    setLoading(false);
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (!info) {
    return (
      <div className="flex h-full items-center justify-center text-zinc-500">
        Unable to load account information.
      </div>
    );
  }

  const hasPassword = info.identities.some((i) => i.provider === "email");
  const linkedProviders = new Set(info.identities.map((i) => i.provider));
  const canUnlink = info.identities.length > 1;

  // -- Handlers ---------------------------------------------------------------

  const handleProfileSubmit = (formData: FormData) => {
    setProfileMsg(null);
    startProfileTransition(async () => {
      const result = await updateProfile(formData);
      if (result.error) {
        setProfileMsg({ type: "error", text: result.error });
      } else {
        setProfileMsg({ type: "success", text: result.success! });
        fetchInfo();
      }
    });
  };

  const handlePasswordSubmit = (formData: FormData) => {
    setPasswordMsg(null);
    startPasswordTransition(async () => {
      const result = await updatePassword(formData);
      if (result.error) {
        setPasswordMsg({ type: "error", text: result.error });
      } else {
        setPasswordMsg({ type: "success", text: result.success! });
      }
    });
  };

  const handleLink = (provider: "github" | "google") => {
    setOauthMsg(null);
    startLinkTransition(async () => {
      try {
        const supabase = makeBrowserClient();
        const { data, error } = await supabase.auth.linkIdentity({
          provider,
          options: {
            redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
          },
        });
        if (error) {
          setOauthMsg({ type: "error", text: error.message });
          return;
        }
        if (data.url) {
          window.location.href = data.url;
        }
      } catch {
        setOauthMsg({ type: "error", text: `Failed to link ${provider}.` });
      }
    });
  };

  const handleUnlink = async (identityId: string) => {
    setOauthMsg(null);
    setUnlinkingId(identityId);
    const result = await unlinkOAuthProvider(identityId);
    if (result.error) {
      setOauthMsg({ type: "error", text: result.error });
    } else {
      setOauthMsg({ type: "success", text: result.success! });
      fetchInfo();
    }
    setUnlinkingId(null);
  };

  return (
    <div className="space-y-8">
      <HeaderSection title="Account" />

      {/* Account Overview */}
      <SectionCard title="Account Information" icon={UserIcon}>
        <div className="space-y-3">
          <InfoRow label="User ID" value={info.id} mono />
          <InfoRow label="Email" value={info.email} />
          <InfoRow label="Role" value={info.profile?.role ?? "user"} />
          <InfoRow
            label="Created"
            value={
              info.createdAt
                ? new Date(info.createdAt).toLocaleString()
                : undefined
            }
          />
          <InfoRow
            label="Last Sign In"
            value={
              info.lastSignInAt
                ? new Date(info.lastSignInAt).toLocaleString()
                : undefined
            }
          />
        </div>
      </SectionCard>

      {/* Profile */}
      <SectionCard title="Profile" icon={UserIcon}>
        <form action={handleProfileSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Set a username"
              className="w-full max-w-md rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
            />
          </div>
          {profileMsg && (
            <StatusBadge type={profileMsg.type} message={profileMsg.text} />
          )}
          <SubmitButton pending={profilePending} label="Save Profile" />
        </form>
      </SectionCard>

      {/* Connected Identities */}
      <SectionCard title="Connected Accounts" icon={Shield}>
        <div className="space-y-4">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Manage the login methods linked to your account. You must keep at
            least one login method active.
          </p>

          <div className="space-y-2">
            {info.identities.map((identity) => (
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
