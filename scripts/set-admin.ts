import { makeAdminClient } from "@/lib/server/supabase";

import { askInput, checkYes, loadEnvByPath, requireEnvVars } from "./common";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizeEmail = (value: string) => value.trim().toLowerCase();

const findUserByEmail = async (email: string) => {
  const client = makeAdminClient();
  let page = 1;
  const perPage = 200;

  while (true) {
    const { data, error } = await client.auth.admin.listUsers({
      page,
      perPage,
    });

    if (error) {
      throw new Error(`Failed to list users: ${error.message}`);
    }

    const users = data.users ?? [];
    const targetUser = users.find(
      (user) => normalizeEmail(user.email ?? "") === email,
    );

    if (targetUser) return targetUser;
    if (users.length < perPage) return null;

    page += 1;
  }
};

export const setAdmin = async (envPath: string) => {
  loadEnvByPath(envPath);
  requireEnvVars(["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"]);

  const rawEmail = await askInput("Enter the user email: ");
  if (!rawEmail.trim()) throw new Error("Email is required.");

  const email = normalizeEmail(rawEmail);
  if (!emailRegex.test(email)) {
    throw new Error(`Invalid email format: ${rawEmail}`);
  }

  await checkYes(`⚠️ Promote ${email} to admin?`);

  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error(`User not found: ${email}`);
  }

  const { error } = await makeAdminClient().auth.admin.updateUserById(user.id, {
    app_metadata: {
      ...(user.app_metadata || {}),
      role: "admin",
    },
  });

  if (error) {
    throw new Error(`Failed to promote ${email}: ${error.message}`);
  }

  console.log(`✅ ${email} is now admin.`);
};
