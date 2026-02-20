import { useCallback, useEffect, useState } from "react";

import { fetchThoughtsByBrowser } from "@/lib/client/services";
import { Status, Thought } from "@/types";

export const useHooks = () => {
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const refetch = useCallback(async () => {
    try {
      const data = await fetchThoughtsByBrowser();
      setThoughts(data);
      setError(false);
    } catch {
      setThoughts([]);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const syncStatus = (thoughtId: string, nextStatus: Status) => {
    setThoughts((prev) =>
      prev.map((thought) =>
        thought.id === thoughtId ? { ...thought, status: nextStatus } : thought,
      ),
    );
  };

  const removeThought = (thoughtId: string) => {
    setThoughts((prev) => prev.filter((thought) => thought.id !== thoughtId));
  };

  return {
    thoughts,
    loading,
    error,
    syncStatus,
    removeThought,
    refetch,
  };
};
