-- ==================== Create posts table ====================
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  author VARCHAR(100),
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ,
  view_count INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}'
);

-- ==================== Create thoughts table (Short updates) ====================
CREATE TABLE IF NOT EXISTS public.thoughts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== Create events table (Timeline) ====================
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  tags TEXT[] DEFAULT '{}',
  color VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== Create Indexes ====================
-- Posts indexes
CREATE INDEX IF NOT EXISTS idx_posts_status ON public.posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON public.posts(published_at DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON public.posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_tags ON public.posts USING GIN(tags);

-- Thoughts indexes
CREATE INDEX IF NOT EXISTS idx_thoughts_created_at ON public.thoughts(created_at DESC);

-- Events indexes
CREATE INDEX IF NOT EXISTS idx_events_event_date ON public.events(event_date DESC);
CREATE INDEX IF NOT EXISTS idx_events_tags ON public.events USING GIN(tags);

-- ==================== Initial Data ====================

-- Initial Post
INSERT INTO public.posts (title, content, author, status, published_at, tags) VALUES
(
  'World Hello!',
  '# Dec 1, 2025

This is the first post of the blog to mark the beginning of this journey. All future updates and changes to the blog will be recorded here.

**Tech Stack**

- 🚀 **[Next.js](https://nextjs.org/)** - The React framework for the web
- 🗄️ **[Supabase](https://supabase.com/)** - The open-source Firebase alternative
- 🎨 **[Tailwind CSS](https://tailwindcss.com/)** - A utility-first CSS framework
- 📝 **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript',
  'BBLF Admin',
  'published',
  NOW(),
  ARRAY['Blog', 'Tech', 'Next.js', 'React']
);

-- Initial Thought
INSERT INTO public.thoughts (content, images) VALUES
(
  'The blog is finally live! 🎉 After a period of development and debugging, I have completed the setup. Using Next.js and Supabase has made the development experience incredibly smooth. I will gradually start filling it with content.',
  ARRAY[]::TEXT[]
);

-- Initial Event
INSERT INTO public.events (title, description, event_date, tags, color) VALUES
(
  'Blog Officially Launched',
  'After careful design and development, BBLF has officially gone live! This is a brand new start, and I look forward to recording more exciting content here.',
  CURRENT_DATE,
  ARRAY['Milestone', 'Blog'],
  '#3B82F6'
);