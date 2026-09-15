-- Audio assets remain independent of the saved desk configuration.
CREATE TABLE IF NOT EXISTS public.audio_assets (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '',
  artist TEXT NOT NULL DEFAULT '',
  source_path TEXT,
  source_url TEXT,
  src TEXT,
  duration DOUBLE PRECISION CHECK (duration > 0 AND duration <= 900),
  spectrum_src TEXT,
  description_src TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('uploading','pending','processing','ready','failed')),
  spectrum_status TEXT NOT NULL DEFAULT 'pending' CHECK (spectrum_status IN ('pending','processing','ready','failed')),
  error TEXT,
  run_id UUID,
  started_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.audio_assets ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.audio_assets FROM anon, authenticated;
GRANT ALL ON public.audio_assets TO service_role;

INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('audio', 'audio', true, 52428800) ON CONFLICT (id) DO NOTHING;

-- Idempotent compatibility records for configurations saved before audio editing.
INSERT INTO public.audio_assets (id,title,artist,src,duration,spectrum_src,description_src,status,spectrum_status)
VALUES
('quiet-morning','A quiet morning','A little melody for this desk','/redesign/quiet-morning.wav',16,'/redesign/quiet-morning.spectrum.bin','/redesign/quiet-morning.vtt','ready','ready'),
('miku','Miku feat. Hatsune Miku','Anamanaguchi','/redesign/miku.mp3',223.125,'/redesign/miku.spectrum.bin','/redesign/miku.vtt','ready','ready')
ON CONFLICT (id) DO NOTHING;

DROP FUNCTION IF EXISTS public.read_published_desk_audio();
CREATE OR REPLACE FUNCTION public.read_desk_audio()
RETURNS TABLE (id TEXT, title TEXT, artist TEXT, src TEXT, duration DOUBLE PRECISION, spectrum_src TEXT, description_src TEXT)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT a.id,a.title,a.artist,a.src,a.duration,a.spectrum_src,a.description_src
  FROM public.audio_assets a
  WHERE a.status = 'ready' AND EXISTS (
    SELECT 1 FROM public.configs c,
    LATERAL jsonb_array_elements(COALESCE(c.value::jsonb->'items', '[{"type":"record","config":{}}]'::jsonb)) item,
    LATERAL jsonb_array_elements(COALESCE(item->'config'->'tracks', '[{"assetId":"quiet-morning"},{"assetId":"miku"}]'::jsonb)) track
    WHERE c.key = 'desk.configuration' AND item->>'type' = 'record' AND track->>'assetId' = a.id
  );
$$;
REVOKE ALL ON FUNCTION public.read_desk_audio() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.read_desk_audio() TO anon, authenticated, service_role;
