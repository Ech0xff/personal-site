-- Shared sample content and tags must precede the related fixtures below.
INSERT INTO public.posts (id, title, content, author, status, published_at)
VALUES (
  '9768ebca-8efe-476b-a364-390fe4b4f6a8',
  'World Hello!',
  '## ~~Hello World~~ World Hello! 👋

It is a pleasure to meet you in this vast digital space.

This is the very first post of my blog, marking the start of a brand-new journey.

Why am I here? I want this space to become my "Cyber Sanctuary." In the days to come, I’ll be documenting my thoughts, musings, and my journey of personal growth right here.

About this Blog If you’re curious about how this blog was built, the source code is hosted on GitHub: :ref{id="https://github.com/muyu258/personal-site" type="external" title="Repository"}

Thanks to the generosity of Vercel and Supabase, you can easily deploy it to the cloud using the pre-written automation scripts. If you’ve ever wanted a blog of your own, trust me—it’s incredibly simple. You can kickstart your own recording journey in just a few minutes.

I don''t know how long I''ll keep this up, but at least for now, I''ve started.

**Keep expressing, keep loving. I hope you find a little resonance or inspiration here.I’m glad you made it this far. The journey begins—stay tuned!**',
  'Muyu',
  'show',
  '2025-11-04 00:00:00+00'
);

INSERT INTO public.events (
  id,
  title,
  content,
  color,
  location_name,
  location_point,
  status,
  published_at
)
VALUES (
  '6b1a91ff-b669-4549-b7be-7a273d980e1e',
  'Blog Officially Launched',
  'Blog has officially gone live!',
  '#3B82F6',
  null,
  null,
  'show',
  '2025-11-04 00:00:00+00'
);

INSERT INTO public.thoughts (
  id,
  content,
  images,
  author,
  location_name,
  location_point,
  status,
  published_at
)
VALUES (
  '46ce37a2-8331-4ec7-907b-3725600221d1',
  'It’s finally up and running, though it’s still ~~a bit buggy~~ a work in progress. As the saying goes: the beginning is hard, the middle is harder, and finally... well, just ship it first. Anyway, this is officially my ~~Premium Inspiration Museum~~, ~~Repository of Brilliant Ideas~~, Cyber Trash Bin from now on. Be kind! (｡•̀ᴗ-)✧',
  ARRAY[]::TEXT[],
  'Muyu',
  null,
  null,
  'show',
  '2025-11-04 00:00:00+00'
);

INSERT INTO public.tags (id, name, meta, created_at)
VALUES
  ('b3b1c8b1-2d92-4b7d-9258-3eb7816f00f1', 'Blog', '{"color": "#3b82f6"}', '2026-04-19 13:36:59.481888+00'),
  ('b3b1c8b1-2d92-4b7d-9258-3eb7816f00f2', 'Tech', '{"color": "#64748b"}', '2026-04-19 13:36:59.481888+00'),
  ('b3b1c8b1-2d92-4b7d-9258-3eb7816f00f3', 'Milestone', '{"color": "#f59e0b"}', '2026-04-19 13:36:59.481888+00'),
  ('02081181-71df-41c7-acee-57e4576b0916', 'Prompt Engineering', '{"color": "#c084fc"}', '2026-04-19 13:36:59.481888+00'),
  ('182a04a5-67ad-4a4a-b31e-fd8817baab23', 'Bun', '{"color": "#f5f5f4"}', '2026-04-19 13:36:59.481888+00'),
  ('1c69ec11-491a-4b80-b468-79d9f9399f66', 'TypeScript', '{"color": "#3178c6"}', '2026-04-19 13:36:59.481888+00'),
  ('2483d6e9-ae70-440c-a0a3-bed3d71c1f0d', 'Design System', '{"color": "#ec4899"}', '2026-04-19 13:36:59.481888+00'),
  ('2e2fcdac-64fa-4f1b-84ed-745e28ed5f91', 'Canvas', '{"color": "#06b6d4"}', '2026-04-19 13:36:59.481888+00'),
  ('2e99e5d0-9eb4-4624-a2ce-0bfb3627838c', 'Vite', '{"color": "#a855f7"}', '2026-04-19 13:36:59.481888+00'),
  ('2fde6250-e9a3-4a43-92e9-3f48e9d27300', 'OpenAI API', '{"color": "#0f766e"}', '2026-04-19 13:36:59.481888+00'),
  ('3214ef17-3fb3-449a-ab94-37dc842f9a0f', 'RAG', '{"color": "#10b981"}', '2026-04-19 13:36:59.481888+00'),
  ('37544d9b-ef3b-4eab-8426-7003b14b785f', 'PostgreSQL', '{"color": "#336791"}', '2026-04-19 13:36:59.481888+00'),
  ('3785ab3e-894d-410d-9261-0b68f9c03610', 'HTML', '{"color": "#f97316"}', '2026-04-19 13:36:59.481888+00'),
  ('4089460b-0dd0-49bf-b432-5254237ff6a2', 'Node.js', '{"color": "#22c55e"}', '2026-04-19 13:36:59.481888+00'),
  ('487306bd-06da-4904-ad15-bc45d7f82299', 'GraphQL', '{"color": "#e10098"}', '2026-04-19 13:36:59.481888+00'),
  ('73fa3dab-3178-4338-952e-75f0fd542258', 'Animation', '{"color": "#f59e0b"}', '2026-04-19 13:36:59.481888+00'),
  ('7d2ba4b7-5fc5-460d-a443-e5ad416bf63c', 'Web Performance', '{"color": "#84cc16"}', '2026-04-19 13:36:59.481888+00'),
  ('8bc07ce9-8f16-4ca7-a21e-b9dcb6ff7b01', 'Tailwind CSS', '{"color": "#38bdf8"}', '2026-04-19 13:36:59.481888+00'),
  ('8d56ac0c-98a9-4833-abd9-c9fbd13140ce', 'Embeddings', '{"color": "#22d3ee"}', '2026-04-19 13:36:59.481888+00'),
  ('8d676208-5b01-429d-8d8a-4096884eb8cb', 'Accessibility', '{"color": "#14b8a6"}', '2026-04-19 13:36:59.481888+00'),
  ('92fe7224-3e80-4bb0-b134-a18693d75cc5', 'Three.js', '{"color": "#64748b"}', '2026-04-19 13:36:59.481888+00'),
  ('936bc8cd-8e74-4837-8a8c-93fdb8ba8fa5', 'REST API', '{"color": "#0ea5e9"}', '2026-04-19 13:36:59.481888+00'),
  ('a7286a81-9ff4-44e4-ba04-6c8759932900', 'JavaScript', '{"color": "#f7df1e"}', '2026-04-19 13:36:59.481888+00'),
  ('b64d773f-d961-4bda-84c7-5d0650596755', 'Next.js', '{"color": "#111827"}', '2026-04-19 13:36:59.481888+00'),
  ('c59526e9-b9aa-4884-9083-6d3ec2e9c882', 'CSS', '{"color": "#2563eb"}', '2026-04-19 13:36:59.481888+00'),
  ('d5c21c5d-9056-4f62-be7a-2d295851d976', 'React', '{"color": "#61dafb"}', '2026-04-19 13:36:59.481888+00'),
  ('db4fd5ae-f38c-4ec7-93df-4fbc8deaa76b', 'LLM', '{"color": "#7c3aed"}', '2026-04-19 13:36:59.481888+00'),
  ('ecbe1d7e-6a59-4bf8-b2bb-4a5c385f3909', 'Supabase', '{"color": "#3ecf8e"}', '2026-04-19 13:36:59.481888+00'),
  ('ef91fe37-bc61-4fd8-b07d-a0ba42281541', 'AI', '{"color": "#8b5cf6"}', '2026-04-19 13:36:59.481888+00'),
  ('f80af017-588f-4be1-b7d4-b0fd46679bf4', 'AI Agent', '{"color": "#6366f1"}', '2026-04-19 13:36:59.481888+00')
ON CONFLICT (lower(name)) DO NOTHING;

INSERT INTO public.post_tags (post_id, tag_id)
SELECT '9768ebca-8efe-476b-a364-390fe4b4f6a8', tags.id
FROM public.tags AS tags
WHERE lower(tags.name) IN ('blog', 'tech', 'next.js', 'supabase', 'react')
ON CONFLICT DO NOTHING;

INSERT INTO public.event_tags (event_id, tag_id)
SELECT '6b1a91ff-b669-4549-b7be-7a273d980e1e', tags.id
FROM public.tags AS tags
WHERE lower(tags.name) IN ('blog', 'milestone')
ON CONFLICT DO NOTHING;

INSERT INTO public.thought_tags (thought_id, tag_id)
SELECT '46ce37a2-8331-4ec7-907b-3725600221d1', tags.id
FROM public.tags AS tags
WHERE lower(tags.name) IN ('blog', 'tech')
ON CONFLICT DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.posts (id, title, content, author, status, published_at)
VALUES (
  'cf44cb54-1d65-446b-bca9-8b3f6158484f',
  'Designing Faster Search Experiences',
  'I have been iterating on search interaction details lately. The most useful lesson so far is that a fast search experience is mostly about reducing friction before a query becomes complicated.',
  'Muyu',
  'show',
  '2026-04-18 09:00:00+00'
);

INSERT INTO public.thoughts (
  id,
  content,
  images,
  author,
  location_name,
  location_point,
  status,
  published_at
)
VALUES (
  'fed37aa9-f3a0-4264-b8c2-7e9c32aa0010',
  'Search quality gets much better once tags and structure are treated as part of the writing workflow instead of an afterthought.',
  ARRAY[]::TEXT[],
  'Muyu',
  null,
  null,
  'show',
  '2026-04-18 12:30:00+00'
);

INSERT INTO public.events (
  id,
  title,
  content,
  color,
  location_name,
  location_point,
  status,
  published_at
)
VALUES (
  '8b1d09bf-eb32-4763-bf38-cf4891e7d39e',
  'Search UI Polish',
  'Finished another round of search interaction polish for the dashboard and homepage.',
  '#10B981',
  null,
  null,
  'show',
  '2026-04-18 15:00:00+00'
);

INSERT INTO public.post_tags (post_id, tag_id)
SELECT 'cf44cb54-1d65-446b-bca9-8b3f6158484f', tags.id
FROM public.tags AS tags
WHERE lower(tags.name) IN (
  'next.js',
  'react',
  'web performance',
  'design system'
)
ON CONFLICT DO NOTHING;

INSERT INTO public.thought_tags (thought_id, tag_id)
SELECT 'fed37aa9-f3a0-4264-b8c2-7e9c32aa0010', tags.id
FROM public.tags AS tags
WHERE lower(tags.name) IN ('rag', 'embeddings', 'llm', 'prompt engineering')
ON CONFLICT DO NOTHING;

INSERT INTO public.event_tags (event_id, tag_id)
SELECT '8b1d09bf-eb32-4763-bf38-cf4891e7d39e', tags.id
FROM public.tags AS tags
WHERE lower(tags.name) IN ('next.js', 'tailwind css', 'animation')
ON CONFLICT DO NOTHING;

INSERT INTO public.posts (id, title, content, author, status, published_at)
VALUES
  (
    '1b0a4a9f-a3ad-4108-81c4-29ad9f84fc11',
    'Building a Better Tag Editing Flow',
    'I wanted tag editing to feel lightweight instead of administrative. The best improvement ended up being tiny: better defaults, clearer color choices, and less form friction.',
    'Muyu',
    'show',
    '2026-04-17 08:30:00+00'
  ),
  (
    'e8f5d11b-2d84-4df1-857a-f22bb29ffb79',
    'Notes on Shipping with Supabase',
    'Supabase keeps being a nice fit for small products when the schema stays disciplined. The biggest win is that auth, storage, and database policy all live close enough to reason about together.',
    'Muyu',
    'show',
    '2026-04-16 13:20:00+00'
  ),
  (
    '6a1ea965-5d44-470a-aa78-5ed80e0c820a',
    'When Search Needs Less UI',
    'The search modal became more useful after removing a few things from it. Better ranking, cleaner copy, and faster keyboard flow mattered more than adding extra controls.',
    'Muyu',
    'hide',
    '2026-04-15 07:45:00+00'
  );

INSERT INTO public.thoughts (
  id,
  content,
  images,
  author,
  location_name,
  location_point,
  status,
  published_at
)
VALUES
  (
    '0cc7bf63-b4b3-442f-b9c1-a7e93a7b1f15',
    'I keep relearning the same lesson: a dashboard feels faster when the defaults are right, not when there are more knobs.',
    ARRAY[]::TEXT[],
    'Muyu',
    'Chengdu',
    null,
    'show',
    '2026-04-17 10:10:00+00'
  ),
  (
    '9b8f3d0f-a23d-4cbe-81e7-9b8658c0a0ac',
    'Tag colors are turning into a surprisingly helpful visual system. It is easier to scan content clusters when the metadata feels consistent.',
    ARRAY[]::TEXT[],
    'Muyu',
    null,
    null,
    'show',
    '2026-04-16 18:05:00+00'
  ),
  (
    '5464f3aa-4b1a-4f2e-9043-886f3a69f7a4',
    'I should probably stop calling unfinished UI states \"temporary\". They tend to stay around longer than I expect.',
    ARRAY[]::TEXT[],
    'Muyu',
    null,
    null,
    'hide',
    '2026-04-15 21:40:00+00'
  );

INSERT INTO public.events (
  id,
  title,
  content,
  color,
  location_name,
  location_point,
  status,
  published_at
)
VALUES
  (
    '3c4f147f-9dfc-44f6-968f-31fd0f247394',
    'Tag System Cleanup',
    'Finished a cleanup pass on tag metadata and relation management.',
    '#EC4899',
    null,
    null,
    'show',
    '2026-04-17 14:00:00+00'
  ),
  (
    '74d7897e-6df8-4875-80f2-a3783fbf2392',
    'Supabase Policy Pass',
    'Reviewed RLS coverage after expanding dashboard actions and search helpers.',
    '#3ECF8E',
    null,
    null,
    'show',
    '2026-04-16 16:30:00+00'
  ),
  (
    '51d99ba9-c65d-4d79-a76d-4ad66940ed68',
    'Prototype Search Iteration',
    'A hidden checkpoint for a search experiment that is not ready to surface yet.',
    '#6366F1',
    null,
    null,
    'hide',
    '2026-04-15 09:15:00+00'
  );

INSERT INTO public.post_tags (post_id, tag_id)
SELECT '1b0a4a9f-a3ad-4108-81c4-29ad9f84fc11', tags.id
FROM public.tags AS tags
WHERE lower(tags.name) IN ('design system', 'css', 'tailwind css', 'react')
ON CONFLICT DO NOTHING;

INSERT INTO public.post_tags (post_id, tag_id)
SELECT 'e8f5d11b-2d84-4df1-857a-f22bb29ffb79', tags.id
FROM public.tags AS tags
WHERE lower(tags.name) IN ('supabase', 'postgresql', 'rest api', 'next.js')
ON CONFLICT DO NOTHING;

INSERT INTO public.post_tags (post_id, tag_id)
SELECT '6a1ea965-5d44-470a-aa78-5ed80e0c820a', tags.id
FROM public.tags AS tags
WHERE lower(tags.name) IN ('web performance', 'next.js', 'react')
ON CONFLICT DO NOTHING;

INSERT INTO public.thought_tags (thought_id, tag_id)
SELECT '0cc7bf63-b4b3-442f-b9c1-a7e93a7b1f15', tags.id
FROM public.tags AS tags
WHERE lower(tags.name) IN ('design system', 'web performance', 'react')
ON CONFLICT DO NOTHING;

INSERT INTO public.thought_tags (thought_id, tag_id)
SELECT '9b8f3d0f-a23d-4cbe-81e7-9b8658c0a0ac', tags.id
FROM public.tags AS tags
WHERE lower(tags.name) IN ('design system', 'css', 'tailwind css')
ON CONFLICT DO NOTHING;

INSERT INTO public.thought_tags (thought_id, tag_id)
SELECT '5464f3aa-4b1a-4f2e-9043-886f3a69f7a4', tags.id
FROM public.tags AS tags
WHERE lower(tags.name) IN ('blog', 'tech')
ON CONFLICT DO NOTHING;

INSERT INTO public.event_tags (event_id, tag_id)
SELECT '3c4f147f-9dfc-44f6-968f-31fd0f247394', tags.id
FROM public.tags AS tags
WHERE lower(tags.name) IN ('design system', 'tailwind css', 'css')
ON CONFLICT DO NOTHING;

INSERT INTO public.event_tags (event_id, tag_id)
SELECT '74d7897e-6df8-4875-80f2-a3783fbf2392', tags.id
FROM public.tags AS tags
WHERE lower(tags.name) IN ('supabase', 'postgresql', 'next.js')
ON CONFLICT DO NOTHING;

INSERT INTO public.event_tags (event_id, tag_id)
SELECT '51d99ba9-c65d-4d79-a76d-4ad66940ed68', tags.id
FROM public.tags AS tags
WHERE lower(tags.name) IN ('ai', 'llm', 'prompt engineering')
ON CONFLICT DO NOTHING;

-- Language-free editable configuration for fresh local databases.
INSERT INTO public.configs (key, value)
VALUES
  ('DICTIONARY', '{}'::jsonb),
  ('ABOUT_ME', '"Hi, I''m Ech0xff. Welcome to my personal site!"'::jsonb),
  ('PLAYLIST_URL', '""'::jsonb),
  ('RECENT_PLAN', '[]'::jsonb),
  ('OAUTH', '[]'::jsonb)
ON CONFLICT (key) DO NOTHING;
