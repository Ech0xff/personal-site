import { execSync } from "child_process";

import { checkYes, loadEnvByPath, loadEnvConfig } from "./common";

const vercelEnvMap: Record<string, string> = {
  dev: "development",
  prod: "production",
};

(async () => {
  try {
    const targetEnv: string = process.argv[2];
    const envPath = loadEnvConfig(targetEnv);
    const envConfig = loadEnvByPath(envPath);
    const vercelEnv = vercelEnvMap[targetEnv];

    await checkYes(
      `⚠️ You are going to push variables from ${envPath} to Vercel environment ${vercelEnv}.`,
    );

    Object.entries(envConfig).forEach(([key, value]) => {
      try {
        console.log(`${key}=${value}`);
        const command = `vercel env add ${key} ${targetEnv}`;

        execSync(command, { stdio: "ignore" });
      } catch (error) {
        console.error(
          `❌ Failed to push ${key}:`,
          error instanceof Error ? error.message : error,
        );
      }
    });

    console.log("\n✅ All custom variables sync attempts completed!");
  } catch (error) {
    console.error(
      "❌ Failed to push env variables:",
      error instanceof Error ? error.message : error,
    );
    process.exit(1);
  }
})();
