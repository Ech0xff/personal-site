INSERT INTO public.posts (title, content, status, published_at) VALUES ('Welcome to the new editor', '[{"type": "heading", "props": {"level": 1}, "content": "Welcome to the new editor"}, {"type": "paragraph", "content": "Write in blocks, keep the original language, and share when ready."}, {"type": "bulletListItem", "content": "Keep things simple."}]'::jsonb, 'show', '2026-09-13 09:00:00+00');

INSERT INTO public.posts (title, content, status, published_at) VALUES ('A private draft', '[{"type": "heading", "props": {"level": 1}, "content": "A private draft"}, {"type": "paragraph", "content": "Write in blocks, keep the original language, and share when ready."}, {"type": "bulletListItem", "content": "Keep things simple."}]'::jsonb, 'hide', '2026-09-13 09:00:00+00');

INSERT INTO public.thoughts (content, status, published_at) VALUES ('[{"type": "heading", "props": {"level": 2}, "content": "A new space to write"}, {"type": "paragraph", "content": "Write in blocks, keep the original language, and share when ready."}, {"type": "bulletListItem", "content": "Keep things simple."}]'::jsonb, 'show', '2026-09-13 09:00:00+00');

INSERT INTO public.thoughts (content, status, published_at) VALUES ('[{"type": "heading", "props": {"level": 2}, "content": "A new space to write"}, {"type": "paragraph", "content": "Write in blocks, keep the original language, and share when ready."}, {"type": "bulletListItem", "content": "Keep things simple."}]'::jsonb, 'hide', '2026-09-13 09:00:00+00');

INSERT INTO public.events (title, content, status, published_at) VALUES ('Welcome to the new editor', '[{"type": "heading", "props": {"level": 1}, "content": "Welcome to the new editor"}, {"type": "paragraph", "content": "Write in blocks, keep the original language, and share when ready."}, {"type": "bulletListItem", "content": "Keep things simple."}]'::jsonb, 'show', '2026-09-13 09:00:00+00');

INSERT INTO public.events (title, content, status, published_at) VALUES ('A private draft', '[{"type": "heading", "props": {"level": 1}, "content": "A private draft"}, {"type": "paragraph", "content": "Write in blocks, keep the original language, and share when ready."}, {"type": "bulletListItem", "content": "Keep things simple."}]'::jsonb, 'hide', '2026-09-13 09:00:00+00');

INSERT INTO storage.buckets (id, name, public, file_size_limit) VALUES ('files', 'files', true, 52428800) ON CONFLICT (id) DO UPDATE SET public = true, file_size_limit = EXCLUDED.file_size_limit;
