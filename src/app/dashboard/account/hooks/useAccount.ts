import { useCallback, useEffect, useMemo, useState } from "react";

import { UserIdentity } from "@supabase/supabase-js";
import { toast } from "sonner";

import { makeBrowserClient } from "@/lib/client/supabase";

export type AccountObj = {
  id: string;
  role: string;
  avatar_url: string;
  nickname: string;
  createdAt: string;
  lastSignInAt?: string;
  identities?: UserIdentity[];
};

export function useAccount() {
  const supabase = useMemo(() => makeBrowserClient(), []);

  const [accountObj, setAccountObj] = useState<AccountObj>();
  const [loading, setLoading] = useState(true);

  /** Fetch account info */
  const fetchAccountObj = useCallback(async () => {
    supabase.auth
      .getUser()
      .then(({ data: { user }, error }) => {
        if (error || !user) {
          setAccountObj(undefined);
          return;
        }
        setAccountObj({
          id: user.id,
          avatar_url: user.user_metadata?.avatar_url || "",
          nickname: user.user_metadata?.nickname || "",
          role: user.app_metadata?.role || "",
          createdAt: user.created_at,
          lastSignInAt: user.last_sign_in_at,
          identities: user.identities,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [supabase]);

  useEffect(() => {
    fetchAccountObj();
  }, [fetchAccountObj]);

  const handleSaveNickname = async (nextNickname: string) => {
    const toastId = toast.loading("Saving profile...");
    setAccountObj((prev) =>
      prev ? { ...prev, nickname: nextNickname } : prev,
    );
    supabase.auth
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
      });
  };

  const handleLink = async (provider: "github" | "google") => {
    const toastId = toast.loading(`Linking ${provider}...`);
    supabase.auth
      .linkIdentity({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/dashboard/account`,
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
      });
  };

  const handleUnlink = async (identity: UserIdentity) => {
    const toastId = toast.loading("Unlinking provider...");
    supabase.auth.unlinkIdentity(identity).then(({ error }) => {
      if (error) {
        toast.error("Error unlinking provider", { id: toastId });
      } else {
        toast.success("Provider unlinked successfully.", { id: toastId });
        fetchAccountObj();
      }
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
