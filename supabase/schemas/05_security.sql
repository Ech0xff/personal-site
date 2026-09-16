ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thoughts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon, authenticated;
GRANT SELECT ON public.posts, public.thoughts, public.events TO anon, authenticated;
GRANT ALL ON public.posts, public.thoughts, public.events TO service_role;

CREATE POLICY "Published posts" ON public.posts FOR SELECT TO anon, authenticated USING (status = 'show');
CREATE POLICY "Published thoughts" ON public.thoughts FOR SELECT TO anon, authenticated USING (status = 'show');
CREATE POLICY "Published events" ON public.events FOR SELECT TO anon, authenticated USING (status = 'show');

ALTER TABLE public.configs ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.configs FROM anon, authenticated;
GRANT ALL ON public.configs TO service_role;
