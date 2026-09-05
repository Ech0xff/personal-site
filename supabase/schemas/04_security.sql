ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thoughts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thought_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_tags ENABLE ROW LEVEL SECURITY;

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

CREATE POLICY "TAG PUBLIC" ON public.tags FOR SELECT
USING (true);
CREATE POLICY "TAG ADMIN" ON public.tags FOR ALL
USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "CONFIG PUBLIC" ON public.configs FOR SELECT
USING (true);
CREATE POLICY "CONFIG ADMIN" ON public.configs FOR ALL
USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "POST TAG PUBLIC" ON public.post_tags FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.posts
    WHERE posts.id = post_tags.post_id
      AND (posts.status = 'show' OR public.is_admin())
  )
);
CREATE POLICY "POST TAG ADMIN" ON public.post_tags FOR ALL
USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "THOUGHT TAG PUBLIC" ON public.thought_tags FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.thoughts
    WHERE thoughts.id = thought_tags.thought_id
      AND (thoughts.status = 'show' OR public.is_admin())
  )
);
CREATE POLICY "THOUGHT TAG ADMIN" ON public.thought_tags FOR ALL
USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "EVENT TAG PUBLIC" ON public.event_tags FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.events
    WHERE events.id = event_tags.event_id
      AND (events.status = 'show' OR public.is_admin())
  )
);
CREATE POLICY "EVENT TAG ADMIN" ON public.event_tags FOR ALL
USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "STORAGE OBJECT MANAGE" ON storage.objects FOR ALL TO authenticated
USING (bucket_id = 'images' AND public.is_admin())
WITH CHECK (bucket_id = 'images' AND public.is_admin());
