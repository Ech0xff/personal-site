import { makeAdminClient } from "@/lib/server/supabase";

import { checkYes, loadEnvByPath, loadEnvConfig } from "./common";

(async () => {
  try {
    const targetEnv = process.argv[2];
    const envPath = loadEnvConfig(targetEnv);
    loadEnvByPath(envPath);

    console.log("SITE_URL:", process.env.SITE_URL);
    console.log("WEBHOOK_SECRET:", process.env.WEBHOOK_SECRET);
    if (!process.env.SITE_URL || !process.env.WEBHOOK_SECRET) {
      console.error(
        "❌ Missing SITE_URL or WEBHOOK_SECRET in environment variables.",
      );
      return;
    }

    await checkYes(
      `⚠️ You are going to set webhook for ${targetEnv} using ${envPath}`,
    );

    const client = makeAdminClient();

    const { error } = await client.rpc("manage_webhook", {
      target_url: process.env.SITE_URL + "/api/webhook",
      secret_token: process.env.WEBHOOK_SECRET!,
      table_names: ["posts", "thoughts", "events"],
    });
    if (error) console.error("❌ Failed:", error);
    else console.log("✅ Done!");
  } catch (error) {
    console.error(
      "❌ Failed to set webhook:",
      error instanceof Error ? error.message : error,
    );
  }
})();
