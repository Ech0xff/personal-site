/** Verify RPC permissions and concurrent updates in an isolated temporary database. */
import { prepareMigration } from "./simplify-database";

const container =
  process.env.SUPABASE_DB_CONTAINER ?? "supabase_db_personal-site";
const database = `desk_rpc_check_${Date.now()}`;
const json = (value: unknown) =>
  `'${JSON.stringify(value).replaceAll("'", "''")}'::jsonb`;
async function sql(source: string, db = database): Promise<string> {
  const child = Bun.spawn(
    [
      "docker",
      "exec",
      "-i",
      container,
      "psql",
      "-X",
      "-qAt",
      "-U",
      "postgres",
      "-d",
      db,
      "-v",
      "ON_ERROR_STOP=1",
    ],
    { stdin: new Blob([source]), stdout: "pipe", stderr: "pipe" },
  );
  const [out, error, code] = await Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
    child.exited,
  ]);
  if (code) throw new Error(error);
  return out.trim();
}
function assert(value: boolean, message: string) {
  if (!value) throw new Error(message);
}
await sql(`CREATE DATABASE ${database};`, "postgres");
try {
  await sql(await Bun.file("supabase/schemas/01_extensions.sql").text());
  await sql(await Bun.file("supabase/schemas/02_tables.sql").text());
  await sql(
    "CREATE SCHEMA storage; CREATE TABLE storage.buckets(id text PRIMARY KEY, name text, public boolean, file_size_limit bigint); CREATE TABLE storage.objects(id uuid, name text, bucket_id text, metadata jsonb, user_metadata jsonb, created_at timestamptz);",
  );
  await sql(await Bun.file("supabase/schemas/03_defaults.sql").text());
  await sql(await Bun.file("supabase/schemas/04_rpc.sql").text());
  await sql(await Bun.file("supabase/schemas/05_security.sql").text());
  // Upgrade legacy workspaces without turning an unpublished edit into live content.
  await sql(`DELETE FROM public.configs WHERE key = 'desk.configuration';
    INSERT INTO public.configs(key,value) VALUES ('desk.workspace', '{"revision":3,"published":{"items":[],"layouts":{},"marker":"live"},"draft":{"items":[],"layouts":{},"marker":"draft"}}');`);
  await sql(await Bun.file("supabase/schemas/03_defaults.sql").text());
  assert(
    (await sql(
      "SELECT value->>'marker' FROM public.configs WHERE key='desk.configuration';",
    )) === "live",
    "Migration must prefer the current live configuration",
  );
  assert(
    (await sql(
      "SELECT count(*) FROM public.configs WHERE key='desk.workspace';",
    )) === "0",
    "Migration must remove the legacy workspace wrapper",
  );
  await sql(
    "UPDATE public.configs SET value = 'null' WHERE key='desk.configuration';",
  );
  assert(
    (await sql(
      "SET ROLE anon; SELECT count(*) FROM public.read_desk_audio();",
    )) === "2",
    "Legacy defaults keep both built-in recordings",
  );
  const deskContent = {
    items: [
      {
        id: "custom-books",
        type: "books",
        name: "Reading notes",
        config: { eyebrow: "Notes", title: "随手记", author: "Ech0xff" },
      },
      {
        id: "custom-record",
        type: "record",
        name: "Music",
        config: { tracks: [] },
      },
    ],
  };
  const deskWithLayout = {
    ...deskContent,
    items: deskContent.items.map((item) => ({
      ...item,
      appearance: { rotation: -4, draggable: true },
    })),
    layouts: { desktop: { width: 1440, height: 900, placements: {} } },
  };
  await sql(
    `UPDATE public.configs SET value = ${json(deskWithLayout)} WHERE key = 'desk.configuration';`,
  );
  const deskMigration = await prepareMigration(sql);
  assert(
    deskMigration.needed,
    "Layout-only configurations must need migration",
  );
  await sql(deskMigration.source);
  assert(
    (await sql(
      `SELECT value = ${json(deskContent)} FROM public.configs WHERE key = 'desk.configuration';`,
    )) === "t",
    "Removing layout must preserve content, item order, identity, and empty playlists",
  );
  assert(
    (await sql(
      "SET ROLE anon; SELECT count(*) FROM public.read_desk_audio();",
    )) === "0",
    "Migrating an empty playlist must not publish default recordings",
  );
  await sql(await Bun.file("supabase/schemas/03_defaults.sql").text());
  assert(
    !(await prepareMigration(sql)).needed,
    "Repeating the content migration must be a no-op",
  );
  await sql(
    `UPDATE public.configs SET value = ${json({
      items: [
        deskContent.items[0],
        { ...deskContent.items[0], id: "duplicate-slot" },
      ],
    })} WHERE key = 'desk.configuration';`,
  );
  assert(
    (
      await prepareMigration(sql).then(
        () => "accepted",
        (error) => String(error),
      )
    ).includes("Each desk item type can only appear once."),
    "Conflicting fixed slots must fail preflight instead of dropping content",
  );
  await sql(
    "UPDATE public.configs SET value = 'null' WHERE key = 'desk.configuration';",
  );
  await sql(await Bun.file("supabase/schemas/03_defaults.sql").text());
  assert(
    (await sql(
      "SELECT value = 'null'::jsonb FROM public.configs WHERE key = 'desk.configuration';",
    )) === "t",
    "Content migration must preserve the null configuration default",
  );
  assert(
    (await sql(
      "SELECT has_table_privilege('anon', 'public.configs', 'SELECT');",
    )) === "f",
    "The import library must remain private",
  );
  await sql(
    'INSERT INTO public.configs(key,value) VALUES(\'audio.asset.test-audio\',\'{"title":"Private import","src":"/test.mp3","duration":1,"status":"ready"}\');',
  );
  assert(
    (await sql(
      "SET ROLE anon; SELECT count(*) FROM public.read_desk_audio() WHERE id = 'test-audio';",
    )) === "0",
    "Unused imports must not appear in public reads",
  );

  assert(
    (await sql(
      "SELECT to_regprocedure('public.save_desk_configuration(bigint,jsonb,boolean)') IS NULL;",
    )) === "t",
    "The versioned save RPC must be removed",
  );
  for (const role of ["anon", "authenticated"]) {
    assert(
      (await sql(
        `SELECT has_table_privilege('${role}', 'public.configs', 'INSERT,UPDATE,DELETE');`,
      )) === "f",
      `${role} must not write desk configuration`,
    );
    assert(
      (await sql(
        `SELECT has_table_privilege('${role}', 'public.configs', 'SELECT');`,
      )) === "f",
      `${role} must not read unrelated private configuration`,
    );
  }
  await sql(
    `SET ROLE service_role; UPDATE public.configs SET value = '{"items":[]}' WHERE key = 'desk.configuration';`,
  );
  assert(
    (await sql(
      "SET ROLE anon; SELECT public.read_desk_configuration()->>'items';",
    )) === "[]",
    "Saving configuration must immediately update public reads",
  );
  assert(
    (await sql(
      "SELECT has_table_privilege('anon', 'public.configs', 'INSERT,UPDATE,DELETE');",
    )) === "f",
    "Anonymous table writes must be denied",
  );
  assert(
    (await sql(
      "SELECT has_function_privilege('anon', 'public.manage_guestbook(uuid,text)', 'EXECUTE');",
    )) === "f",
    "Moderation must be private",
  );
  assert(
    (await sql(
      "SET ROLE anon; SELECT count(*) FROM public.read_desk_audio();",
    )) === "0",
    "A saved desk without recordings must not leak default assets",
  );
  await sql(
    `UPDATE public.configs SET value = '{"items":[{"id":"record","type":"record","name":"Music","config":{"tracks":[{"assetId":"test-audio","title":"Private import","artist":""}]}}]}' WHERE key = 'desk.configuration';`,
  );
  assert(
    (await sql("SET ROLE anon; SELECT id FROM public.read_desk_audio();")) ===
      "test-audio",
    "Only the saved recording is resolved",
  );
  assert(
    (await sql("SET ROLE anon; SELECT public.read_desk_stats()->>'likes';")) ===
      "0",
    "Public stats must load",
  );
  assert(
    (await sql("SELECT to_regclass('public.events') IS NULL;")) === "t",
    "Fresh schemas must not create the retired content table",
  );
  assert(
    (await sql(
      "SET ROLE anon; SELECT public.read_desk_stats() ? 'events';",
    )) === "f",
    "Public stats must omit the retired content kind",
  );
  const likes = await Promise.all(
    Array.from({ length: 20 }, () =>
      sql("SET ROLE anon; SELECT public.like_desk();"),
    ),
  );
  assert(
    new Set(likes).size === 20 &&
      (await sql(
        "SELECT value FROM public.configs WHERE key='desk.likes';",
      )) === "20",
    "Concurrent likes must be atomic",
  );
  for (const path of ["/dashboard", "/events"]) {
    try {
      await sql(`SET ROLE anon; SELECT public.visit_desk('${path}');`);
      throw new Error("Invalid page accepted");
    } catch (error) {
      assert(String(error).includes("Invalid page."), "Invalid page must fail");
    }
  }
  try {
    await sql(
      "SET ROLE anon; SELECT public.submit_guestbook('', '', '', 'x');",
    );
    throw new Error("Invalid note accepted");
  } catch (error) {
    assert(String(error).includes("Please check"), "Invalid message must fail");
  }
  const submit = () =>
    sql(
      "SET ROLE anon; SELECT public.submit_guestbook('QA', '', '', 'Concurrent hello')->>'ok';",
    );
  const results = await Promise.all(Array.from({ length: 20 }, submit));
  assert(
    results.filter((result) => result === "true").length === 10,
    "Only ten concurrent notes may succeed",
  );
  assert((await submit()) === "false", "Eleventh note must be rejected");
  await sql(
    "SELECT public.manage_guestbook((value->'entries'->0->>'id')::uuid, 'hide') FROM public.configs WHERE key='desk.guestbook';",
  );
  assert(
    (await sql("SET ROLE anon; SELECT public.read_guestbook()->>'total';")) ===
      "9",
    "Hidden note must not be public",
  );
  await sql(
    "SELECT public.manage_guestbook((value->'entries'->0->>'id')::uuid, 'show') FROM public.configs WHERE key='desk.guestbook';",
  );
  assert(
    (await sql("SET ROLE anon; SELECT public.read_guestbook()->>'total';")) ===
      "10",
    "Restored note must be public",
  );
  await sql(
    "SELECT public.manage_guestbook((value->'entries'->0->>'id')::uuid, 'delete') FROM public.configs WHERE key='desk.guestbook';",
  );
  assert(
    (await submit()) === "false",
    "Deleting must not release rate-limit slots",
  );
  await sql(
    "UPDATE public.configs SET value=jsonb_set(value,'{recent}',jsonb_build_array(clock_timestamp()-interval '61 seconds')) WHERE key='desk.guestbook';",
  );
  assert((await submit()) === "true", "Expired window must allow a note");
  assert(
    (await sql(
      "SELECT jsonb_array_length(value->'recent') FROM public.configs WHERE key='desk.guestbook';",
    )) === "1",
    "Old timestamps must be removed",
  );

  // Resource updates are private, independent and guarded by the current task owner.
  for (const role of ["anon", "authenticated"])
    assert(
      (await sql(
        `SELECT has_function_privilege('${role}', 'public.update_audio_asset(text,uuid,jsonb)', 'EXECUTE');`,
      )) === "f",
      "Audio updates must be private",
    );
  const runIds = [
    "11111111-1111-4111-8111-111111111111",
    "22222222-2222-4222-8222-222222222222",
  ];
  const claims = await Promise.all(
    runIds.map((runId) =>
      sql(
        `SET ROLE service_role; SELECT public.update_audio_asset('test-audio', NULL, '{"run_id":"${runId}"}') IS NOT NULL;`,
      ),
    ),
  );
  assert(
    claims.filter((result) => result === "t").length === 1,
    "Only one audio task may claim a resource",
  );
  const winningRun = runIds[claims.indexOf("t")];
  const staleRun = runIds[claims.indexOf("f")];
  assert(
    (await sql(
      `SET ROLE service_role; SELECT public.update_audio_asset('test-audio','${staleRun}','{"error":"stale"}') IS NULL;`,
    )) === "t",
    "A stale run must not overwrite the resource",
  );
  const configBefore = await sql(
    "SELECT value FROM public.configs WHERE key='desk.configuration';",
  );
  await Promise.all([
    sql(
      `SET ROLE service_role; SELECT public.update_audio_asset('test-audio','${winningRun}','{"spectrum_status":"failed","run_id":null}');`,
    ),
    sql(
      "SET ROLE service_role; SELECT public.update_audio_asset('miku',NULL,'{\"error\":null}');",
    ),
  ]);
  assert(
    (await sql(
      "SELECT value FROM public.configs WHERE key='desk.configuration';",
    )) === configBefore,
    "Audio tasks must preserve the desk configuration",
  );
  assert(
    (await sql("SELECT status FROM public.read_desk_audio();").catch(
      () => "private",
    )) === "private",
    "Public audio must not expose task state",
  );

  // Exercise the real migration against a legacy fixture in this disposable database.
  await sql(`ALTER TABLE public.posts ADD COLUMN title TEXT;
    INSERT INTO public.posts(title,content,status,published_at) VALUES('Legacy title','[{"type":"heading","content":"Legacy title"}]','hide',now());
    CREATE TABLE public.audio_assets AS SELECT 'legacy-audio'::text AS id,
      'Legacy recording'::text AS title, ''::text AS artist,
      NULL::text AS source_path, NULL::text AS source_url, '/legacy.mp3'::text AS src,
      10::double precision AS duration, NULL::text AS spectrum_src, NULL::text AS description_src,
      'ready'::text AS status, 'failed'::text AS spectrum_status, NULL::text AS error,
      NULL::uuid AS run_id, NULL::timestamptz AS started_at, now() AS created_at;`);
  await sql("UPDATE public.posts SET title='Mismatch';");
  assert(
    (
      await prepareMigration(sql).then(
        () => "accepted",
        (error) => String(error),
      )
    ).includes("Title mismatch"),
    "Conflicting titles must stop migration",
  );
  await sql(
    "UPDATE public.posts SET title='Legacy title'; INSERT INTO public.configs(key,value) VALUES('audio.asset.legacy-audio','{}');",
  );
  assert(
    (
      await prepareMigration(sql).then(
        () => "accepted",
        (error) => String(error),
      )
    ).includes("Conflicting audio"),
    "Conflicting assets must stop migration",
  );
  await sql("DELETE FROM public.configs WHERE key='audio.asset.legacy-audio';");
  await sql(
    "ALTER TABLE public.configs ALTER COLUMN value TYPE JSON USING value::json;",
  );
  const migration = await prepareMigration(sql);
  await sql("UPDATE public.posts SET status='show';");
  assert(
    (
      await sql(migration.source).then(
        () => "accepted",
        (error) => String(error),
      )
    ).includes("data_changed_since_preflight"),
    "Concurrent writes must abort the transaction",
  );
  assert(
    (await sql("SELECT to_regclass('public.audio_assets') IS NOT NULL;")) ===
      "t",
    "Rollback must preserve the old table",
  );
  await sql("UPDATE public.posts SET status='hide';");
  const before = await sql("SELECT to_jsonb(p)-'title' FROM public.posts p;");
  const audioBefore = await sql(
    "SELECT to_jsonb(a)-'id' FROM public.audio_assets a;",
  );
  await sql(
    "CREATE VIEW public.migration_dependency AS SELECT id FROM public.audio_assets;",
  );
  assert(
    (
      await sql((await prepareMigration(sql)).source).then(
        () => "accepted",
        (error) => String(error),
      )
    ).includes("cannot drop table"),
    "Unmigrated dependencies must stop removal without CASCADE",
  );
  assert(
    (await sql(
      "SELECT count(*) FROM public.configs WHERE key='audio.asset.legacy-audio';",
    )) === "0",
    "Late failure must roll back copied audio records",
  );
  await sql("DROP VIEW public.migration_dependency;");
  await sql((await prepareMigration(sql)).source);
  assert(
    (await sql("SELECT to_jsonb(p) FROM public.posts p;")) === before,
    "Content must survive unchanged",
  );
  assert(
    (await sql(
      "SELECT value FROM public.configs WHERE key='audio.asset.legacy-audio';",
    )) === audioBefore,
    "Every audio field must survive unchanged",
  );
  assert(
    !(await prepareMigration(sql)).needed,
    "Repeated migration must be a no-op",
  );
  await sql(await Bun.file("supabase/seed.sql").text());
  assert(
    (await sql("SELECT count(*) > 10 FROM public.posts;")) === "t",
    "Current seed must load after migration",
  );
  console.log(
    "PASS: RPC permissions, desk migration, direct configuration saves, input checks, concurrent likes/notes, moderation, audio task ownership, lossless schema migration and seed loading.",
  );
} finally {
  await sql(`DROP DATABASE ${database} WITH (FORCE);`, "postgres");
}
