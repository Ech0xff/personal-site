import { execSync } from "child_process";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

const defaultEnvPath = ".env";
const defaultTargetEnv = "production";

// Get command line arguments
const [envFilePath, targetEnv] = process.argv.slice(2);
const fullPath = path.resolve(process.cwd(), envFilePath ?? defaultEnvPath);

if (!fs.existsSync(fullPath)) {
  console.error(`❌ File not found: ${fullPath}`);
  process.exit(1);
}

// Parse env file
const envConfig = dotenv.parse(fs.readFileSync(fullPath));

console.log(
  `🚀 Starting to push variables from [${envFilePath ?? defaultEnvPath}] to Vercel environment [${targetEnv ?? defaultTargetEnv}]...\n`,
);

Object.entries(envConfig).forEach(([key, value]) => {
  try {
    console.log(`${key}=${value}`);
    const command = `vercel env add ${key} ${targetEnv ?? defaultTargetEnv}`;

    execSync(command, { stdio: "ignore" });
  } catch (error) {
    console.error(
      `❌ Failed to push ${key}:`,
      error instanceof Error ? error.message : error,
    );
  }
});

console.log("\n✅ All custom variables sync attempts completed!");
