/** Verify RPC permissions and concurrent updates in an isolated temporary database. */
const container =
  process.env.SUPABASE_DB_CONTAINER ?? "supabase_db_personal-site";
const database = `desk_rpc_check_${Date.now()}`;
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
  await sql(await Bun.file("supabase/schemas/02_tables.sql").text());
  await sql(await Bun.file("supabase/schemas/05_desk.sql").text());
  // Upgrade legacy workspaces without turning an unpublished edit into live content.
  await sql(`DELETE FROM public.configs WHERE key = 'desk.configuration';
    INSERT INTO public.configs(key,value) VALUES ('desk.workspace', '{"revision":3,"published":{"items":[],"layouts":{},"marker":"live"},"draft":{"items":[],"layouts":{},"marker":"draft"}}');`);
  await sql(await Bun.file("supabase/schemas/05_desk.sql").text());
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
  await sql(
    "CREATE SCHEMA storage; CREATE TABLE storage.buckets(id text PRIMARY KEY, name text, public boolean, file_size_limit bigint);",
  );
  await sql(await Bun.file("supabase/schemas/06_audio.sql").text());
  assert(
    (await sql(
      "SET ROLE anon; SELECT count(*) FROM public.read_desk_audio();",
    )) === "2",
    "Legacy defaults keep both built-in recordings",
  );
  assert(
    (await sql(
      "SELECT has_table_privilege('anon', 'public.audio_assets', 'SELECT');",
    )) === "f",
    "The import library must remain private",
  );
  await sql(
    "INSERT INTO public.audio_assets(id,title,src,duration,status) VALUES('test-audio','Private import','/test.mp3',1,'ready');",
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
    `SET ROLE service_role; UPDATE public.configs SET value = '{"items":[],"layouts":{}}' WHERE key = 'desk.configuration';`,
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
    `UPDATE public.configs SET value = '{"items":[{"type":"record","config":{"tracks":[{"assetId":"test-audio"}]}}],"layouts":{}}' WHERE key = 'desk.configuration';`,
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
  try {
    await sql("SET ROLE anon; SELECT public.visit_desk('/dashboard');");
    throw new Error("Invalid page accepted");
  } catch (error) {
    assert(String(error).includes("Invalid page."), "Invalid page must fail");
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
  console.log(
    "PASS: RPC permissions, desk migration, direct configuration saves, input checks, concurrent likes/notes, moderation and rolling-window expiry.",
  );
} finally {
  await sql(`DROP DATABASE ${database} WITH (FORCE);`, "postgres");
}

export {};
