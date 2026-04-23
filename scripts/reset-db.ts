import { readFileSync } from "fs";
import { resolve } from "path";
import postgres from "postgres";

import { askInput, checkYes, loadEnvByPath, requireEnvVars } from "./common";

type ResetStep = {
  label: string;
  file: string;
};

type ResetOptions = {
  includeInitialData: boolean;
  includeTestData: boolean;
};

const PRE_DATA_STEPS: ResetStep[] = [
  { label: "Rebuild schema", file: "./supabase/schema.sql" },
  { label: "Create RPC functions", file: "./supabase/rpc.sql" },
];

const INITIAL_DATA_STEP: ResetStep = {
  label: "Insert initial data",
  file: "./supabase/data.sql",
};

const TEST_DATA_STEP: ResetStep = {
  label: "Insert test data",
  file: "./supabase/data.test.sql",
};

const POST_DATA_STEPS: ResetStep[] = [
  { label: "Apply row-level security", file: "./supabase/rls.sql" },
];

const readSqlFile = (filePath: string) =>
  readFileSync(resolve(filePath), "utf-8");

const askYesNo = async (question: string) => {
  const answer = await askInput(question);
  return ["y", "yes"].includes(answer.trim().toLowerCase());
};

const getResetOptions = async (): Promise<ResetOptions> => {
  const includeInitialData = await askYesNo(
    "Initialize initial data too? (y/N): ",
  );
  const includeTestData = includeInitialData
    ? await askYesNo("Initialize test data too? (y/N): ")
    : false;

  return {
    includeInitialData,
    includeTestData,
  };
};

export const getResetSteps = ({
  includeInitialData,
  includeTestData,
}: ResetOptions) => [
  ...PRE_DATA_STEPS,
  ...(includeInitialData ? [INITIAL_DATA_STEP] : []),
  ...(includeInitialData && includeTestData ? [TEST_DATA_STEP] : []),
  ...POST_DATA_STEPS,
];

const getSkippedSteps = ({
  includeInitialData,
  includeTestData,
}: ResetOptions) => {
  if (!includeInitialData) {
    return [INITIAL_DATA_STEP, TEST_DATA_STEP];
  }

  if (!includeTestData) {
    return [TEST_DATA_STEP];
  }

  return [];
};

export const resetDb = async (envPath: string) => {
  loadEnvByPath(envPath);
  requireEnvVars(["DATABASE_URL"]);

  let sql: ReturnType<typeof postgres> | undefined;

  try {
    await checkYes("⚠️ You are going to reset database!");
    const options = await getResetOptions();
    sql = postgres(process.env.DATABASE_URL!);

    for (const step of getSkippedSteps(options)) {
      console.log(`↷ Skip ${step.label}`);
    }

    for (const step of getResetSteps(options)) {
      console.log(`▶ ${step.label}...`);
      await sql.unsafe(readSqlFile(step.file));
      console.log(`✓ ${step.label}`);
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
