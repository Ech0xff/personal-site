/** One-time, data-preserving cutover. Stop writers before using --apply. */
import { mkdir, realpath, chmod } from "node:fs/promises";
import { homedir } from "node:os";
import { join, resolve, relative } from "node:path";

import { isEqual, omit } from "es-toolkit";
import { z } from "zod";

import { audioRecordSchema } from "../src/lib/server/audio/audio-record.schema";
import { AUDIO_JOB_MS } from "../src/lib/shared/audio/audio.schema";
import { documentTitle } from "../src/lib/shared/content/document.helper";
import { documentSchema } from "../src/lib/shared/content/document.schema";
import { deskConfigurationSchema } from "../src/lib/shared/desk/desk-configuration.schema";

export type Sql = (source: string) => Promise<string>;
const json = (value: unknown) =>
  `'${JSON.stringify(value).replaceAll("'", "''")}'::jsonb`;
const contentRows = z.array(
  z.object({
    id: z.string(),
    title: z.string().optional(),
    content: documentSchema,
  }),
);
const snapshotSchema = z.object({
  posts: z.array(z.json()),
  audio: z.array(z.json()),
  configs: z.array(z.object({ key: z.string(), value: z.json() })),
});
const savedDeskSchema = z
  .object({ items: z.array(z.record(z.string(), z.json())) })
  .catchall(z.json());
const workspaceSchema = z.object({
  published: z.json().nullish(),
  draft: z.json().nullish(),
});

function removeDeskLayout(value: unknown) {
  if (value === null) return null;
  deskConfigurationSchema.parse(value);
  const configuration = savedDeskSchema.parse(value);
  return {
    ...omit(configuration, ["layouts"]),
    items: configuration.items.map((item) => omit(item, ["appearance"])),
  };
}

export async function prepareMigration(sql: Sql) {
  const hasAudio =
    (await sql("SELECT to_regclass('public.audio_assets') IS NOT NULL;")) ===
    "t";
  const snapshotQuery = `SELECT jsonb_build_object(
    'posts', (SELECT COALESCE(jsonb_agg(to_jsonb(p) ORDER BY id), '[]') FROM public.posts p),
    'audio', ${hasAudio ? "(SELECT COALESCE(jsonb_agg(to_jsonb(a) ORDER BY id), '[]') FROM public.audio_assets a)" : "'[]'::jsonb"},
    'configs', (SELECT COALESCE(jsonb_agg(to_jsonb(c) ORDER BY key), '[]') FROM public.configs c))`;
  const snapshot = snapshotSchema.parse(JSON.parse(await sql(snapshotQuery)));
  const savedDesk = snapshot.configs.find(
    (row) => row.key === "desk.configuration",
  );
  const workspace = snapshot.configs.find(
    (row) => row.key === "desk.workspace",
  );
  const oldWorkspace = workspaceSchema.parse(
    !savedDesk && workspace ? workspace.value : {},
  );
  const deskValue = savedDesk
    ? savedDesk.value
    : (oldWorkspace.published ?? oldWorkspace.draft ?? null);
  const deskContent = removeDeskLayout(deskValue);
  const deskNeedsMigration =
    Boolean(workspace) || !isEqual(deskValue, deskContent);
  const mismatches = contentRows
    .parse(snapshot.posts)
    .filter(
      (row) =>
        row.title !== undefined && row.title !== documentTitle(row.content),
    );
  if (mismatches.length)
    throw new Error(
      `Title mismatch in posts: ${mismatches.map((row) => row.id).join(", ")}`,
    );
  for (const raw of snapshot.audio) {
    const { id, ...record } = z
      .object({ id: z.string() })
      .catchall(z.json())
      .parse(raw);
    const asset = audioRecordSchema.parse(record);
    if (
      asset.run_id &&
      (!asset.started_at ||
        Date.now() - Date.parse(asset.started_at) < AUDIO_JOB_MS)
    )
      throw new Error(`Wait for the audio task to finish: ${id}`);
    const existing = snapshot.configs.find(
      (row) => row.key === `audio.asset.${id}`,
    );
    if (
      existing &&
      (await sql(`SELECT ${json(existing.value)} = ${json(record)};`)) !== "t"
    )
      throw new Error(`Conflicting audio configuration: ${id}`);
  }
  const titleColumns = await sql(
    "SELECT count(*) FROM information_schema.columns WHERE table_schema='public' AND table_name='posts' AND column_name='title';",
  );
  const schema = (
    await Promise.all(
      ["03_defaults.sql", "04_rpc.sql"].map((name) =>
        Bun.file(
          new URL(`../supabase/schemas/${name}`, import.meta.url),
        ).text(),
      ),
    )
  ).join("\n");
  return {
    snapshot,
    needed: hasAudio || titleColumns !== "0" || deskNeedsMigration,
    source: `BEGIN;
SET LOCAL lock_timeout = '10s';
LOCK TABLE public.posts, public.configs${hasAudio ? ", public.audio_assets" : ""} IN ACCESS EXCLUSIVE MODE;
CREATE TEMP TABLE migration_guard (unchanged BOOLEAN NOT NULL CONSTRAINT data_changed_since_preflight CHECK (unchanged)) ON COMMIT DROP;
INSERT INTO migration_guard VALUES ((${snapshotQuery}) = ${json(snapshot)});
ALTER TABLE public.configs ALTER COLUMN value TYPE JSONB USING value::jsonb;
${
  hasAudio
    ? `INSERT INTO public.configs(key,value) SELECT 'audio.asset.' || id, to_jsonb(a) - 'id' FROM public.audio_assets a ON CONFLICT (key) DO NOTHING;
INSERT INTO migration_guard VALUES (NOT EXISTS (SELECT 1 FROM public.audio_assets a LEFT JOIN public.configs c ON c.key='audio.asset.' || a.id WHERE c.value IS DISTINCT FROM to_jsonb(a) - 'id'));`
    : ""
}
${schema}
INSERT INTO migration_guard VALUES ((SELECT value::jsonb FROM public.configs WHERE key = 'desk.configuration') IS NOT DISTINCT FROM ${json(deskContent)});
${hasAudio ? "DROP TABLE public.audio_assets;" : ""}
ALTER TABLE public.posts DROP COLUMN IF EXISTS title;
NOTIFY pgrst, 'reload schema';
COMMIT;`,
  };
}

if (import.meta.main) {
  const allowed = new Set(["--apply"]);
  if (process.argv.slice(2).some((arg) => !allowed.has(arg)))
    throw new Error("Usage: bun scripts/simplify-database.ts [--apply]");
  const remote = process.env.DATABASE_URL;
  const container =
    process.env.SUPABASE_DB_CONTAINER ?? "supabase_db_personal-site";
  const database = process.env.SUPABASE_DB_NAME ?? "postgres";
  const command = (program: string, args: string[]) =>
    remote
      ? [program, "--dbname", remote, ...args]
      : [
          "docker",
          "exec",
          "-i",
          container,
          program,
          "-U",
          "postgres",
          "-d",
          database,
          ...args,
        ];
  const env = process.env;
  const sql: Sql = async (source) => {
    const child = Bun.spawn(
      command("psql", ["-X", "-qAt", "-v", "ON_ERROR_STOP=1"]),
      {
        env,
        stdin: new Blob([source]),
        stdout: "pipe",
        stderr: "pipe",
      },
    );
    const [out, error, code] = await Promise.all([
      new Response(child.stdout).text(),
      new Response(child.stderr).text(),
      child.exited,
    ]);
    if (code) throw new Error(error);
    return out.trim();
  };
  const migration = await prepareMigration(sql);
  if (!migration.needed) {
    console.log("Already migrated; no changes needed.");
  } else if (!process.argv.includes("--apply")) {
    console.log(
      `Preflight passed: ${migration.snapshot.posts.length} posts, ${migration.snapshot.audio.length} audio assets. Stop writers, then run with --apply.`,
    );
  } else {
    const directory = resolve(
      process.env.MIGRATION_BACKUP_DIR ??
        join(
          homedir(),
          "backups/personal-site",
          `schema-simplification-${Date.now()}`,
        ),
    );
    await mkdir(directory, { recursive: true, mode: 0o700 });
    const location = relative(
      await realpath(process.cwd()),
      await realpath(directory),
    );
    if (!location.startsWith(".."))
      throw new Error("Backups must be outside the repository.");
    const backup = join(directory, "database.dump");
    const child = Bun.spawn(command("pg_dump", ["-Fc"]), {
      env,
      stdout: "pipe",
      stderr: "pipe",
    });
    const [bytes, error, code] = await Promise.all([
      new Response(child.stdout).arrayBuffer(),
      new Response(child.stderr).text(),
      child.exited,
    ]);
    if (code || !bytes.byteLength)
      throw new Error(error || "Database backup is empty.");
    await Bun.write(backup, bytes);
    await chmod(backup, 0o600);
    const snapshotPath = join(directory, "before.json");
    await Bun.write(snapshotPath, JSON.stringify(migration.snapshot));
    await chmod(snapshotPath, 0o600);
    console.log(`Backup saved: ${directory}`);
    await sql(migration.source);
    console.log(
      "Migration committed. Restart the application and regenerate Supabase types.",
    );
  }
}
