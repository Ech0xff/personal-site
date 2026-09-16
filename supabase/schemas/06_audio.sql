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

-- Compare the task owner and merge its patch in the same row update.
CREATE OR REPLACE FUNCTION public.update_audio_asset(asset_id TEXT, expected_run_id UUID DEFAULT NULL, patch JSONB DEFAULT '{}')
RETURNS JSONB LANGUAGE sql VOLATILE SECURITY INVOKER SET search_path = '' AS $$
  UPDATE public.configs SET value = value || patch
  WHERE key = 'audio.asset.' || asset_id
    AND value->>'run_id' IS NOT DISTINCT FROM expected_run_id::text
  RETURNING value;
$$;
REVOKE ALL ON FUNCTION public.update_audio_asset(TEXT, UUID, JSONB) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.update_audio_asset(TEXT, UUID, JSONB) TO service_role;

DROP FUNCTION IF EXISTS public.read_published_desk_audio();
CREATE OR REPLACE FUNCTION public.read_desk_audio()
RETURNS TABLE (id TEXT, title TEXT, artist TEXT, src TEXT, duration DOUBLE PRECISION, spectrum_src TEXT, description_src TEXT)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT substring(a.key FROM 13), a.value->>'title', a.value->>'artist',
    a.value->>'src', (a.value->>'duration')::double precision,
    a.value->>'spectrum_src', a.value->>'description_src'
  FROM public.configs a
  WHERE a.key LIKE 'audio.asset.%' AND a.value->>'status' = 'ready' AND EXISTS (
    SELECT 1 FROM public.configs c,
    LATERAL jsonb_array_elements(COALESCE(c.value::jsonb->'items', '[{"type":"record","config":{}}]'::jsonb)) item,
    LATERAL jsonb_array_elements(COALESCE(item->'config'->'tracks', '[{"assetId":"quiet-morning"},{"assetId":"miku"}]'::jsonb)) track
    WHERE c.key = 'desk.configuration' AND item->>'type' = 'record' AND a.key = 'audio.asset.' || (track->>'assetId')
  );
$$;
REVOKE ALL ON FUNCTION public.read_desk_audio() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.read_desk_audio() TO anon, authenticated, service_role;
