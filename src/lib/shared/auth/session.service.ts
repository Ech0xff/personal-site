import type { SupabaseClient } from "@supabase/supabase-js";

import { userMetadataSchema } from "./user-metadata.schema";

/** Checks if a user is logged in */
export const checkLoggedIn = async (
  client: SupabaseClient,
): Promise<boolean> => {
  const { data } = await client.auth.getSession();
  return Boolean(data.session);
};

/** Checks if a user is an admin */
export const checkIsAdmin = async (
  client: SupabaseClient,
): Promise<boolean> => {
  const { data } = await client.auth.getSession();
  return data.session?.user.app_metadata.role === "admin";
};

/** Retrieves the current user's status */
export const getUserStatus = async (client: SupabaseClient) => {
  const {
    data: { session },
  } = await client.auth.getSession();
  const user = session?.user;
  return {
    isAuth: Boolean(session),
    isAdmin: user?.app_metadata.role === "admin",
    metadata: userMetadataSchema.parse(user?.user_metadata ?? {}),
  };
};
