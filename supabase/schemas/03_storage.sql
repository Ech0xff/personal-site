-- Storage remains the source of truth; the standard list endpoint only supports
-- path prefixes and omits user metadata needed to display original filenames.
CREATE FUNCTION public.list_files(search_query TEXT DEFAULT '', page_index INTEGER DEFAULT 0, sort_by TEXT DEFAULT 'time', sort_direction TEXT DEFAULT 'desc')
RETURNS TABLE (id UUID, path TEXT, name TEXT, size BIGINT, type TEXT, created_at TIMESTAMPTZ, total_count BIGINT, total_size BIGINT)
LANGUAGE sql STABLE SECURITY INVOKER SET search_path = ''
AS $$
  WITH files AS (
    SELECT
      objects.id,
      objects.name AS path,
      COALESCE(objects.user_metadata->>'originalName', regexp_replace(objects.name, '^[0-9a-f-]{36}-', '')) AS name,
      COALESCE((objects.metadata->>'size')::BIGINT, 0) AS size,
      COALESCE(objects.metadata->>'mimetype', 'application/octet-stream') AS type,
      objects.created_at
    FROM storage.objects
    WHERE objects.bucket_id = 'files'
  )
  SELECT *, count(*) OVER (), sum(files.size) OVER ()::BIGINT FROM files
  WHERE strpos(lower(files.name), lower(COALESCE(search_query, ''))) > 0
  ORDER BY
    CASE WHEN sort_by = 'size' AND sort_direction = 'asc' THEN files.size END ASC,
    CASE WHEN sort_by = 'size' AND sort_direction <> 'asc' THEN files.size END DESC,
    CASE WHEN sort_by <> 'size' AND sort_direction = 'asc' THEN files.created_at END ASC,
    CASE WHEN sort_by <> 'size' AND sort_direction <> 'asc' THEN files.created_at END DESC,
    files.path
  LIMIT 31 OFFSET LEAST(GREATEST(COALESCE(page_index, 0), 0), 100000) * 30;
$$;
REVOKE ALL ON FUNCTION public.list_files(TEXT, INTEGER, TEXT, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.list_files(TEXT, INTEGER, TEXT, TEXT) TO service_role;
