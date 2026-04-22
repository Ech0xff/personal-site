CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    COALESCE(auth.jwt() ->> 'role' = 'service_role', FALSE) OR
    COALESCE((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', FALSE)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

----------------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION get_summary(
  tag_source_types TEXT[] DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
  posts_summary JSON;
  thoughts_summary JSON;
  events_summary JSON;
  tags_summary JSON;
BEGIN

  SELECT json_build_object(
    'count', COUNT(*),
    'characters', COALESCE(SUM(LENGTH(content)), 0),
    'contributions', (
      WITH daily_counts AS (
        SELECT
          published_at::DATE AS day,
          COUNT(*)::INTEGER AS count
        FROM public.posts
        GROUP BY published_at::DATE
      )
      SELECT COALESCE(
        json_agg(
          json_build_object(
            'date', daily_counts.day,
            'count', daily_counts.count
          )
          ORDER BY daily_counts.day
        ),
        '[]'::JSON
      )
      FROM daily_counts
    )
  ) INTO posts_summary
  FROM public.posts;

  SELECT json_build_object(
    'count', COUNT(*),
    'characters', COALESCE(SUM(LENGTH(content)), 0),
    'contributions', (
      WITH daily_counts AS (
        SELECT
          published_at::DATE AS day,
          COUNT(*)::INTEGER AS count
        FROM public.thoughts
        GROUP BY published_at::DATE
      )
      SELECT COALESCE(
        json_agg(
          json_build_object(
            'date', daily_counts.day,
            'count', daily_counts.count
          )
          ORDER BY daily_counts.day
        ),
        '[]'::JSON
      )
      FROM daily_counts
    )
  ) INTO thoughts_summary
  FROM public.thoughts;

  SELECT json_build_object(
    'count', COUNT(*),
    'characters', COALESCE(SUM(LENGTH(content)), 0),
    'contributions', (
      WITH daily_counts AS (
        SELECT
          published_at::DATE AS day,
          COUNT(*)::INTEGER AS count
        FROM public.events
        GROUP BY published_at::DATE
      )
      SELECT COALESCE(
        json_agg(
          json_build_object(
            'date', daily_counts.day,
            'count', daily_counts.count
          )
          ORDER BY daily_counts.day
        ),
        '[]'::JSON
      )
      FROM daily_counts
    )
  ) INTO events_summary
  FROM public.events;

  WITH tag_refs AS (
    SELECT public.post_tags.tag_id, 'post'::TEXT AS source_type
    FROM public.post_tags
    JOIN public.posts ON public.posts.id = public.post_tags.post_id

    UNION ALL

    SELECT public.thought_tags.tag_id, 'thought'::TEXT AS source_type
    FROM public.thought_tags
    JOIN public.thoughts ON public.thoughts.id = public.thought_tags.thought_id

    UNION ALL

    SELECT public.event_tags.tag_id, 'event'::TEXT AS source_type
    FROM public.event_tags
    JOIN public.events ON public.events.id = public.event_tags.event_id
  )
  SELECT COALESCE(json_agg(t), '[]'::json) INTO tags_summary
  FROM (
    SELECT
      public.tags.id,
      public.tags.name,
      public.tags.meta,
      COUNT(tag_refs.tag_id)::INTEGER AS count
    FROM public.tags
    LEFT JOIN tag_refs
      ON tag_refs.tag_id = public.tags.id
      AND (tag_source_types IS NULL OR tag_refs.source_type = ANY(tag_source_types))
    GROUP BY public.tags.id, public.tags.name, public.tags.meta
    ORDER BY count DESC, lower(public.tags.name) ASC
  ) t;

  RETURN json_build_object(
    'posts', posts_summary,
    'thoughts', thoughts_summary,
    'events', events_summary,
    'tags', tags_summary
  );

END;
$$;

----------------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.search_content(
  search_query TEXT
)
RETURNS TABLE (
  id UUID,
  type TEXT,
  title TEXT,
  snippet TEXT,
  published_at TIMESTAMPTZ
)
LANGUAGE sql
STABLE
AS $$
  WITH params AS (
    SELECT
      NULLIF(
        TRIM(
          REGEXP_REPLACE(COALESCE(search_query, ''), '[%_*]+', ' ', 'g')
        ),
        ''
      ) AS normalized_query
  ),
  pattern AS (
    SELECT
      '%' || normalized_query || '%' AS value,
      normalized_query
    FROM params
    WHERE normalized_query IS NOT NULL
  ),
  combined AS (
    SELECT
      posts.id,
      'post'::TEXT AS type,
      posts.title,
      posts.content AS source_text,
      posts.published_at,
      CASE
        WHEN posts.title ILIKE pattern.value THEN 2
        ELSE 1
      END AS priority,
      pattern.normalized_query
    FROM public.posts AS posts
    CROSS JOIN pattern
    WHERE posts.status = 'show'
      AND (
        posts.title ILIKE pattern.value OR
        posts.content ILIKE pattern.value OR
        posts.author ILIKE pattern.value
      )

    UNION ALL

    SELECT
      thoughts.id,
      'thought'::TEXT AS type,
      NULL::TEXT AS title,
      thoughts.content AS source_text,
      thoughts.published_at,
      1 AS priority,
      pattern.normalized_query
    FROM public.thoughts AS thoughts
    CROSS JOIN pattern
    WHERE thoughts.status = 'show'
      AND (
        thoughts.content ILIKE pattern.value OR
        thoughts.author ILIKE pattern.value
      )

    UNION ALL

    SELECT
      events.id,
      'event'::TEXT AS type,
      events.title,
      CONCAT_WS(' ', events.location_name, events.content) AS source_text,
      events.published_at,
      CASE
        WHEN events.title ILIKE pattern.value THEN 2
        ELSE 1
      END AS priority,
      pattern.normalized_query
    FROM public.events AS events
    CROSS JOIN pattern
    WHERE events.status = 'show'
      AND (
        events.title ILIKE pattern.value OR
        events.content ILIKE pattern.value OR
        COALESCE(events.location_name, '') ILIKE pattern.value
      )
  )
  SELECT
    combined.id,
    combined.type,
    combined.title,
    CASE
      WHEN CHAR_LENGTH(combined.source_text) <= 160 THEN combined.source_text
      WHEN STRPOS(LOWER(combined.source_text), LOWER(combined.normalized_query)) > 0 THEN
        CONCAT(
          CASE
            WHEN GREATEST(
              STRPOS(LOWER(combined.source_text), LOWER(combined.normalized_query)) - 48,
              1
            ) > 1 THEN '...'
            ELSE ''
          END,
          BTRIM(
            SUBSTRING(
              combined.source_text
              FROM GREATEST(
                STRPOS(LOWER(combined.source_text), LOWER(combined.normalized_query)) - 48,
                1
              )
              FOR 156
            )
          ),
          CASE
            WHEN GREATEST(
              STRPOS(LOWER(combined.source_text), LOWER(combined.normalized_query)) - 48,
              1
            ) + 156 <= CHAR_LENGTH(combined.source_text) THEN '...'
            ELSE ''
          END
        )
      ELSE LEFT(combined.source_text, 156) || '...'
    END AS snippet,
    combined.published_at
  FROM combined
  ORDER BY combined.priority DESC, combined.published_at DESC;
$$;

----------------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.send_webhook_via_pg_net()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  payload jsonb;
  new_row jsonb;
  old_row jsonb;
BEGIN
  IF TG_OP = 'INSERT' THEN
    new_row := to_jsonb(NEW);
    old_row := NULL;
  ELSIF TG_OP = 'UPDATE' THEN
    new_row := to_jsonb(NEW);
    old_row := to_jsonb(OLD);
  ELSE
    new_row := NULL;
    old_row := to_jsonb(OLD);
  END IF;

  payload := jsonb_build_object(
    'type', TG_OP,
    'table', TG_TABLE_NAME,
    'schema', TG_TABLE_SCHEMA,
    'record', new_row,
    'new', new_row,
    'old_record', old_row,
    'old', old_row
  );

  PERFORM net.http_post(
    url := TG_ARGV[0],
    body := payload,
    headers := COALESCE(TG_ARGV[1], '{}')::jsonb,
    timeout_milliseconds := 1000
  );

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$;

----------------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION manage_webhook(
  target_url text,
  secret_token text,
  table_names text[]
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  t_name text;
  trigger_name text;
  headers text;
BEGIN
  IF NOT public.is_admin() THEN
      RAISE EXCEPTION 'Access Denied' USING ERRCODE = '42501';
  END IF;
  headers := format('{"Content-Type":"application/json", "Authorization":"Bearer %s"}', secret_token);
  FOREACH t_name IN ARRAY table_names
  LOOP
      trigger_name := 'webhook_' || t_name;
      EXECUTE format('DROP TRIGGER IF EXISTS %I ON public.%I', trigger_name, t_name);
      EXECUTE format(
        'CREATE TRIGGER %I
         AFTER INSERT OR UPDATE OR DELETE ON public.%I
         FOR EACH ROW
        EXECUTE FUNCTION public.send_webhook_via_pg_net(%L, %L)',
         trigger_name, t_name, target_url, headers
      );

      RAISE NOTICE 'Webhook setup for table: %', t_name;
  END LOOP;
END;
$$;
