import dotenv from "dotenv";

import { makeAdminClient } from "@/lib/server/supabase";

dotenv.config({ path: ".env.local" });

async function setupWebhook() {
  const client = makeAdminClient();
  const { WEBHOOK_URL: webhook_url, WEBHOOK_SECRET: webhook_secret } =
    process.env;
  console.log("WEBHOOK_URL:", webhook_url);
  console.log("WEBHOOK_SECRET:", webhook_secret);
  if (!webhook_url || !webhook_secret) {
    console.error(
      "❌ Missing WEBHOOK_URL or WEBHOOK_SECRET in environment variables.",
    );
    return;
  }
  const { error } = await client.rpc("manage_webhook", {
    target_url: webhook_url!,
    secret_token: webhook_secret!,
    table_names: ["posts", "thoughts", "events"],
  });
  if (error) console.error("❌ Failed:", error);
  else console.log("✅ Done!");
}

setupWebhook();
