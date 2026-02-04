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