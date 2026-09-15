import { useEffect, useRef, useState } from "react";

import {
  startAudioImport,
  uploadAudio,
} from "#lib/client/audio/audio-import.service";
import { readAudioLibrary } from "#lib/server/audio/audio.actions";
import type { AudioAsset } from "#lib/shared/audio/audio.schema";
export function useAudioLibrary(
  onAssets: (assets: readonly AudioAsset[]) => void,
) {
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    let inFlight = false;
    const refresh = async () => {
      if (inFlight || document.hidden) return;
      inFlight = true;
      try {
        const result = await readAudioLibrary();
        if (mounted.current) {
          if (result.ok) onAssets(result.data);
          else setNotice(result.error);
        }
      } catch {
        if (mounted.current) setNotice("Unable to refresh the audio library.");
      } finally {
        inFlight = false;
        if (mounted.current) setLoading(false);
      }
    };
    void refresh();
    const timer = setInterval(() => void refresh(), 3000);
    return () => {
      mounted.current = false;
      clearInterval(timer);
    };
  }, [onAssets]);
  const run = async (operation: () => Promise<string>) => {
    if (busy) return;
    setBusy(true);
    setNotice("");
    try {
      await operation();
      if (mounted.current)
        setNotice(
          "Import started. You can close this editor; processing continues in the background.",
        );
      const result = await readAudioLibrary();
      if (mounted.current && result.ok) onAssets(result.data);
    } catch (error) {
      if (mounted.current)
        setNotice(
          error instanceof Error
            ? error.message
            : "Import failed. Please retry.",
        );
    } finally {
      if (mounted.current) setBusy(false);
    }
  };
  return {
    busy,
    loading,
    notice,
    upload: (file: File) => run(() => uploadAudio(file)),
    importUrl: (url: string) =>
      run(() => startAudioImport({ kind: "url", url })),
    retry: (id: string) => run(() => startAudioImport({ kind: "retry", id })),
  };
}
