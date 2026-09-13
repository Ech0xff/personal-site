CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL CHECK (btrim(title) <> ''),
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

CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL CHECK (btrim(title) <> ''),
  content JSONB NOT NULL CHECK (jsonb_typeof(content) = 'array'),
  color TEXT NOT NULL DEFAULT '#3b82f6' CHECK (color ~ '^#[0-9a-fA-F]{6}$'),
  status TEXT NOT NULL DEFAULT 'hide' CHECK (status IN ('hide', 'show')),
  published_at TIMESTAMPTZ NOT NULL
);
CREATE INDEX idx_events_published_at ON public.events(published_at DESC, id);
CREATE INDEX idx_events_status ON public.events(status);
