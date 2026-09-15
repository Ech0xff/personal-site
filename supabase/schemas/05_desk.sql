CREATE TABLE IF NOT EXISTS public.configs (
  key TEXT PRIMARY KEY CHECK (btrim(key) <> ''),
  value JSONB NOT NULL
);
ALTER TABLE public.configs ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.configs FROM anon, authenticated;
GRANT ALL ON public.configs TO service_role;
INSERT INTO public.configs(key, value) VALUES
  ('desk.likes', '0'), ('desk.visits', '0'),
  ('desk.guestbook', '{"entries":[],"recent":[]}')
ON CONFLICT (key) DO NOTHING;

CREATE OR REPLACE FUNCTION public.read_desk_stats()
RETURNS JSONB LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT jsonb_build_object(
    'posts', (SELECT count(*) FROM public.posts WHERE status = 'show'),
    'thoughts', (SELECT count(*) FROM public.thoughts WHERE status = 'show'),
    'events', (SELECT count(*) FROM public.events WHERE status = 'show'),
    'likes', (SELECT value FROM public.configs WHERE key = 'desk.likes'),
    'visits', (SELECT value FROM public.configs WHERE key = 'desk.visits')
  );
$$;
CREATE OR REPLACE FUNCTION public.like_desk()
RETURNS BIGINT LANGUAGE sql VOLATILE SECURITY DEFINER SET search_path = '' AS $$
  UPDATE public.configs SET value = to_jsonb((value #>> '{}')::bigint + 1)
  WHERE key = 'desk.likes' RETURNING (value #>> '{}')::bigint;
$$;
CREATE OR REPLACE FUNCTION public.visit_desk(page_path TEXT)
RETURNS BIGINT LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE total BIGINT;
BEGIN
  IF page_path IS NULL OR NOT (page_path IN ('/', '/posts', '/thoughts', '/events')
    OR page_path ~ '^/posts/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$') THEN
    RAISE EXCEPTION 'Invalid page.' USING ERRCODE = '22023';
  END IF;
  UPDATE public.configs SET value = to_jsonb((value #>> '{}')::bigint + 1)
    WHERE key = 'desk.visits' RETURNING (value #>> '{}')::bigint INTO total;
  RETURN total;
END;
$$;
CREATE OR REPLACE FUNCTION public.read_guestbook(page_index INTEGER DEFAULT 0)
RETURNS JSONB LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE result JSONB;
BEGIN
  IF page_index IS NULL OR page_index < 0 OR page_index > 100000 THEN
    RAISE EXCEPTION 'Invalid page.' USING ERRCODE = '22023';
  END IF;
  WITH visible AS (
    SELECT entry FROM public.configs,
      LATERAL jsonb_array_elements(value->'entries') entry
    WHERE key = 'desk.guestbook' AND entry->>'status' = 'show'
  ), page AS (
    SELECT entry FROM visible ORDER BY entry->>'date' DESC, entry->>'id' DESC
    LIMIT 50 OFFSET page_index * 50
  ) SELECT jsonb_build_object('entries', COALESCE((SELECT jsonb_agg(entry) FROM page), '[]'::jsonb),
    'total', (SELECT count(*) FROM visible)) INTO result;
  RETURN result;
END;
$$;
CREATE OR REPLACE FUNCTION public.submit_guestbook(
  author_name TEXT, author_email TEXT, github_username TEXT, message_text TEXT
) RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE book JSONB; recent JSONB; submitted_at TIMESTAMPTZ; entry JSONB;
BEGIN
  author_name := regexp_replace(COALESCE(author_name, ''), '^[[:space:]]+|[[:space:]]+$', '', 'g');
  author_email := regexp_replace(COALESCE(author_email, ''), '^[[:space:]]+|[[:space:]]+$', '', 'g');
  github_username := regexp_replace(COALESCE(github_username, ''), '^[[:space:]]+|[[:space:]]+$', '', 'g');
  message_text := regexp_replace(COALESCE(message_text, ''), '^[[:space:]]+|[[:space:]]+$', '', 'g');
  IF length(author_name) > 40 OR length(author_email) > 160
    OR (author_email <> '' AND author_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$')
    OR length(github_username) > 39
    OR (github_username <> '' AND github_username !~* '^[a-z0-9]([a-z0-9]|-[a-z0-9])*$')
    OR length(message_text) < 3 OR length(message_text) > 500 THEN
    RAISE EXCEPTION 'Please check your message.' USING ERRCODE = '22023';
  END IF;
  SELECT value INTO book FROM public.configs WHERE key = 'desk.guestbook' FOR UPDATE;
  submitted_at := clock_timestamp();
  SELECT COALESCE(jsonb_agg(stamp), '[]'::jsonb) INTO recent
    FROM jsonb_array_elements(book->'recent') stamp
    WHERE (stamp #>> '{}')::timestamptz > submitted_at - interval '60 seconds';
  IF jsonb_array_length(recent) >= 10 THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Too many notes. Please try again shortly.');
  END IF;
  entry := jsonb_build_object('id', gen_random_uuid(), 'name', author_name,
    'email', author_email, 'githubUsername', github_username, 'message', message_text,
    'date', to_char(submitted_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.US"Z"'), 'status', 'show');
  UPDATE public.configs SET value = jsonb_build_object(
    'entries', jsonb_build_array(entry) || (book->'entries'),
    'recent', recent || jsonb_build_array(submitted_at)) WHERE key = 'desk.guestbook';
  RETURN jsonb_build_object('ok', true);
END;
$$;
CREATE OR REPLACE FUNCTION public.manage_guestbook(entry_id UUID, operation TEXT)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE book JSONB; entries JSONB;
BEGIN
  IF entry_id IS NULL OR operation IS NULL OR operation NOT IN ('show', 'hide', 'delete') THEN
    RAISE EXCEPTION 'Invalid operation.' USING ERRCODE = '22023';
  END IF;
  SELECT value INTO book FROM public.configs WHERE key = 'desk.guestbook' FOR UPDATE;
  SELECT COALESCE(jsonb_agg(CASE WHEN item->>'id' = entry_id::text
      THEN jsonb_set(item, '{status}', to_jsonb(operation)) ELSE item END ORDER BY ord), '[]'::jsonb)
    INTO entries FROM jsonb_array_elements(book->'entries') WITH ORDINALITY AS e(item, ord)
    WHERE NOT (operation = 'delete' AND item->>'id' = entry_id::text);
  UPDATE public.configs SET value = jsonb_set(book, '{entries}', entries) WHERE key = 'desk.guestbook';
END;
$$;
REVOKE ALL ON FUNCTION public.read_desk_stats(), public.like_desk(), public.visit_desk(TEXT),
  public.read_guestbook(INTEGER), public.submit_guestbook(TEXT,TEXT,TEXT,TEXT),
  public.manage_guestbook(UUID,TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.read_desk_stats(), public.like_desk(), public.visit_desk(TEXT),
  public.read_guestbook(INTEGER), public.submit_guestbook(TEXT,TEXT,TEXT,TEXT) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.manage_guestbook(UUID,TEXT) TO service_role;

-- Desk configuration is published as one snapshot; drafts never reach public readers.
INSERT INTO public.configs(key, value) VALUES
  ('desk.workspace', '{"revision":0,"draft":null,"published":null}')
ON CONFLICT (key) DO NOTHING;

CREATE OR REPLACE FUNCTION public.read_desk_configuration()
RETURNS JSONB LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT value -> 'published' FROM public.configs WHERE key = 'desk.workspace';
$$;
REVOKE ALL ON FUNCTION public.read_desk_configuration() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.read_desk_configuration() TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.save_desk_configuration(expected_revision BIGINT, configuration JSONB, publish BOOLEAN DEFAULT false)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE workspace JSONB;
BEGIN
  SELECT value INTO workspace FROM public.configs WHERE key = 'desk.workspace' FOR UPDATE;
  IF (workspace ->> 'revision')::bigint IS DISTINCT FROM expected_revision THEN
    RAISE EXCEPTION 'Desk configuration changed. Reload before saving.' USING ERRCODE = '40001';
  END IF;
  IF configuration IS NULL OR jsonb_typeof(configuration -> 'items') IS DISTINCT FROM 'array'
     OR jsonb_typeof(configuration -> 'layouts') IS DISTINCT FROM 'object' THEN
    RAISE EXCEPTION 'Invalid desk configuration';
  END IF;
  workspace := jsonb_build_object(
    'revision', expected_revision + 1,
    'draft', configuration,
    'published', CASE WHEN publish THEN configuration ELSE workspace -> 'published' END
  );
  UPDATE public.configs SET value = workspace WHERE key = 'desk.workspace';
  RETURN workspace;
END;
$$;
REVOKE ALL ON FUNCTION public.save_desk_configuration(BIGINT, JSONB, BOOLEAN) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.save_desk_configuration(BIGINT, JSONB, BOOLEAN) TO service_role;
