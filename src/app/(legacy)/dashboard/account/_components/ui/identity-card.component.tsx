import type { UserIdentity } from "@supabase/supabase-js";
import { assert } from "es-toolkit";
import { includes } from "es-toolkit/compat";
import { Link2Off, Loader2 } from "lucide-react";

import Button from "#components/ui/button.component";
import Stack from "#components/ui/stack.component";
import {
  IDENTITY_PROVIDER,
  type IdentityProvider,
  providerConfig,
} from "#lib/shared/config";

const supportedProviders = Object.values(IDENTITY_PROVIDER);

const assertSupportedProvider: (
  provider: string,
) => asserts provider is IdentityProvider = (provider) => {
  assert(
    includes(supportedProviders, provider),
    `Unsupported identity provider: ${provider}`,
  );
};

const isPrimaryIdentity = (identity: UserIdentity) =>
  identity.provider === IDENTITY_PROVIDER.EMAIL;

export default function IdentityCard({
  identity,
  onUnlink,
}: {
  identity: UserIdentity;
  onUnlink: (identity: UserIdentity) => void;
}) {
  const provider = identity.provider;
  assertSupportedProvider(provider);

  const config = providerConfig[provider];
  const Icon = config.icon;

  return (
    <Stack
      x
      className="items-center justify-between rounded-lg border border-border-default px-4 py-3 transition-colors"
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
            <p className="text-sm font-medium text-text-primary">
              {config.label}
            </p>
            {isPrimaryIdentity(identity) && (
              <span className="rounded-full bg-info-bg px-2 py-0.5 text-[10px] font-medium tracking-wide text-info-text uppercase">
                Primary
              </span>
            )}
          </Stack>
          <p className="text-xs text-text-muted">
            {identity.identity_data?.email ??
              identity.identity_data?.preferred_username ??
              "Connected"}
          </p>
        </Stack>
      </Stack>
      {!isPrimaryIdentity(identity) && (
        <Button
          size="sm"
          variant="danger"
          disabled={isPrimaryIdentity(identity)}
          onClick={() => onUnlink(identity)}
          className="gap-1.5 bg-transparent hover:bg-danger-bg"
        >
          {isPrimaryIdentity(identity) ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Link2Off className="h-3 w-3" />
          )}
          Unlink
        </Button>
      )}
    </Stack>
  );
}
