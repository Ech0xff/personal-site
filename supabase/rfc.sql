CREATE OR REPLACE FUNCTION get_summary(
  recent_limit INTEGER DEFAULT 5,
  query_status VARCHAR DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
  posts_stats JSON;
  thoughts_stats JSON;
  events_stats JSON;
  
  recent_posts JSON;
  recent_thoughts JSON;
  recent_events JSON;
BEGIN

  SELECT json_build_object(
    'show', json_build_object(
      'count', COUNT(*) FILTER (WHERE status = 'show'),
      'characters', COALESCE(SUM(LENGTH(content)) FILTER (WHERE status = 'show'), 0)
    ),
    'hide', json_build_object(
      'count', COUNT(*) FILTER (WHERE status = 'hide'),
      'characters', COALESCE(SUM(LENGTH(content)) FILTER (WHERE status = 'hide'), 0)
    )
  ) INTO posts_stats
  FROM public.posts
  WHERE (status = query_status OR query_status IS NULL);

  SELECT json_build_object(
    'show', json_build_object(
      'count', COUNT(*) FILTER (WHERE status = 'show'),
      'characters', COALESCE(SUM(LENGTH(content)) FILTER (WHERE status = 'show'), 0)
    ),
    'hide', json_build_object(
      'count', COUNT(*) FILTER (WHERE status = 'hide'),
      'characters', COALESCE(SUM(LENGTH(content)) FILTER (WHERE status = 'hide'), 0)
    )
  ) INTO thoughts_stats
  FROM public.thoughts
  WHERE (status = query_status OR query_status IS NULL);

  SELECT json_build_object(
    'show', json_build_object(
      'count', COUNT(*) FILTER (WHERE status = 'show'),
      'characters', COALESCE(SUM(LENGTH(description)) FILTER (WHERE status = 'show'), 0)
    ),
    'hide', json_build_object(
      'count', COUNT(*) FILTER (WHERE status = 'hide'),
      'characters', COALESCE(SUM(LENGTH(description)) FILTER (WHERE status = 'hide'), 0)
    )
  ) INTO events_stats
  FROM public.events
  WHERE (status = query_status OR query_status IS NULL);

  SELECT COALESCE(json_agg(t), '[]'::json) INTO recent_posts
  FROM (
    SELECT * FROM public.posts 
    WHERE (status = query_status OR query_status IS NULL)
    ORDER BY created_at DESC 
    LIMIT recent_limit
  ) t;

  SELECT COALESCE(json_agg(t), '[]'::json) INTO recent_thoughts
  FROM (
    SELECT * FROM public.thoughts 
    WHERE (status = query_status OR query_status IS NULL)
    ORDER BY created_at DESC 
    LIMIT recent_limit
  ) t;

  SELECT COALESCE(json_agg(t), '[]'::json) INTO recent_events
  FROM (
    SELECT * FROM public.events 
    WHERE (status = query_status OR query_status IS NULL)
    ORDER BY event_date DESC, created_at DESC 
    LIMIT recent_limit
  ) t;

  RETURN json_build_object(
    'statistics', json_build_object(
      'posts', posts_stats,
      'thoughts', thoughts_stats,
      'events', events_stats
    ),
    'recently', json_build_object(
      'posts', recent_posts,
      'thoughts', recent_thoughts,
      'events', recent_events
    )
  );

END;
$$;

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
         EXECUTE FUNCTION supabase_functions.http_request(%L, ''POST'', %L, ''{}'', ''1000'')',
         trigger_name, t_name, target_url, headers
      );
      
      RAISE NOTICE 'Webhook setup for table: %', t_name;
  END LOOP;
END;
$$;