import { useCallback, useEffect, useState } from "react";

import { fetchEventsByBrowser } from "@/lib/client/services";
import { Event as DashboardEvent, Status } from "@/types";

export const useHooks = () => {
  const [events, setEvents] = useState<DashboardEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const refetch = useCallback(async () => {
    try {
      const data = await fetchEventsByBrowser();
      setEvents(data);
      setError(false);
    } catch {
      setEvents([]);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const syncStatus = (eventId: string, nextStatus: Status) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === eventId ? { ...event, status: nextStatus } : event,
      ),
    );
  };

  const removeEvent = (eventId: string) => {
    setEvents((prevEvents) =>
      prevEvents.filter((event) => event.id !== eventId),
    );
  };

  return {
    events,
    loading,
    error,
    syncStatus,
    removeEvent,
    refetch,
  };
};
