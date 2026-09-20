CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content JSONB NOT NULL CHECK (jsonb_typeof(content) = 'array'),
  status TEXT NOT NULL DEFAULT 'hide' CHECK (status IN ('hide', 'show')),
  published_at TIMESTAMPTZ NOT NULL
);
CREATE INDEX idx_posts_published_at ON public.posts(published_at DESC, id);
CREATE INDEX idx_posts_status ON public.posts(status);

CREATE TABLE public.thoughts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content JSONB NOT NULL CHECK (jsonb_typeof(content) = 'array'),
  status TEXT NOT NULL DEFAULT 'hide' CHECK (status IN ('hide', 'show')),
  published_at TIMESTAMPTZ NOT NULL
);
CREATE INDEX idx_thoughts_published_at ON public.thoughts(published_at DESC, id);
CREATE INDEX idx_thoughts_status ON public.thoughts(status);

CREATE TABLE IF NOT EXISTS public.configs (
  key TEXT PRIMARY KEY CHECK (btrim(key) <> ''),
  value JSONB NOT NULL
);
