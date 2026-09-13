"use client";
import { useAtomValue, useStore } from "jotai";
import { useCallback, useEffect, useRef, useState } from "react";

import { playlist } from "./desk-content.const";
import { playbackModeAtom, recordSessionAtom } from "./desk-preferences.atom";
import { nextRecordTrack } from "./record-playback.helper";
import { clampPosition, defaultRecordSession } from "./record-session.helper";

type PlaybackState = "idle" | "loading" | "playing" | "blocked" | "error";
type Intent = "idle" | "playing";
export function useRecordPlayer() {
  const store = useStore();
  const playbackMode = useAtomValue(playbackModeAtom);
  const audioElements = useRef(new Map<string, HTMLAudioElement>());
  const audioRef = useRef<HTMLAudioElement>(null);
  const intent = useRef<Intent>("idle");
  const request = useRef(0);
  const session = useRef(defaultRecordSession);
  const pendingPosition = useRef<number | null>(null);
  const lastWrite = useRef(0);
  const ready = useRef(false);
  const [trackId, setTrackId] = useState(defaultRecordSession.trackId);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState<number>(playlist[0].duration);
  const [state, setState] = useState<PlaybackState>("idle");
  const [active, setActive] = useState(false);
  const track = playlist.find((item) => item.id === trackId) ?? playlist[0];

  const persist = useCallback(() => {
    if (!ready.current) return;
    store.set(recordSessionAtom, session.current);
  }, [store]);
  const capture = useCallback((audio = audioRef.current) => {
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
  }, []);
  const stop = useCallback(() => {
    request.current++;
    intent.current = "idle";
    audioRef.current?.pause();
    capture();
    persist();
    setActive(false);
    setState("idle");
  }, [capture, persist]);
  const play = async () => {
    const audio = audioRef.current;
    if (!audio || !ready.current) return;
    const id = ++request.current;
    intent.current = "playing";
    setActive(true);
    setState("loading");
    audio.volume = 0.45;
    if (audio.error) {
      pendingPosition.current =
        session.current.positions[session.current.trackId] ?? 0;
      audio.load();
    }
    try {
      await audio.play();
      if (request.current === id) setState("playing");
    } catch (error) {
      if (request.current !== id) return;
      intent.current = "idle";
      setActive(false);
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
      const restored = store.get(recordSessionAtom);
      if (ready.current && restored === session.current) return;
      request.current++;
      intent.current = "idle";
      audioRef.current?.pause();
      setState("idle");
      setActive(false);
      session.current = restored;
      const selected =
        playlist.find((item) => item.id === restored.trackId) ?? playlist[0];
      const time = restored.positions[selected.id] ?? 0;
      setTrackId(selected.id);
      setPosition(time);
      setDuration(selected.duration);
      pendingPosition.current = time;
      ready.current = true;
      audioRef.current = audioElements.current.get(selected.id) ?? audio;
      audioRef.current.src = selected.src;
      audioRef.current.load();
    };
    // Native storage subscriptions also reconcile changes from other tabs without autoplay.
    const unsubscribe = store.sub(recordSessionAtom, () => {
      if (ready.current) restore();
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
      ready.current = false;
      unsubscribe();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", stop);
    };
  }, [capture, stop, store]);

  const select = (direction: -1 | 1, fromEnd = false) => {
    if (!ready.current || !audioRef.current) return;
    const nextIntent = intent.current;
    stop();
    const selected = nextRecordTrack(
      session.current.trackId,
      playbackMode,
      direction,
      Math.random(),
    );
    const time = fromEnd ? 0 : (session.current.positions[selected.id] ?? 0);
    session.current = {
      ...session.current,
      trackId: selected.id,
      positions: { ...session.current.positions, [selected.id]: time },
    };
    setTrackId(selected.id);
    setPosition(time);
    setDuration(selected.duration);
    pendingPosition.current = time;
    audioRef.current =
      audioElements.current.get(selected.id) ?? audioRef.current;
    audioRef.current.src = selected.src;
    audioRef.current.load();
    persist();
    if (nextIntent !== "idle") void play();
  };
  const seek = (value: number) => {
    const audio = audioRef.current;
    if (!ready.current || !audio) return;
    const time = clampPosition(value, duration);
    pendingPosition.current = audio.readyState >= 1 ? null : time;
    if (audio.readyState >= 1) audio.currentTime = time;
    session.current = {
      ...session.current,
      positions: {
        ...session.current.positions,
        [session.current.trackId]: time,
      },
    };
    setPosition(time);
    persist();
  };
  return {
    audioRef,
    bindAudio: (id: string, element: HTMLAudioElement | null) => {
      if (element) {
        audioElements.current.set(id, element);
        if (id === session.current.trackId) audioRef.current = element;
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
      if (pendingPosition.current !== null) {
        audio.currentTime = clampPosition(
          pendingPosition.current,
          audio.duration,
        );
        pendingPosition.current = null;
      }
      capture();
    },
    onTimeUpdate: () => {
      capture();
      if (Date.now() - lastWrite.current >= 5000) {
        persist();
        lastWrite.current = Date.now();
      }
    },
    onError: () => {
      if (!audioRef.current?.error) return;
      stop();
      setState("error");
    },
    onEnded: () => {
      const audio = audioRef.current;
      if (!audio || intent.current === "idle") return;
      session.current = {
        ...session.current,
        positions: {
          ...session.current.positions,
          [session.current.trackId]: 0,
        },
      };
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
