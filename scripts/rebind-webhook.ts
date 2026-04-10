import { makeAdminClient } from "@/lib/server/supabase";

import { askInput, checkYes, loadEnvByPath, requireEnvVars } from "./common";

export const rebindWebhook = async (envPath: string) => {
  loadEnvByPath(envPath);
  requireEnvVars([
    "WEBHOOK_SECRET",
    "NEXT_PUBLIC_SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
  ]);

  const domain = await askInput("Enter the domain name: ");
  if (!domain) throw new Error("Domain name is required.");
  const targetUrl = `http://${domain}/api/webhook`;
  await checkYes(`⚠️ Target URL: ${targetUrl}`);

  const { error } = await makeAdminClient().rpc("manage_webhook", {
    target_url: targetUrl,
    secret_token: process.env.WEBHOOK_SECRET!,
    table_names: ["posts", "thoughts", "events"],
  });

  if (error) throw new Error(`Failed to rebind webhook: ${error.message}`);

  console.log("✅ Webhooks rebound successfully.");
  console.log(`🔗 Target URL: ${targetUrl}`);
};
