import { readFileSync } from "fs";
import { resolve } from "path";
import postgres from "postgres";

import { askInput, checkYes, loadEnvByPath, requireEnvVars } from "./common";

type ResetStep = {
  label: string;
  file: string;
};

const RESET_STEPS: ResetStep[] = [
  { label: "Rebuild schema", file: "./supabase/schema.sql" },
  { label: "Create RPC functions", file: "./supabase/rpc.sql" },
  { label: "Insert initial data", file: "./supabase/data.sql" },
  { label: "Apply row-level security", file: "./supabase/rls.sql" },
];

const TEST_DATA_STEP: ResetStep = {
  label: "Insert test data",
  file: "./supabase/data.test.sql",
};

const readSqlFile = (filePath: string) =>
  readFileSync(resolve(filePath), "utf-8");

const shouldInitTestData = async () => {
  const answer = await askInput("Initialize test data too? (y/N): ");
  return ["y", "yes"].includes(answer.trim().toLowerCase());
};

export const resetDb = async (envPath: string) => {
  loadEnvByPath(envPath);
  requireEnvVars(["DATABASE_URL"]);

  let sql: ReturnType<typeof postgres> | undefined;

  try {
    await checkYes("⚠️ You are going to reset database!");
    const includeTestData = await shouldInitTestData();
    sql = postgres(process.env.DATABASE_URL!);

    for (const step of RESET_STEPS) {
      console.log(`▶ ${step.label}...`);
      await sql.unsafe(readSqlFile(step.file));
      console.log(`✓ ${step.label}`);

      if (step.file === "./supabase/data.sql") {
        if (includeTestData) {
          console.log(`▶ ${TEST_DATA_STEP.label}...`);
          await sql.unsafe(readSqlFile(TEST_DATA_STEP.file));
          console.log(`✓ ${TEST_DATA_STEP.label}`);
        } else {
          console.log(`↷ Skip ${TEST_DATA_STEP.label}`);
        }
      }
    }

    console.log("✅ Database reset successfully!");
  } catch (error) {
    throw new Error(
      `Failed to reset database: ${
        error instanceof Error ? error.message : error
      }`,
    );
  } finally {
    if (sql) {
      await sql.end({ timeout: 5 });
    }
  }
};
