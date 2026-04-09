import { makeAdminClient } from "@/lib/server/supabase";

import { checkYes, loadEnvByPath, loadEnvConfig } from "./common";

(async () => {
  try {
    const targetEnv = process.argv[2];
    const envPath = loadEnvConfig(targetEnv);
    loadEnvByPath(envPath);

    if (!process.env.SITE_URL || !process.env.WEBHOOK_SECRET) {
      console.error(
        "❌ Missing SITE_URL or WEBHOOK_SECRET in environment variables.",
      );
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

    const targetUrl = `${process.env.SITE_URL}/api/webhook`;

    await checkYes(
      `⚠️ You are going to rebind webhooks for ${targetEnv} using ${envPath}.\nTarget URL: ${targetUrl}`,
    );

    const { error } = await makeAdminClient().rpc("manage_webhook", {
      target_url: targetUrl,
      secret_token: process.env.WEBHOOK_SECRET,
      table_names: ["posts", "thoughts", "events"],
    });

    if (error) {
      console.error("❌ Failed to rebind webhook:", error.message);
      process.exit(1);
    }

    console.log(`✅ Webhooks rebound successfully.`);
    console.log(`🔗 Target URL: ${targetUrl}`);
  } catch (error) {
    console.error(
      "❌ Failed to rebind webhooks:",
      error instanceof Error ? error.message : error,
    );
    process.exit(1);
  }
})();
