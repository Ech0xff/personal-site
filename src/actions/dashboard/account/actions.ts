"use server";

import { makeServerClient } from "@/lib/supabase";

export async function updatePassword(formData: FormData) {
  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!newPassword || !confirmPassword) {
    return { error: "Please fill in all fields." };
  }

  if (newPassword.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }

  if (newPassword !== confirmPassword) {
    return { error: "New passwords do not match." };
  }

  const supabase = await makeServerClient();

  // If the user has a password identity, verify the current password first
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Not authenticated." };
  }

  const hasPasswordIdentity = user.identities?.some(
    (i) => i.provider === "email",
  );

  if (hasPasswordIdentity && currentPassword) {
    // Re-authenticate with current password
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: currentPassword,
    });
    if (signInError) {
      return { error: "Current password is incorrect." };
    }
  }

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: "Password updated successfully." };
}

export async function updateProfile(formData: FormData) {
  const username = formData.get("username") as string;

  const supabase = await makeServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ username })
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  return { success: "Profile updated successfully." };
}

export async function unlinkOAuthProvider(identityId: string) {
  const supabase = await makeServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated." };
  }

  // Ensure user has at least 2 identities before unlinking
  if ((user.identities?.length ?? 0) <= 1) {
    return {
      error: "Cannot unlink your only login method. Add another method first.",
    };
  }

  const { error } = await supabase.auth.unlinkIdentity({
    id: identityId,
    provider: "",
  } as any);

  if (error) {
    return { error: error.message };
  }

  return { success: "Provider unlinked successfully." };
}

export async function getAccountInfo() {
  const supabase = await makeServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return {
    id: user.id,
    email: user.email,
    phone: user.phone,
    createdAt: user.created_at,
    lastSignInAt: user.last_sign_in_at,
    identities: user.identities ?? [],
    profile: profile ?? null,
    userMetadata: user.user_metadata,
  };
}
