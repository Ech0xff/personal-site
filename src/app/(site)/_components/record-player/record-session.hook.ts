import { useStore } from "jotai";
import { useCallback, useRef, useState, type RefObject } from "react";

import type { AudioTrack } from "#lib/shared/audio/audio.schema";
import {
  clampPosition,
  normalizeRecordSession,
  defaultRecordSession,
  type RecordSession,
} from "#lib/shared/audio/record-session.helper";

import { recordSessionAtom } from "./record-preferences.atom";

export function useRecordSession(
  audioRef: RefObject<HTMLAudioElement | null>,
  playlist: readonly AudioTrack[],
) {
  const store = useStore();
  const tracks = useRef(playlist);
  tracks.current = playlist;
  const session = useRef(
    normalizeRecordSession(defaultRecordSession, playlist),
  );
  const pendingPosition = useRef<number | null>(null);
  const ready = useRef(false);
  const lastWrite = useRef(0);
  const [trackId, setTrackId] = useState(session.current.trackId);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState<number>(playlist[0].duration);
  const track = playlist.find((item) => item.id === trackId) ?? playlist[0];
  const persist = useCallback(() => {
    if (!ready.current) return;
    session.current = normalizeRecordSession(session.current, tracks.current);
    store.set(recordSessionAtom, session.current);
  }, [store]);
  const capture = useCallback(
    (audio = audioRef.current) => {
      if (
        !ready.current ||
        !audio ||
        pendingPosition.current !== null ||
        audio.readyState < 1
      )
        return;
      const time = clampPosition(audio.currentTime, audio.duration);
      session.current = {
        ...session.current,
        positions: {
          ...session.current.positions,
          [session.current.trackId]: time,
        },
      };
      setPosition(time);
    },
    [audioRef],
  );

  const readSession = useCallback(
    () => normalizeRecordSession(store.get(recordSessionAtom), tracks.current),
    [store],
  );
  const subscribeSession = useCallback(
    (listener: () => void) => store.sub(recordSessionAtom, listener),
    [store],
  );
  const captureProgress = () => {
    capture();
    if (Date.now() - lastWrite.current >= 5000) {
      persist();
      lastWrite.current = Date.now();
    }
  };
  const getSession = useCallback(() => session.current, []);
  const setSession = useCallback((value: RecordSession) => {
    session.current = value;
  }, []);
  const isReady = useCallback(() => ready.current, []);
  const setReady = useCallback((value: boolean) => {
    ready.current = value;
  }, []);
  const getPendingPosition = useCallback(() => pendingPosition.current, []);
  const setPendingPosition = useCallback((value: number | null) => {
    pendingPosition.current = value;
  }, []);
  return {
    getSession,
    setSession,
    isReady,
    setReady,
    getPendingPosition,
    setPendingPosition,
    position,
    setPosition,
    duration,
    setDuration,
    track,
    setTrackId,
    persist,
    capture,
    captureProgress,
    readSession,
    subscribeSession,
  };
}
