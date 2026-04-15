import type { UserIdentity } from "@supabase/supabase-js";
import { Link2, Link2Off, Loader2 } from "lucide-react";
import Stack from "@/components/ui/Stack";
import { providerConfig } from "@/lib/shared/config/oauth";

const isPrimaryIdentity = (identity: UserIdentity) =>
  identity.provider === "email";

export default function IdentityCard({
  identity,
  onUnlink,
}: {
  identity: UserIdentity;
  onUnlink: (identity: UserIdentity) => void;
}) {
  const provider = identity.provider;
  const config = providerConfig[provider as keyof typeof providerConfig] ?? {
    label: provider,
    icon: Link2,
    color: "bg-zinc-500 text-white",
  };
  const Icon = config.icon;

  return (
    <Stack
      x
      className="items-center justify-between rounded-lg border border-zinc-200 px-4 py-3 transition-colors dark:border-zinc-700"
    >
      <Stack x className="items-center gap-3">
        <Stack
          x
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${config.color}`}
        >
          <Icon className="h-4 w-4" />
        </Stack>
        <Stack y>
          <Stack x className="items-center gap-2">
            <p className="font-medium text-sm text-zinc-900 dark:text-zinc-100">
              {config.label}
            </p>
            {isPrimaryIdentity(identity) && (
              <span className="rounded-full bg-blue-100 px-2 py-0.5 font-medium text-[10px] text-blue-700 uppercase tracking-wide dark:bg-blue-900/30 dark:text-blue-300">
                Primary
              </span>
            )}
          </Stack>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {identity.identity_data?.email ??
              identity.identity_data?.preferred_username ??
              "Connected"}
          </p>
        </Stack>
      </Stack>

      {!isPrimaryIdentity(identity) && (
        <button
          type="button"
          disabled={isPrimaryIdentity(identity)}
          onClick={() => onUnlink(identity)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 font-medium text-red-600 text-xs transition-all hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
        >
          {isPrimaryIdentity(identity) ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Link2Off className="h-3 w-3" />
          )}
          Unlink
        </button>
      )}
    </Stack>
  );
}
