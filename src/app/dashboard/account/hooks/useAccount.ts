import { useCallback, useEffect, useState } from "react";

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
  const supabase = makeBrowserClient();

  const [accountObj, setAccountObj] = useState<AccountObj>();
  const [loading, setLoading] = useState(true);

  // Profile
  const [nickname, setNickname] = useState("");

  /** Fetch account info */
  const fetchAccountObj = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // TODO: handle user not found
    if (!user) {
      setAccountObj(undefined);
      setLoading(false);
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
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      await fetchAccountObj();
      if (!isMounted) return;
    })();
    return () => {
      isMounted = false;
    };
  }, [fetchAccountObj]);

  const handleSaveUserMeta = async () => {
    const { error } = await supabase.auth.updateUser({
      data: {
        avatar_url: accountObj?.avatar_url,
        nickname: accountObj?.nickname,
      },
    });
    if (error) {
      toast.error("Error updating profile");
    } else {
      toast.success("Profile updated successfully.");
      fetchAccountObj();
    }
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
    nickname,
    setNickname,
    handleSaveUserMeta,
    handleLink,
    handleUnlink,
  };
}
