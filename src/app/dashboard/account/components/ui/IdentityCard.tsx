import { Github, Link2, Link2Off, Loader2, Mail } from "lucide-react";

import { UserIdentity } from "@supabase/supabase-js";

// ---------------------------------------------------------------------------
// Provider config
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function IdentityCard({
  identity,
  canUnlink,
  onUnlink,
  unlinking,
}: {
  identity: UserIdentity;
  canUnlink: boolean;
  onUnlink: (identity: UserIdentity) => void;
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
          onClick={() => onUnlink(identity)}
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
