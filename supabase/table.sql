DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA IF NOT EXISTS public;
CREATE EXTENSION IF NOT EXISTS postgis SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net SCHEMA extensions;
ALTER DATABASE postgres SET search_path TO "$user", public, extensions;
SET search_path TO "$user", public, extensions;
-----------------------------------------------------------------------------------------------------

CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  author VARCHAR(100) NOT NULL,
  status VARCHAR(20) DEFAULT 'hide' CHECK (status IN ('hide', 'show')) NOT NULL,
  published_at TIMESTAMPTZ NOT NULL
);
CREATE INDEX idx_posts_status ON public.posts(status);
CREATE INDEX idx_posts_published_at ON public.posts(published_at DESC NULLS LAST);

CREATE TABLE public.thoughts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  images TEXT[] DEFAULT '{}' NOT NULL,
  author VARCHAR(100) NOT NULL,
  location_name VARCHAR(255),
  location_point GEOGRAPHY(POINT, 4326),
  status VARCHAR(20) DEFAULT 'hide' CHECK (status IN ('hide', 'show')) NOT NULL,
  published_at TIMESTAMPTZ NOT NULL
);
CREATE INDEX idx_thoughts_status ON public.thoughts(status);
CREATE INDEX idx_thoughts_published_at ON public.thoughts(published_at DESC NULLS LAST);
CREATE INDEX idx_thoughts_location_point ON public.thoughts USING GIST(location_point);

CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  color VARCHAR(50) NOT NULL,
  location_name VARCHAR(255),
  location_point GEOGRAPHY(POINT, 4326),
  status VARCHAR(20) DEFAULT 'hide' CHECK (status IN ('hide', 'show')) NOT NULL,
  published_at TIMESTAMPTZ NOT NULL
);
CREATE INDEX idx_events_status ON public.events(status);
CREATE INDEX idx_events_published_at ON public.events(published_at DESC NULLS LAST);
CREATE INDEX idx_events_location_point ON public.events USING GIST(location_point);

CREATE TABLE public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  meta JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT tags_name_not_blank CHECK (btrim(name) <> ''),
  CONSTRAINT tags_meta_is_object CHECK (jsonb_typeof(meta) = 'object')
);
CREATE UNIQUE INDEX idx_tags_name_lower ON public.tags(lower(name));

CREATE TABLE public.post_tags (
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);
CREATE INDEX idx_post_tags_tag_id ON public.post_tags(tag_id);

CREATE TABLE public.thought_tags (
  thought_id UUID NOT NULL REFERENCES public.thoughts(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (thought_id, tag_id)
);
CREATE INDEX idx_thought_tags_tag_id ON public.thought_tags(tag_id);

CREATE TABLE public.event_tags (
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (event_id, tag_id)
);
CREATE INDEX idx_event_tags_tag_id ON public.event_tags(tag_id);


INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-----------------------------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    COALESCE(auth.jwt() ->> 'role' = 'service_role', FALSE) OR
    COALESCE((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', FALSE)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_summary(
  query_status VARCHAR DEFAULT NULL,
  tag_source_types TEXT[] DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
  posts_stats JSON;
  thoughts_stats JSON;
  events_stats JSON;
  tags_summary JSON;
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
  WHERE
    (status = query_status OR query_status IS NULL)
    AND (status = 'show' OR public.is_admin());

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
  WHERE
    (status = query_status OR query_status IS NULL)
    AND (status = 'show' OR public.is_admin());

  SELECT json_build_object(
    'show', json_build_object(
      'count', COUNT(*) FILTER (WHERE status = 'show'),
      'characters', COALESCE(SUM(LENGTH(content)) FILTER (WHERE status = 'show'), 0)
    ),
    'hide', json_build_object(
      'count', COUNT(*) FILTER (WHERE status = 'hide'),
      'characters', COALESCE(SUM(LENGTH(content)) FILTER (WHERE status = 'hide'), 0)
    )
  ) INTO events_stats
  FROM public.events
  WHERE
    (status = query_status OR query_status IS NULL)
    AND (status = 'show' OR public.is_admin());

  WITH tag_refs AS (
    SELECT public.post_tags.tag_id, 'post'::TEXT AS source_type
    FROM public.post_tags
    JOIN public.posts ON public.posts.id = public.post_tags.post_id
    WHERE
      (public.posts.status = query_status OR query_status IS NULL)
      AND (public.posts.status = 'show' OR public.is_admin())

    UNION ALL

    SELECT public.thought_tags.tag_id, 'thought'::TEXT AS source_type
    FROM public.thought_tags
    JOIN public.thoughts ON public.thoughts.id = public.thought_tags.thought_id
    WHERE
      (public.thoughts.status = query_status OR query_status IS NULL)
      AND (public.thoughts.status = 'show' OR public.is_admin())

    UNION ALL

    SELECT public.event_tags.tag_id, 'event'::TEXT AS source_type
    FROM public.event_tags
    JOIN public.events ON public.events.id = public.event_tags.event_id
    WHERE
      (public.events.status = query_status OR query_status IS NULL)
      AND (public.events.status = 'show' OR public.is_admin())
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
    'statistics', json_build_object(
      'posts', posts_stats,
      'thoughts', thoughts_stats,
      'events', events_stats
    ),
    'tags', tags_summary
  );

END;
$$;

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

-----------------------------------------------------------------------------------------------------

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thoughts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thought_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_tags ENABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO postgres, anon, authenticated, service_role;

CREATE POLICY "POST PUBLIC" ON public.posts FOR SELECT
USING (status = 'show' OR public.is_admin());
CREATE POLICY "POST ADMIN" ON public.posts FOR ALL
USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "THOUGHT PUBLIC" ON public.thoughts FOR SELECT
USING (status = 'show' OR public.is_admin());
CREATE POLICY "THOUGHT ADMIN" ON public.thoughts FOR ALL
USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "EVENT PUBLIC" ON public.events FOR SELECT
USING (status = 'show' OR public.is_admin());
CREATE POLICY "EVENT ADMIN" ON public.events FOR ALL
USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "TAG PUBLIC" ON public.tags FOR SELECT
USING (true);
CREATE POLICY "TAG ADMIN" ON public.tags FOR ALL
USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "POST TAG PUBLIC" ON public.post_tags FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.posts
    WHERE posts.id = post_tags.post_id
      AND (posts.status = 'show' OR public.is_admin())
  )
);
CREATE POLICY "POST TAG ADMIN" ON public.post_tags FOR ALL
USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "THOUGHT TAG PUBLIC" ON public.thought_tags FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.thoughts
    WHERE thoughts.id = thought_tags.thought_id
      AND (thoughts.status = 'show' OR public.is_admin())
  )
);
CREATE POLICY "THOUGHT TAG ADMIN" ON public.thought_tags FOR ALL
USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "EVENT TAG PUBLIC" ON public.event_tags FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.events
    WHERE events.id = event_tags.event_id
      AND (events.status = 'show' OR public.is_admin())
  )
);
CREATE POLICY "EVENT TAG ADMIN" ON public.event_tags FOR ALL
USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "STORAGE OBJECT MANAGE" ON storage.objects FOR ALL TO authenticated
USING (bucket_id = 'images' AND public.is_admin())
WITH CHECK (bucket_id = 'images' AND public.is_admin());

-----------------------------------------------------------------------------------------------------

INSERT INTO public.posts (title, content, author, status, published_at)
VALUES (
  'World Hello!',
  '## ~~Hello World~~ World Hello! 👋

It is a pleasure to meet you in this vast digital space.

This is the very first post of my blog, marking the start of a brand-new journey.

Why am I here? I want this space to become my "Cyber Sanctuary." In the days to come, I’ll be documenting my thoughts, musings, and my journey of personal growth right here.

About this Blog If you’re curious about how this blog was built, the source code is hosted on GitHub: 👉 [Repository](https://github.com/muyu258/personal-site.git)

Thanks to the generosity of Vercel and Supabase, you can easily deploy it to the cloud using the pre-written automation scripts. If you’ve ever wanted a blog of your own, trust me—it’s incredibly simple. You can kickstart your own recording journey in just a few minutes.

I don''t know how long I''ll keep this up, but at least for now, I''ve started.

**Keep expressing, keep loving. I hope you find a little resonance or inspiration here.I’m glad you made it this far. The journey begins—stay tuned!**',
  'Muyu',
  'show',
  '2025-11-04 00:00:00+00'
);

INSERT INTO public.thoughts (author, content, images, status, published_at)
VALUES (
  'Muyu',
  'It’s finally up and running, though it’s still ~~a bit buggy~~ a work in progress. As the saying goes: the beginning is hard, the middle is harder, and finally... well, just ship it first. Anyway, this is officially my ~~Premium Inspiration Museum~~, ~~Repository of Brilliant Ideas~~, Cyber Trash Bin from now on. Be kind! (｡•̀ᴗ-)✧',
  ARRAY[]::TEXT[],
  'show',
  '2025-11-04 00:00:00+00'
);

INSERT INTO public.events (title, content, color, status, published_at)
VALUES (
  'Blog Officially Launched',
  'Muyu has officially gone live!',
  '#3B82F6',
  'show',
  '2025-11-04 00:00:00+00'
);

INSERT INTO public.tags (name)
VALUES ('Blog'), ('Tech'), ('Milestone')
ON CONFLICT (lower(name)) DO NOTHING;

INSERT INTO public.post_tags (post_id, tag_id)
SELECT posts.id, tags.id
FROM public.posts
CROSS JOIN (
  VALUES ('Blog'), ('Tech')
) AS tag_values(name)
JOIN public.tags ON lower(tags.name) = lower(tag_values.name)
WHERE posts.title = 'World Hello!'
ON CONFLICT DO NOTHING;

INSERT INTO public.event_tags (event_id, tag_id)
SELECT events.id, tags.id
FROM public.events
CROSS JOIN (
  VALUES ('Milestone'), ('Blog')
) AS tag_values(name)
JOIN public.tags ON lower(tags.name) = lower(tag_values.name)
WHERE events.title = 'Blog Officially Launched'
ON CONFLICT DO NOTHING;
