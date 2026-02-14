import { makeAdminClient } from "@/lib/server/supabase";

import { checkYes, loadEnvByPath, loadEnvConfig } from "./common";

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

(async () => {
  try {
    const targetEnv = process.argv[2];
    const rawEmail = process.argv[3];
    const envPath = loadEnvConfig(targetEnv);
    loadEnvByPath(envPath);

    if (!rawEmail) {
      console.error("❌ Missing email.");
      process.exit(1);
    }

    const email = normalizeEmail(rawEmail);
    if (!emailRegex.test(email)) {
      console.error(`❌ Invalid email format: ${rawEmail}`);
      process.exit(1);
    }

    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.SUPABASE_SERVICE_ROLE_KEY
    ) {
      console.error(
        "❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables.",
      );
      process.exit(1);
    }

    await checkYes(
      `⚠️ You are going to promote ${email} to admin in ${targetEnv} using ${envPath}.`,
    );

    const user = await findUserByEmail(email);
    if (!user) {
      console.error(`❌ User not found: ${email}`);
      process.exit(1);
    }

    const { error } = await makeAdminClient().auth.admin.updateUserById(
      user.id,
      {
        app_metadata: {
          ...(user.app_metadata || {}),
          role: "admin",
        },
      },
    );

    if (error) {
      console.error(`❌ Failed to promote ${email}: ${error.message}`);
      process.exit(1);
    }

    console.log(`✅ ${email} is now admin.`);
  } catch (error) {
    console.error(
      "❌ Failed to promote user:",
      error instanceof Error ? error.message : error,
    );
    process.exit(1);
  }
})();
