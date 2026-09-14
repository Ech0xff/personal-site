import { useAtom } from "jotai";
import { useLayoutEffect, useRef, useState } from "react";

import { likeDesk, readDeskStats } from "#lib/client/desk/desk.service";
import type { DeskStats } from "#lib/shared/desk/desk.schema";
import { defaultDictionary } from "#lib/shared/dictionary/dictionary.const";

import { deskLikedAtom } from "./stats.atom";
export function useDisplayStats() {
  const [stats, setStats] = useState<DeskStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [liked, setLiked] = useAtom(deskLikedAtom);
  const [pending, setPending] = useState(false);
  const liking = useRef(false);
  const [revision, setRevision] = useState(0);
  useLayoutEffect(() => {
    setLoading(true);
    const controller = new AbortController();
    void readDeskStats(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          setStats(data);
          setNotice("");
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) setNotice(copy.statsUnavailable);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [revision]);
  const like = async () => {
    if (liked || liking.current) return;
    liking.current = true;
    setPending(true);
    try {
      const likes = await likeDesk();
      setLiked(true);
      setStats((previous) => (previous ? { ...previous, likes } : previous));
      setRevision((value) => value + 1);
    } catch {
      setNotice(copy.likeFailed);
    } finally {
      liking.current = false;
      setPending(false);
    }
  };
  return {
    stats,
    loading,
    notice,
    liked,
    pending,
    like,
    retry: () => setRevision((value) => value + 1),
  };
}

const copy = defaultDictionary.desk;
