import { execFileSync } from "child_process";
import { existsSync, readFileSync, writeFileSync } from "fs";

const envPath = ".env.development";
const generatedKeys = {
  API_URL: "NEXT_PUBLIC_SUPABASE_URL",
  ANON_KEY: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  SERVICE_ROLE_KEY: "SUPABASE_SERVICE_ROLE_KEY",
} as const;

let status: string;
try {
  status = execFileSync("bunx", ["supabase", "status", "--output", "env"], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  throw new Error(
    `Could not read local Supabase status. Run \`bunx supabase start\` first.\n${message}`,
  );
}
const values = new Map<string, string>();

for (const line of status.split("\n")) {
  const match = line.match(/^([A-Z0-9_]+)="(.*)"$/);
  if (match) values.set(match[1], match[2]);
}

const missingKeys = Object.keys(generatedKeys).filter(
  (key) => !values.has(key),
);
if (missingKeys.length > 0) {
  throw new Error(`Supabase status did not return: ${missingKeys.join(", ")}.`);
}

let content = existsSync(envPath)
  ? readFileSync(envPath, "utf8")
  : readFileSync(".env.example", "utf8");

for (const [sourceKey, targetKey] of Object.entries(generatedKeys)) {
  const value = JSON.stringify(values.get(sourceKey));
  const line = `${targetKey}=${value}`;
  const pattern = new RegExp(`^${targetKey}=.*$`, "m");
  content = pattern.test(content)
    ? content.replace(pattern, line)
    : `${content.trimEnd()}\n${line}\n`;
}

writeFileSync(envPath, content.endsWith("\n") ? content : `${content}\n`);
console.log(`Updated ${envPath} from local Supabase status.`);
