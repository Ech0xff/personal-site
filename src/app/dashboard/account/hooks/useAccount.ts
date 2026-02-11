import { useCallback, useEffect, useMemo, useState } from "react";

import { UserIdentity } from "@supabase/supabase-js";
import { toast } from "sonner";

import { makeBrowserClient } from "@/lib/supabase/make-browser-client";

export type AccountObj = {
  id: string;
  role: string;
  avatar_url: string;
  nickname: string;
  createdAt: string;
  lastSignInAt?: string;
  identities?: UserIdentity[];
};

export type StatusMsg = { type: "success" | "error"; text: string } | null;

export function useAccount() {
  const supabase = useMemo(() => makeBrowserClient(), []);

  const [accountObj, setAccountObj] = useState<AccountObj>();
  const [loading, setLoading] = useState(true);

  /** Fetch account info */
  const fetchAccountObj = useCallback(async () => {
    supabase.auth
      .getSession()
      .then(({ data: { session }, error }) => {
        const user = session?.user;
        if (error || !user) {
          setAccountObj(undefined);
          toast.error("Error fetching user data");
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
    try {
      const { data, error } = await supabase.auth.linkIdentity({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
      });
      if (error) {
        toast.error(error.message);
        return;
      }
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      toast.error(`Failed to link ${provider}.`);
    }
  };

  const handleUnlink = async (identity: UserIdentity) => {
    if ((accountObj!.identities?.length ?? 0) <= 1) {
      toast.error(
        "Cannot unlink your only login method. Add another method first.",
      );
      return;
    }

    const { error } = await supabase.auth.unlinkIdentity(identity);

    if (error) {
      toast.error("Error unlinking provider");
    } else {
      toast.success("Provider unlinked successfully.");
      fetchAccountObj();
    }
  };

  return {
    // State
    accountObj,
    loading,
    handleSaveNickname,
    handleLink,
    handleUnlink,
  };
}
