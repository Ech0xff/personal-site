import { useCallback, useEffect, useState } from "react";

import { fetchPostsByBrowser } from "@/lib/client/services";
import { Post, Status } from "@/types";

export const useHooks = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const refetch = useCallback(async () => {
    try {
      const data = await fetchPostsByBrowser();
      setPosts(data);
      setError(false);
    } catch {
      setPosts([]);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const syncStatus = useCallback((postId: string, newStatus: Status) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, status: newStatus } : post,
      ),
    );
  }, []);

  const removePost = useCallback((postId: string) => {
    setPosts((prev) => prev.filter((post) => post.id !== postId));
  }, []);

  return {
    posts,
    loading,
    error,
    setLoading,
    syncStatus,
    removePost,
    refetch,
  };
};
