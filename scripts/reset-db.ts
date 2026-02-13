import { readFileSync } from "fs";
import { resolve } from "path";
import postgres from "postgres";

import { checkYes, loadEnvByPath, loadEnvConfig } from "./common";

(async () => {
  let sql: ReturnType<typeof postgres> | undefined;

  try {
    const targetEnv: string = process.argv[2];
    const envPath = loadEnvConfig(targetEnv);
    loadEnvByPath(envPath);
    await checkYes(
      `⚠️ You are going to reset database for ${targetEnv} using ${envPath}`,
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
  } catch (error) {
    console.error(
      "❌ Failed to reset database:",
      error instanceof Error ? error.message : error,
    );
  } finally {
    if (sql) {
      await sql.end({ timeout: 5 });
    }
  }
})();
