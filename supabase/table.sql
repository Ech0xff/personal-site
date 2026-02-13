CREATE EXTENSION IF NOT EXISTS pg_net SCHEMA extensions;

DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

-----------------------------------------------------------------------------------------------------

CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  author VARCHAR(100), 
  status VARCHAR(20) DEFAULT 'hide' CHECK (status IN ('hide', 'show')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ,
  view_count INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}'
);
CREATE INDEX idx_posts_status ON public.posts(status);
CREATE INDEX idx_posts_published_at ON public.posts(published_at DESC NULLS LAST);
CREATE INDEX idx_posts_created_at ON public.posts(created_at DESC);
CREATE INDEX idx_posts_tags ON public.posts USING GIN(tags);

CREATE TABLE public.thoughts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  status VARCHAR(20) DEFAULT 'hide' CHECK (status IN ('hide', 'show')),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_thoughts_status ON public.thoughts(status);
CREATE INDEX idx_thoughts_published_at ON public.thoughts(published_at DESC NULLS LAST);
CREATE INDEX idx_thoughts_created_at ON public.thoughts(created_at DESC);

CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  published_at TIMESTAMPTZ,
  tags TEXT[] DEFAULT '{}',
  color VARCHAR(50),
  status VARCHAR(20) DEFAULT 'hide' CHECK (status IN ('hide', 'show')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_events_status ON public.events(status);
CREATE INDEX idx_events_published_at ON public.events(published_at DESC NULLS LAST);
CREATE INDEX idx_events_event_date ON public.events(event_date DESC);
CREATE INDEX idx_events_tags ON public.events USING GIN(tags);

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
    ORDER BY published_at DESC NULLS LAST 
    LIMIT recent_limit
  ) t;

  SELECT COALESCE(json_agg(t), '[]'::json) INTO recent_thoughts
  FROM (
    SELECT * FROM public.thoughts 
    WHERE (status = query_status OR query_status IS NULL)
    ORDER BY published_at DESC NULLS LAST 
    LIMIT recent_limit
  ) t;

  SELECT COALESCE(json_agg(t), '[]'::json) INTO recent_events
  FROM (
    SELECT * FROM public.events 
    WHERE (status = query_status OR query_status IS NULL)
    ORDER BY published_at DESC NULLS LAST 
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

CREATE POLICY "STORAGE OBJECT MANAGE" ON storage.objects FOR ALL TO authenticated
USING (bucket_id = 'images' AND public.is_admin())
WITH CHECK (bucket_id = 'images' AND public.is_admin());

-----------------------------------------------------------------------------------------------------

INSERT INTO public.posts (title, content, author, status, published_at, created_at, updated_at, tags)
VALUES (
  'World Hello!', 
  '## ~~Hello World~~ World Hello! 👋

t is a pleasure to meet you in this vast digital space.

This is the very first post of my blog, marking the start of a brand-new journey.

Why am I here? I want this space to become my "Cyber Sanctuary." In the days to come, I’ll be documenting my thoughts, musings, and my journey of personal growth right here.

About this Blog If you’re curious about how this blog was built, the source code is hosted on GitHub: 👉 [BBLF](https://github.com/yuzi-beep/BBLF)

Thanks to the generosity of Vercel and Supabase, you can easily deploy it to the cloud using the pre-written automation scripts. If you’ve ever wanted a blog of your own, trust me—it’s incredibly simple. You can kickstart your own recording journey in just a few minutes.

I don''t know how long I''ll keep this up, but at least for now, I''ve started.

**Keep expressing, keep loving. I hope you find a little resonance or inspiration here.I’m glad you made it this far. The journey begins—stay tuned!**', 
  'BBLF Admin', 
  'show', 
  '2025-11-04 00:00:00+00', 
  '2025-11-04 00:00:00+00', 
  '2025-11-04 00:00:00+00', 
  ARRAY['Blog', 'Tech']
);

INSERT INTO public.thoughts (content, images, status, published_at, created_at, updated_at)
VALUES (
  'It’s finally up and running, though it’s still ~~a bit buggy~~ a work in progress. As the saying goes: the beginning is hard, the middle is harder, and finally... well, just ship it first. Anyway, this is officially my ~~Premium Inspiration Museum~~, ~~Repository of Brilliant Ideas~~, Cyber Trash Bin from now on. Be kind! (｡•̀ᴗ-)✧', 
  ARRAY[]::TEXT[], 
  'show', 
  '2025-11-04 00:00:00+00', 
  '2025-11-04 00:00:00+00', 
  '2025-11-04 00:00:00+00'
);

INSERT INTO public.events (title, description, event_date, tags, color, status, published_at, created_at, updated_at)
VALUES (
  'Blog Officially Launched', 
  'BBLF has officially gone live!', 
  '2025-11-04', 
  ARRAY['Milestone', 'Blog'], 
  '#3B82F6', 
  'show',
  '2025-11-04 00:00:00+00', 
  '2025-11-04 00:00:00+00',
  '2025-11-04 00:00:00+00'
);