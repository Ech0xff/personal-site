import dotenv from "dotenv";
import { resolve } from "path";
import { stdin as input, stdout as output } from "process";
import { createInterface } from "readline/promises";

export const loadEnvConfig = (targetEnv: string) => {
  const envPathMap: Record<string, string> = {
    dev: ".env.development",
    prod: ".env.production",
  };

  if (!targetEnv) {
    console.error("❌ Missing target environment.");
    process.exit(1);
  }

  const envPath = envPathMap[targetEnv];

  if (!envPath) {
    console.error(
      `❌ Unsupported environment: ${targetEnv}.`,
      `\n📋 Allowed values: ${Object.keys(envPathMap).join(", ")}`,
    );
    process.exit(1);
  }

  return envPath;
};

export const loadEnvByPath = (envPath: string) => {
  const { parsed: envConfig, error } = dotenv.config({
    path: resolve(envPath),
    override: true,
  });

  if (error || !envConfig) {
    console.error(
      `❌ Failed to load env file: ${envPath}`,
      error?.message ?? "",
    );
    process.exit(1);
  }

  return envConfig;
};

export const checkYes = async (tips: string) => {
  const rl = createInterface({ input, output });
  const answer = await rl.question(tips + "\nType yes to continue: ");
  rl.close();

  if (answer.trim().toLowerCase() !== "yes") {
    console.log("🛑 Aborted by user.");
    process.exit(0);
  }
};

export const askInput = async (question: string) => {
  const rl = createInterface({ input, output });

  try {
    return (await rl.question(question)).trim();
  } finally {
    rl.close();
  }
};

export const requireEnvVars = (keys: string[]) => {
  const missingKeys = keys.filter((key) => !process.env[key]);

  if (missingKeys.length > 0) {
    throw new Error(
      `Missing environment variables: ${missingKeys.join(", ")}.`,
    );
  }
};
