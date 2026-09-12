import { readFile } from "node:fs/promises";

import { createClient } from "@supabase/supabase-js";
import { parse } from "dotenv";
import { z } from "zod";

import { CONFIG_KEY, getConfigDefinition } from "#lib/shared/config";
import type { Database, Json } from "#types";

import { loadEnvConfig } from "./common";

const migratedKeys = [
  CONFIG_KEY.DICTIONARY,
  CONFIG_KEY.ABOUT_ME,
  CONFIG_KEY.PLAYLIST_URL,
  CONFIG_KEY.RECENT_PLAN,
] as const;

type MigrationKey = (typeof migratedKeys)[number];
type ConfigRow = Readonly<{ key: string; value: Json }>;
type MigrationEntry = Readonly<
  { key: MigrationKey; source: string } & (
    | { state: "ready"; value: Json }
    | { state: "existing" | "missing" }
  )
>;

export const planConfigMigration = (
  rows: readonly ConfigRow[],
): readonly MigrationEntry[] => {
  const stored = new Map(rows.map(({ key, value }) => [key, value]));
  return migratedKeys.map((key) => {
    const source = `${key}:en-US`;
    const definition = getConfigDefinition(key);
    if (stored.has(key)) {
      definition.schema.parse(stored.get(key));
      return { key, source, state: "existing" };
    }
    if (!stored.has(source)) return { key, source, state: "missing" };
    const value = definition.schema.parse(stored.get(source));
    return { key, source, state: "ready", value };
  });
};

const migrateConfigs = async (args: readonly string[]) => {
  const target = args.at(0);
  const mode = args.at(1);
  if (
    (target !== "dev" && target !== "prod") ||
    (mode !== undefined && mode !== "--apply") ||
    args.length > 2
  ) {
    throw new Error(
      "Usage: bun run scripts/config-migration.service.ts <dev|prod> [--apply]",
    );
  }

  const env = z
    .object({
      NEXT_PUBLIC_SUPABASE_URL: z.url(),
      SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
    })
    .parse(parse(await readFile(loadEnvConfig(target))));
  const client = createClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
  const { data, error } = await client
    .from("configs")
    .select("key,value")
    .in(
      "key",
      migratedKeys.flatMap((key) => [key, `${key}:en-US`]),
    );
  if (error) throw new Error(`Could not load configs: ${error.message}`);

  const plan = planConfigMigration(data);
  console.log(
    `${mode === "--apply" ? "Apply" : "Dry run"}: ${new URL(env.NEXT_PUBLIC_SUPABASE_URL).host}`,
  );
  plan.forEach(({ key, source, state }) =>
    console.log(`${source} -> ${key}: ${state}`),
  );
  const inserts = plan.flatMap((entry) =>
    entry.state === "ready" ? [{ key: entry.key, value: entry.value }] : [],
  );
  if (mode !== "--apply" || inserts.length === 0) return;

  // Ignore concurrent inserts as well as values present in the initial read.
  const { data: inserted, error: insertError } = await client
    .from("configs")
    .upsert(inserts, { onConflict: "key", ignoreDuplicates: true })
    .select("key");
  if (insertError)
    throw new Error(`Could not migrate configs: ${insertError.message}`);
  console.log(
    `Inserted ${inserted.length} config(s). Existing values preserved.`,
  );
};

if (import.meta.main) {
  try {
    await migrateConfigs(process.argv.slice(2));
  } catch (error) {
    console.error(error instanceof Error ? error.message : "Migration failed.");
    process.exitCode = 1;
  }
}
