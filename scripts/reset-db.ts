import { readFileSync } from "fs";
import { resolve } from "path";
import postgres from "postgres";

import { checkYes, loadEnvByPath, requireEnvVars } from "./common";

export const resetDb = async (envPath: string) => {
  loadEnvByPath(envPath);
  requireEnvVars(["DATABASE_URL", "SITE_URL", "WEBHOOK_SECRET"]);

  let sql: ReturnType<typeof postgres> | undefined;

  try {
    await checkYes("⚠️ You are going to reset database!");
    sql = postgres(process.env.DATABASE_URL!);
    await sql.unsafe(readFileSync(resolve("./supabase/table.sql"), "utf-8"));
    console.log("✅ Database reset successfully!");
  } catch (error) {
    throw new Error(
      `Failed to reset database/webhook: ${
        error instanceof Error ? error.message : error
      }`,
    );
  } finally {
    if (sql) {
      await sql.end({ timeout: 5 });
    }
  }
};
