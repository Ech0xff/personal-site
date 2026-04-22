DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA IF NOT EXISTS public;
CREATE EXTENSION IF NOT EXISTS postgis SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net SCHEMA extensions;
ALTER DATABASE postgres SET search_path TO "$user", public, extensions;
SET search_path TO "$user", public, extensions;

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

CREATE TABLE public.configs (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  CONSTRAINT configs_key_not_blank CHECK (btrim(key) <> '')
);

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
