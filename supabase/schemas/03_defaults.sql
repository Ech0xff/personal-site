-- Required application records; demo content lives in seed.sql.
INSERT INTO public.configs(key, value) VALUES
  ('desk.likes', '0'), ('desk.visits', '0'),
  ('desk.guestbook', '{"entries":[],"recent":[]}')
ON CONFLICT (key) DO NOTHING;

-- Keep one saved desk configuration. Prefer the live content when migrating old workspaces.
INSERT INTO public.configs(key, value)
SELECT 'desk.configuration', COALESCE(
  NULLIF(value::jsonb->'published', 'null'::jsonb),
  NULLIF(value::jsonb->'draft', 'null'::jsonb),
  'null'::jsonb
)
FROM public.configs WHERE key = 'desk.workspace'
ON CONFLICT (key) DO NOTHING;
INSERT INTO public.configs(key, value) VALUES ('desk.configuration', 'null')
ON CONFLICT (key) DO NOTHING;
DELETE FROM public.configs WHERE key = 'desk.workspace';

-- Scene geometry now lives in source; preserve saved content and item order.
WITH desk_content AS (
  SELECT key, jsonb_set(value::jsonb - 'layouts', '{items}', (
    SELECT COALESCE(jsonb_agg(item - 'appearance' ORDER BY ordinal), '[]'::jsonb)
    FROM jsonb_array_elements(value::jsonb->'items') WITH ORDINALITY AS items(item, ordinal)
  )) AS value
  FROM public.configs
  WHERE key = 'desk.configuration' AND jsonb_typeof(value::jsonb->'items') = 'array'
)
UPDATE public.configs AS configs SET value = desk_content.value
FROM desk_content
WHERE configs.key = desk_content.key AND configs.value::jsonb IS DISTINCT FROM desk_content.value;

INSERT INTO storage.buckets (id, name, public, file_size_limit) VALUES ('files', 'files', true, 52428800) ON CONFLICT (id) DO UPDATE SET public = true, file_size_limit = EXCLUDED.file_size_limit;

INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('audio', 'audio', true, 52428800) ON CONFLICT (id) DO NOTHING;

-- Built-in assets use the same private configuration records as imported audio.
INSERT INTO public.configs (key, value)
SELECT 'audio.asset.' || id, jsonb_build_object(
  'title', title, 'artist', artist, 'src', src, 'duration', duration,
  'spectrum_src', spectrum_src, 'description_src', description_src,
  'status', 'ready', 'spectrum_status', 'ready',
  'source_path', NULL, 'source_url', NULL, 'error', NULL, 'run_id', NULL,
  'started_at', NULL, 'created_at', '2026-09-13T00:00:00+00:00'
)
FROM (VALUES
  ('quiet-morning','A quiet morning','A little melody for this desk','/redesign/quiet-morning.wav',16,'/redesign/quiet-morning.spectrum.bin','/redesign/quiet-morning.vtt'),
  ('miku','Miku feat. Hatsune Miku','Anamanaguchi','/redesign/miku.mp3',223.125,'/redesign/miku.spectrum.bin','/redesign/miku.vtt')
) AS assets(id, title, artist, src, duration, spectrum_src, description_src)
ON CONFLICT (key) DO NOTHING;
