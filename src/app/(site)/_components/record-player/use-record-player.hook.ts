"use client";
import { useAtomValue } from "jotai";
import { useCallback, useEffect, useRef, useState } from "react";

import type { AudioTrack } from "#lib/shared/audio/audio.schema";
import { clampPosition } from "#lib/shared/audio/record-session.helper";

import { nextRecordTrack } from "./record-playback.helper";
import { playbackModeAtom } from "./record-preferences.atom";
import { useRecordSession } from "./record-session.hook";

type PlaybackState = "idle" | "loading" | "playing" | "blocked" | "error";
type Intent = "idle" | "playing";
export function useRecordPlayer(playlist: readonly AudioTrack[]) {
  const tracks = useRef(playlist);
  tracks.current = playlist;
  const playbackMode = useAtomValue(playbackModeAtom);
  const audioElements = useRef(new Map<string, HTMLAudioElement>());
  const audioRef = useRef<HTMLAudioElement>(null);
  const intent = useRef<Intent>("idle");
  const request = useRef(0);
  const {
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
  } = useRecordSession(audioRef, playlist);
  const [state, setState] = useState<PlaybackState>("idle");
  const active = state === "loading" || state === "playing";

  const stop = useCallback(() => {
    request.current++;
    intent.current = "idle";
    audioRef.current?.pause();
    capture();
    persist();

    setState("idle");
  }, [capture, persist]);
  const play = async () => {
    const audio = audioRef.current;
    if (!audio || !isReady()) return;
    const id = ++request.current;
    intent.current = "playing";

    setState("loading");
    audio.volume = 0.45;
    if (audio.error) {
      setPendingPosition(getSession().positions[getSession().trackId] ?? 0);
      audio.load();
    }
    try {
      await audio.play();
      if (request.current === id) setState("playing");
    } catch (error) {
      if (request.current !== id) return;
      intent.current = "idle";

      setState(
        error instanceof DOMException && error.name === "NotAllowedError"
          ? "blocked"
          : "error",
      );
    }
  };
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const restore = () => {
      const restored = readSession();
      if (isReady() && restored === getSession()) return;
      request.current++;
      intent.current = "idle";
      audioRef.current?.pause();
      setState("idle");

      setSession(restored);
      const selected =
        tracks.current.find((item) => item.id === restored.trackId) ??
        tracks.current[0];
      const time = restored.positions[selected.id] ?? 0;
      setTrackId(selected.id);
      setPosition(time);
      setDuration(selected.duration);
      setPendingPosition(time);
      setReady(true);
      audioRef.current = audioElements.current.get(selected.id) ?? audio;
      audioRef.current.src = selected.src;
      audioRef.current.load();
    };
    // Native storage subscriptions also reconcile changes from other tabs without autoplay.
    const unsubscribe = subscribeSession(() => {
      if (isReady()) restore();
    });
    restore();
    const onVisibility = () => {
      if (document.hidden) stop();
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", stop);
    return () => {
      // The active element is retained separately from React callback refs for cleanup.
      audioRef.current?.pause();
      capture();
      stop();
      setReady(false);
      unsubscribe();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", stop);
    };
  }, [
    capture,
    stop,
    readSession,
    subscribeSession,
    audioRef,
    getSession,
    setSession,
    isReady,
    setReady,
    getPendingPosition,
    setPendingPosition,
    setTrackId,
    setPosition,
    setDuration,
  ]);

  useEffect(() => {
    if (!isReady()) return;
    const selected =
      playlist.find((item) => item.id === getSession().trackId) ?? playlist[0];
    if (
      selected.id === getSession().trackId &&
      audioRef.current?.getAttribute("src") === selected.src
    )
      return;
    stop();
    const time = getSession().positions[selected.id] ?? 0;
    setSession({ ...getSession(), trackId: selected.id });
    setTrackId(selected.id);
    setPosition(time);
    setDuration(selected.duration);
    setPendingPosition(time);
    audioRef.current = audioElements.current.get(selected.id) ?? null;
    if (audioRef.current) {
      audioRef.current.src = selected.src;
      audioRef.current.load();
    }
    persist();
  }, [
    playlist,
    getSession,
    isReady,
    persist,
    setDuration,
    setPendingPosition,
    setPosition,
    setSession,
    setTrackId,
    stop,
  ]);

  const select = (direction: -1 | 1, fromEnd = false) => {
    if (!isReady() || !audioRef.current) return;
    const nextIntent = intent.current;
    stop();
    const selected = nextRecordTrack(
      playlist,
      getSession().trackId,
      playbackMode,
      direction,
      Math.random(),
    );
    const time = fromEnd ? 0 : (getSession().positions[selected.id] ?? 0);
    setSession({
      ...getSession(),
      trackId: selected.id,
      positions: { ...getSession().positions, [selected.id]: time },
    });
    setTrackId(selected.id);
    setPosition(time);
    setDuration(selected.duration);
    setPendingPosition(time);
    audioRef.current =
      audioElements.current.get(selected.id) ?? audioRef.current;
    audioRef.current.src = selected.src;
    audioRef.current.load();
    persist();
    if (nextIntent !== "idle") void play();
  };
  const seek = (value: number) => {
    const audio = audioRef.current;
    if (!isReady() || !audio) return;
    const time = clampPosition(value, duration);
    setPendingPosition(audio.readyState >= 1 ? null : time);
    if (audio.readyState >= 1) audio.currentTime = time;
    setSession({
      ...getSession(),
      positions: {
        ...getSession().positions,
        [getSession().trackId]: time,
      },
    });
    setPosition(time);
    persist();
  };
  return {
    audioRef,
    bindAudio: (id: string, element: HTMLAudioElement | null) => {
      if (element) {
        audioElements.current.set(id, element);
        if (id === getSession().trackId) audioRef.current = element;
      } else {
        audioElements.current.delete(id);
      }
    },
    state,
    active,
    track,
    position,
    duration,
    seek,
    previous: () => select(-1),
    next: () => select(1),
    toggle: () => {
      if (intent.current === "playing") stop();
      else void play();
    },
    onMetadata: () => {
      const audio = audioRef.current;
      if (!audio || !Number.isFinite(audio.duration)) return;
      setDuration(audio.duration);
      const pending = getPendingPosition();
      if (pending !== null) {
        audio.currentTime = clampPosition(pending, audio.duration);
        setPendingPosition(null);
      }
      capture();
    },
    onTimeUpdate: captureProgress,
    onError: () => {
      if (!audioRef.current?.error) return;
      stop();
      setState("error");
    },
    onEnded: () => {
      const audio = audioRef.current;
      if (!audio || intent.current === "idle") return;
      setSession({
        ...getSession(),
        positions: {
          ...getSession().positions,
          [getSession().trackId]: 0,
        },
      });
      audio.currentTime = 0;
      setPosition(0);
      persist();
      if (playbackMode === "repeat-one") void play();
      else select(1, true);
    },
    onPause: () => {
      const audio = audioRef.current;
      if (audio?.paused && !audio.ended && intent.current !== "idle") stop();
    },
    onWaiting: () => {
      if (intent.current !== "idle") setState("loading");
    },
    onPlaying: () => {
      if (intent.current !== "idle") setState("playing");
      else audioRef.current?.pause();
    },
  };
}
