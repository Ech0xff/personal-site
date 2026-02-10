DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')), 
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (id)
);

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

CREATE TABLE public.thoughts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  status VARCHAR(20) DEFAULT 'hide' CHECK (status IN ('hide', 'show')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  tags TEXT[] DEFAULT '{}',
  color VARCHAR(50),
  status VARCHAR(20) DEFAULT 'hide' CHECK (status IN ('hide', 'show')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, role, avatar_url)
  VALUES (
    new.id,
    'user_' || substr(md5(random()::text), 1, 8), 
    'user', 
    new.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_summary(
  recent_limit INTEGER DEFAULT 5,
  query_status VARCHAR DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
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
    'show', json_build_object('count', COUNT(*) FILTER (WHERE status = 'show'), 'characters', COALESCE(SUM(LENGTH(content)) FILTER (WHERE status = 'show'), 0)),
    'hide', json_build_object('count', COUNT(*) FILTER (WHERE status = 'hide'), 'characters', COALESCE(SUM(LENGTH(content)) FILTER (WHERE status = 'hide'), 0))
  ) INTO posts_stats FROM public.posts WHERE (status = query_status OR query_status IS NULL);

  SELECT json_build_object(
    'show', json_build_object('count', COUNT(*) FILTER (WHERE status = 'show'), 'characters', COALESCE(SUM(LENGTH(content)) FILTER (WHERE status = 'show'), 0)),
    'hide', json_build_object('count', COUNT(*) FILTER (WHERE status = 'hide'), 'characters', COALESCE(SUM(LENGTH(content)) FILTER (WHERE status = 'hide'), 0))
  ) INTO thoughts_stats FROM public.thoughts WHERE (status = query_status OR query_status IS NULL);

  SELECT json_build_object(
    'show', json_build_object('count', COUNT(*) FILTER (WHERE status = 'show'), 'characters', COALESCE(SUM(LENGTH(description)) FILTER (WHERE status = 'show'), 0)),
    'hide', json_build_object('count', COUNT(*) FILTER (WHERE status = 'hide'), 'characters', COALESCE(SUM(LENGTH(description)) FILTER (WHERE status = 'hide'), 0))
  ) INTO events_stats FROM public.events WHERE (status = query_status OR query_status IS NULL);

  SELECT COALESCE(json_agg(t), '[]'::json) INTO recent_posts FROM (SELECT * FROM public.posts WHERE (status = query_status OR query_status IS NULL) ORDER BY created_at DESC LIMIT recent_limit) t;
  SELECT COALESCE(json_agg(t), '[]'::json) INTO recent_thoughts FROM (SELECT * FROM public.thoughts WHERE (status = query_status OR query_status IS NULL) ORDER BY created_at DESC LIMIT recent_limit) t;
  SELECT COALESCE(json_agg(t), '[]'::json) INTO recent_events FROM (SELECT * FROM public.events WHERE (status = query_status OR query_status IS NULL) ORDER BY event_date DESC, created_at DESC LIMIT recent_limit) t;

  RETURN json_build_object(
    'statistics', json_build_object('posts', posts_stats, 'thoughts', thoughts_stats, 'events', events_stats),
    'recently', json_build_object('posts', recent_posts, 'thoughts', recent_thoughts, 'events', recent_events)
  );
END;
$$;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thoughts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Public view published posts" ON public.posts FOR SELECT USING (status = 'show' OR public.is_admin());
CREATE POLICY "Admin manage posts" ON public.posts FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Public view published thoughts" ON public.thoughts FOR SELECT USING (status = 'show' OR public.is_admin());
CREATE POLICY "Admin manage thoughts" ON public.thoughts FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Public view published events" ON public.events FOR SELECT USING (status = 'show' OR public.is_admin());
CREATE POLICY "Admin manage events" ON public.events FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE INDEX idx_posts_status ON public.posts(status);
CREATE INDEX idx_posts_published_at ON public.posts(published_at DESC NULLS LAST);
CREATE INDEX idx_posts_created_at ON public.posts(created_at DESC);
CREATE INDEX idx_posts_tags ON public.posts USING GIN(tags);

CREATE INDEX idx_thoughts_status ON public.thoughts(status);
CREATE INDEX idx_thoughts_created_at ON public.thoughts(created_at DESC);

CREATE INDEX idx_events_status ON public.events(status);
CREATE INDEX idx_events_event_date ON public.events(event_date DESC);
CREATE INDEX idx_events_tags ON public.events USING GIN(tags);

INSERT INTO public.profiles (id, username, role, avatar_url)
SELECT 
  id, 
  'user_' || substr(md5(random()::text), 1, 8),
  'user',
  raw_user_meta_data->>'avatar_url'
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- 6.2 插入初始演示数据 (仅当表为空时)
INSERT INTO public.posts (title, content, author, status, published_at, tags)
SELECT 'World Hello!', '# Dec 1, 2025\n\nThis is the first post.', 'BBLF Admin', 'show', NOW(), ARRAY['Blog', 'Tech']
WHERE NOT EXISTS (SELECT 1 FROM public.posts);

INSERT INTO public.thoughts (content, images, status)
SELECT 'The blog is finally live! 🎉', ARRAY[]::TEXT[], 'show'
WHERE NOT EXISTS (SELECT 1 FROM public.thoughts);

INSERT INTO public.events (title, description, event_date, tags, color, status)
SELECT 'Blog Officially Launched', 'BBLF has officially gone live!', CURRENT_DATE, ARRAY['Milestone', 'Blog'], '#3B82F6', 'show'
WHERE NOT EXISTS (SELECT 1 FROM public.events);

GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO postgres, anon, authenticated, service_role;