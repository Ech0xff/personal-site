import { readFileSync } from "fs";
import { resolve } from "path";
import postgres from "postgres";

import { makeAdminClient } from "@/lib/server/supabase";

import { checkYes, loadEnvByPath, loadEnvConfig } from "./common";

(async () => {
  let sql: ReturnType<typeof postgres> | undefined;

  try {
    const targetEnv: string = process.argv[2];
    const envPath = loadEnvConfig(targetEnv);
    loadEnvByPath(envPath);
    await checkYes(
      `⚠️ You are going to reset database and webhook for ${targetEnv} using ${envPath}`,
    );

    const DATABASE_URL = process.env.DATABASE_URL;
    if (!DATABASE_URL) {
      console.error("❌ DATABASE_URL is not set in environment variables.");
      return;
    }
    console.log("DATABASE_URL:", DATABASE_URL);

    sql = postgres(DATABASE_URL);
    await sql.unsafe(readFileSync(resolve("./supabase/table.sql"), "utf-8"));
    console.log("✅ Database reset successfully!");

    console.log("SITE_URL:", process.env.SITE_URL);
    console.log("WEBHOOK_SECRET:", process.env.WEBHOOK_SECRET);
    if (!process.env.SITE_URL || !process.env.WEBHOOK_SECRET) {
      console.error(
        "❌ Missing SITE_URL or WEBHOOK_SECRET in environment variables.",
      );
      return;
    }

    const client = makeAdminClient();
    const { error } = await client.rpc("manage_webhook", {
      target_url: process.env.SITE_URL + "/api/webhook",
      secret_token: process.env.WEBHOOK_SECRET,
      table_names: ["posts", "thoughts", "events"],
    });

    if (error) {
      console.error("❌ Failed to set webhook:", error);
      return;
    }

    console.log("✅ Webhook reset successfully!");
    console.log("✅ All done!");
  } catch (error) {
    console.error(
      "❌ Failed to reset database/webhook:",
      error instanceof Error ? error.message : error,
    );
  } finally {
    if (sql) {
      await sql.end({ timeout: 5 });
    }
  }
})();
