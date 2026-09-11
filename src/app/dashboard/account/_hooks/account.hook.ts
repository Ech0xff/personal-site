import type { UserIdentity } from "@supabase/supabase-js";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { makeBrowserClient } from "#lib/client/supabase.client";
import {
  appMetadataSchema,
  userMetadataSchema,
} from "#lib/shared/auth/user-metadata.schema";

export type AccountObj = {
  id: string;
  role: string;
  avatar_url: string;
  nickname: string;
  createdAt: string;
  lastSignInAt?: string;
  identities: UserIdentity[];
};

export function useAccount() {
  const supabase = useMemo(() => makeBrowserClient(), []);

  const [accountObj, setAccountObj] = useState<AccountObj>();
  const [loading, setLoading] = useState(true);

  /** Fetch account info */
  const fetchAccountObj = useCallback(async () => {
    await supabase.auth
      .getUser()
      .then(({ data: { user }, error }) => {
        if (error || !user) {
          setAccountObj(undefined);
          return;
        }
        setAccountObj({
          id: user.id,
          ...userMetadataSchema.parse(user.user_metadata),
          ...appMetadataSchema.parse(user.app_metadata),
          createdAt: user.created_at,
          lastSignInAt: user.last_sign_in_at,
          identities: user.identities ?? [],
        });
      })
      .catch(() => {
        setAccountObj(undefined);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [supabase]);

  useEffect(() => {
    void fetchAccountObj();
  }, [fetchAccountObj]);

  const handleSaveNickname = async (nextNickname: string) => {
    const toastId = toast.loading("Saving profile...");
    await supabase.auth
      .updateUser({
        data: {
          nickname: nextNickname,
        },
      })
      .then(async ({ error }) => {
        if (error) {
          toast.error("Error updating profile", { id: toastId });
        } else {
          toast.success("Profile updated successfully.", { id: toastId });
          await fetchAccountObj();
        }
      })
      .catch(() => {
        toast.error("Error updating profile", { id: toastId });
      });
  };

  const handleLink = async (provider: "github" | "google") => {
    const toastId = toast.loading(`Linking ${provider}...`);
    await supabase.auth
      .linkIdentity({
        provider,
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
        },
      })
      .then(({ data, error }) => {
        if (error) {
          toast.error(error.message, { id: toastId });
          return;
        }
        if (data.url) {
          toast.success("Redirecting to provider...", { id: toastId });
          window.location.href = data.url;
        } else {
          toast.error("Failed to start linking.", { id: toastId });
        }
      })
      .catch(() => {
        toast.error("Failed to start linking.", { id: toastId });
      });
  };

  const handleUnlink = async (identity: UserIdentity) => {
    const toastId = toast.loading("Unlinking provider...");
    await supabase.auth
      .unlinkIdentity(identity)
      .then(async ({ error }) => {
        if (error) {
          toast.error("Error unlinking provider", { id: toastId });
        } else {
          toast.success("Provider unlinked successfully.", { id: toastId });
          await fetchAccountObj();
        }
      })
      .catch(() => {
        toast.error("Error unlinking provider", { id: toastId });
      });
  };

  return {
    accountObj,
    loading,
    handleSaveNickname,
    handleLink,
    handleUnlink,
  };
}
