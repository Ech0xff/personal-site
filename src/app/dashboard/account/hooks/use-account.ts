"use client";

import { useCallback, useEffect, useState, useTransition } from "react";


import { makeBrowserClient } from "@/lib/supabase/make-browser-client";
import { UserIdentity, UserMetadata } from "@supabase/supabase-js";


export type AccountObj = {
  id: string;
  username: string;
  role: string;
  createdAt: string;
  lastSignInAt?: string;
  identities?: UserIdentity[];
  userMetadata: UserMetadata;
};

export type StatusMsg = { type: "success" | "error"; text: string } | null;


export function useAccount() {
  const supabase = makeBrowserClient();

  const [accountObj, setAccountObj] = useState<AccountObj>();
  const [loading, setLoading] = useState(true);

  // Profile
  const [username, setUsername] = useState("");
  const [profileMsg, setProfileMsg] = useState<StatusMsg>(null);
  const [profilePending, startProfileTransition] = useTransition();

  // Password
  const [passwordMsg, setPasswordMsg] = useState<StatusMsg>(null);
  const [passwordPending, startPasswordTransition] = useTransition();

  // OAuth
  const [oauthMsg, setOauthMsg] = useState<StatusMsg>(null);
  const [unlinkingId, setUnlinkingId] = useState<string | null>(null);
  const [linkPending, startLinkTransition] = useTransition();

  /** Fetch account info */
  const fetchInfo = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // TODO: handle user not found
    if (!user) {
      setAccountObj(undefined);
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    setAccountObj({
      id: user.id,
      username: profile!.username!,
      role: profile!.role!,
      createdAt: user.created_at,
      lastSignInAt: user.last_sign_in_at,
      identities: user.identities   ,
      userMetadata: user.user_metadata,
    });
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchInfo();
  }, [fetchInfo]);


  const hasPassword = accountObj?.identities?.some((i) => i.provider === "email") ?? false;
  const linkedProviders = new Set(accountObj?.identities?.map((i) => i.provider) ?? []);
  const canUnlink = (accountObj?.identities?.length ?? 0) > 1;

  const handleProfileSubmit = (formData: FormData) => {
    setProfileMsg(null);
    startProfileTransition(async () => {
      const newUsername = formData.get("username") as string;

      const { error } = await supabase
        .from("profiles")
        .update({ username: newUsername })
        .eq("id", accountObj!.id);

      if (error) {
        setProfileMsg({ type: "error", text: error.message });
      } else {
        setProfileMsg({ type: "success", text: "Profile updated successfully." });
        fetchInfo();
      }
    });
  };

  const handlePasswordSubmit = (formData: FormData) => {
    setPasswordMsg(null);
    startPasswordTransition(async () => {
      const currentPassword = formData.get("currentPassword") as string;
      const newPassword = formData.get("newPassword") as string;
      const confirmPassword = formData.get("confirmPassword") as string;

      if (!newPassword || !confirmPassword) {
        setPasswordMsg({ type: "error", text: "Please fill in all fields." });
        return;
      }

      if (newPassword.length < 6) {
        setPasswordMsg({
          type: "error",
          text: "Password must be at least 6 characters.",
        });
        return;
      }

      if (newPassword !== confirmPassword) {
        setPasswordMsg({ type: "error", text: "New passwords do not match." });
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setPasswordMsg({ type: "error", text: "Not authenticated." });
        return;
      }

      if (currentPassword) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: user.email!,
          password: currentPassword,
        });
        if (signInError) {
          setPasswordMsg({ type: "error", text: "Current password is incorrect." });
          return;
        }
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        setPasswordMsg({ type: "error", text: error.message });
      } else {
        setPasswordMsg({ type: "success", text: "Password updated successfully." });
      }
    });
  };

  const handleLink = (provider: "github" | "google") => {
    setOauthMsg(null);
    startLinkTransition(async () => {
      try {
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

  const handleUnlink = async (identity:UserIdentity) => {
    setOauthMsg(null);

    if ((accountObj!.identities?.length ?? 0) <= 1) {
      setOauthMsg({
        type: "error",
        text: "Cannot unlink your only login method. Add another method first.",
      });
      setUnlinkingId(null);
      return;
    }

    const { error } = await supabase.auth.unlinkIdentity(identity);

    if (error) {
      setOauthMsg({ type: "error", text: error.message });
    } else {
      setOauthMsg({ type: "success", text: "Provider unlinked successfully." });
      fetchInfo();
    }
    setUnlinkingId(null);
  };

  return {
    // State
    accountObj,
    loading,
    username,
    setUsername,

    // Derived
    hasPassword,
    linkedProviders,
    canUnlink,

    // Profile
    profileMsg,
    profilePending,
    handleProfileSubmit,

    // Password
    passwordMsg,
    passwordPending,
    handlePasswordSubmit,

    // OAuth
    oauthMsg,
    linkPending,
    handleLink,
    unlinkingId,
    handleUnlink,
  };
}
