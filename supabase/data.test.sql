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
