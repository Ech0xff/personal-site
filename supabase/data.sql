
----------------------------------------------------------------------------------------

INSERT INTO public.configs (key, value)
VALUES
  (
    'site.aboutMe:en_US',
    to_jsonb($$I am Muyu, a Junior Software Engineering student and a Frontend Engineer currently based in Chengdu. It is a genuine pleasure to cross paths with you in this vast digital landscape. I believe technology serves as a bridge between imagination and reality-existing not for its own sake, but to empower our ability to create and solve. Guided by the spirit of "I want to understand everything," I find joy in deconstructing complex systems and uncovering the underlying logic behind every tool.$$::text)
  ),
  (
    'site.aboutMe:zh_CN',
    to_jsonb($$我是 Muyu，一名软件工程专业本科生，同时也是一名前端工程师，目前在成都。很高兴能在这片广阔的数字世界与你相遇。我始终相信技术是连接想象与现实的桥梁——它存在的意义不只是技术本身，而是帮助我们创造并解决问题。带着“我想理解一切”的好奇心，我享受拆解复杂系统、追溯每个工具背后底层逻辑的过程。$$::text)
  ),
  (
    'site.playlistUrl',
    to_jsonb(''::text)
  ),
  (
    'auth.oauthProviders',
    to_jsonb(ARRAY['github', 'google']::text[])
  )
ON CONFLICT (key) DO NOTHING;

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
