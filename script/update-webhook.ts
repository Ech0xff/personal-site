import dotenv from "dotenv";

import { makeAdminClient } from "@/lib/server/supabase";

dotenv.config({ path: ".env.local" });

async function setupWebhook() {
  const client = makeAdminClient();
  const { error } = await client.rpc("manage_webhook", {
    target_url: process.env.WEBHOOK_URL!,
    secret_token: process.env.WEBHOOK_SECRET!,
    table_names: ["posts", "thoughts", "events"],
  });
  if (error) console.error("❌ Failed:", error);
  else console.log("✅ Done!");
}

setupWebhook();
