"use client";

import { useCallback, useEffect, useState } from "react";

import {
  createTagByBrowser,
  fetchSummaryByBrowser,
  updateTagByBrowser,
} from "@/lib/client/services";
import type { Json, TagWithCount } from "@/types";

type JsonObject = { [key: string]: Json | undefined };

export const useHooks = () => {
  const [tags, setTags] = useState<TagWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const refetch = useCallback(async () => {
    try {
      const data = await fetchSummaryByBrowser();
      setTags(data?.tags ?? []);
      setError(false);
    } catch {
      setTags([]);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTag = useCallback(
    async (input: { meta: JsonObject; name: string }) => {
      await createTagByBrowser(input);
      await refetch();
    },
    [refetch],
  );

  const updateTag = useCallback(
    async (input: { id: string; meta: JsonObject; name: string }) => {
      await updateTagByBrowser(input);
      await refetch();
    },
    [refetch],
  );

  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    tags,
    loading,
    error,
    refetch,
    createTag,
    updateTag,
  };
};
