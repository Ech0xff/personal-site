BEGIN;

DO $$
DECLARE
  invalid_key TEXT;
  conflicting_key TEXT;
  invalid_value_key TEXT;
  oauth_variant_count INTEGER;
BEGIN
  SELECT key
  INTO invalid_key
  FROM public.configs
  WHERE key ~ '^(aboutMe|playlistUrl|recentPlan|oauthProviders|siteInfo):'
    AND split_part(key, ':', 2) NOT IN ('en-US', 'zh-CN')
  LIMIT 1;

  IF invalid_key IS NOT NULL THEN
    RAISE EXCEPTION 'Unsupported locale in legacy config key: %', invalid_key;
  END IF;

  SELECT legacy.key
  INTO conflicting_key
  FROM public.configs AS legacy
  JOIN public.configs AS target
    ON target.key = CASE split_part(legacy.key, ':', 1)
      WHEN 'aboutMe' THEN 'ABOUT_ME:' || split_part(legacy.key, ':', 2)
      WHEN 'playlistUrl' THEN 'PLAYLIST_URL:' || split_part(legacy.key, ':', 2)
      WHEN 'recentPlan' THEN 'RECENT_PLAN:' || split_part(legacy.key, ':', 2)
      WHEN 'oauthProviders' THEN 'OAUTH'
      WHEN 'siteInfo' THEN 'DICTIONARY:' || split_part(legacy.key, ':', 2)
    END
  WHERE legacy.key ~ '^(aboutMe|playlistUrl|recentPlan|oauthProviders|siteInfo):'
  LIMIT 1;

  IF conflicting_key IS NOT NULL THEN
    RAISE EXCEPTION 'Legacy and new config keys coexist for: %', conflicting_key;
  END IF;

  SELECT key
  INTO invalid_value_key
  FROM public.configs
  WHERE
    (
      key ~ '^(aboutMe|playlistUrl):'
      AND jsonb_typeof(value::jsonb) IS DISTINCT FROM 'string'
    )
    OR (
      key ~ '^(recentPlan|oauthProviders):'
      AND jsonb_typeof(value::jsonb) IS DISTINCT FROM 'array'
    )
    OR (
      key ~ '^siteInfo:'
      AND (
        jsonb_typeof(value::jsonb) IS DISTINCT FROM 'object'
        OR jsonb_typeof(value::jsonb -> 'title') IS DISTINCT FROM 'string'
        OR jsonb_typeof(value::jsonb -> 'hero') IS DISTINCT FROM 'string'
        OR jsonb_typeof(value::jsonb -> 'typing') IS DISTINCT FROM 'array'
        OR jsonb_typeof(value::jsonb -> 'bio') IS DISTINCT FROM 'string'
        OR jsonb_typeof(value::jsonb -> 'filing') IS DISTINCT FROM 'string'
      )
    )
  LIMIT 1;

  IF invalid_value_key IS NOT NULL THEN
    RAISE EXCEPTION 'Invalid legacy config JSON shape: %', invalid_value_key;
  END IF;

  SELECT count(DISTINCT value::jsonb)
  INTO oauth_variant_count
  FROM public.configs
  WHERE key ~ '^oauthProviders:';

  IF oauth_variant_count > 1 THEN
    RAISE EXCEPTION 'Locale OAuth configs differ and cannot be made global automatically';
  END IF;
END
$$;

INSERT INTO public.configs (key, value)
SELECT
  CASE split_part(key, ':', 1)
    WHEN 'aboutMe' THEN 'ABOUT_ME:' || split_part(key, ':', 2)
    WHEN 'playlistUrl' THEN 'PLAYLIST_URL:' || split_part(key, ':', 2)
    WHEN 'recentPlan' THEN 'RECENT_PLAN:' || split_part(key, ':', 2)
  END,
  value
FROM public.configs
WHERE key ~ '^(aboutMe|playlistUrl|recentPlan):';

INSERT INTO public.configs (key, value)
SELECT
  'DICTIONARY:' || split_part(key, ':', 2),
  jsonb_build_object(
    'meta', jsonb_build_object(
      'siteTitle', value::jsonb -> 'title'
    ),
    'home', jsonb_build_object(
      'hero', value::jsonb -> 'hero',
      'typing', value::jsonb -> 'typing',
      'bio', value::jsonb -> 'bio'
    ),
    'footer', jsonb_build_object(
      'filing', value::jsonb -> 'filing'
    )
  )::json
FROM public.configs
WHERE key ~ '^siteInfo:';

INSERT INTO public.configs (key, value)
SELECT 'OAUTH', value
FROM public.configs
WHERE key ~ '^oauthProviders:'
ORDER BY key
LIMIT 1;

DELETE FROM public.configs
WHERE key ~ '^(aboutMe|playlistUrl|recentPlan|oauthProviders|siteInfo):';

COMMIT;
