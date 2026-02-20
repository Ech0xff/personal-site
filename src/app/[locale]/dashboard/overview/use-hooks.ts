import { useCallback, useEffect, useMemo, useState } from "react";

import { Calendar, Eye, FileText, MessageCircle } from "lucide-react";

import { fetchSummaryByBrowser } from "@/lib/client/services";
import { BlogSummaryData } from "@/types";

export const useHooks = () => {
  const [summaryData, setSummaryData] = useState<BlogSummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const refetch = useCallback(async () => {
    try {
      const data = await fetchSummaryByBrowser(5);
      setSummaryData(data);
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const stats = useMemo(
    () => [
      {
        label: "Total Posts",
        value:
          (summaryData?.statistics.posts.show.count ?? 0) +
            (summaryData?.statistics.posts.hide.count ?? 0) || "—",
        icon: FileText,
      },
      {
        label: "Total Thoughts",
        value:
          (summaryData?.statistics.thoughts.show.count ?? 0) +
            (summaryData?.statistics.thoughts.hide.count ?? 0) || "—",
        icon: MessageCircle,
      },
      {
        label: "Total Events",
        value:
          (summaryData?.statistics.events.show.count ?? 0) +
            (summaryData?.statistics.events.hide.count ?? 0) || "—",
        icon: Calendar,
      },
      {
        label: "Total Characters",
        value:
          (
            (summaryData?.statistics.posts.show.characters ?? 0) +
            (summaryData?.statistics.posts.hide.characters ?? 0) +
            (summaryData?.statistics.thoughts.show.characters ?? 0) +
            (summaryData?.statistics.thoughts.hide.characters ?? 0) +
            (summaryData?.statistics.events.show.characters ?? 0) +
            (summaryData?.statistics.events.hide.characters ?? 0)
          ).toLocaleString() || "—",
        icon: Eye,
      },
    ],
    [summaryData],
  );

  return {
    loading,
    error,
    stats,
    refetch,
  };
};
