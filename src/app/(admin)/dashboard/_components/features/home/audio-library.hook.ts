import { useEffect, useRef, useState } from "react";

import {
  startAudioImport,
  uploadAudio,
} from "#lib/client/audio/audio-import.service";
import { readAudioLibrary } from "#lib/server/audio/audio.actions";
import type { ActionResult } from "#lib/shared/actions/action.type";
import type { AudioAsset } from "#lib/shared/audio/audio.schema";

export function useAudioLibrary(
  assets: readonly AudioAsset[],
  onAssets: (assets: readonly AudioAsset[]) => void,
  onBusy: (busy: boolean) => void,
) {
  const [busy, setBusy] = useState(false);
  const [pendingRefresh, setPendingRefresh] = useState(false);
  const [notice, setNotice] = useState("");
  const [refreshNotice, setRefreshNotice] = useState("");
  const [unauthorized, setUnauthorized] = useState(false);
  const mounted = useRef(true);
  const hasJobs = assets.some(
    (asset) =>
      ["pending", "processing"].includes(asset.status) ||
      (asset.status === "ready" &&
        ["pending", "processing"].includes(asset.spectrumStatus)),
  );
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  useEffect(() => {
    if (busy || (!pendingRefresh && !hasJobs)) return;
    let active = true;
    let inFlight = false;
    const refresh = async () => {
      if (inFlight || document.hidden) return;
      inFlight = true;
      try {
        const result = await readAudioLibrary();
        if (active) {
          if (result.ok) {
            onAssets(result.data);
            setPendingRefresh(false);
            setRefreshNotice("");
            setUnauthorized(false);
          } else {
            setPendingRefresh(true);
            setRefreshNotice(result.error);
            setUnauthorized(Boolean(result.unauthorized));
          }
        }
      } catch {
        if (active) {
          setPendingRefresh(true);
          setRefreshNotice("Unable to refresh the audio library. Retrying…");
        }
      } finally {
        inFlight = false;
      }
    };
    if (pendingRefresh) void refresh();
    const timer = setInterval(() => void refresh(), 3000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [busy, hasJobs, pendingRefresh, onAssets]);
  const run = async (operation: () => Promise<ActionResult<string>>) => {
    if (busy) return;
    setBusy(true);
    setPendingRefresh(true);
    onBusy(true);
    setNotice("");
    setRefreshNotice("");
    setUnauthorized(false);
    try {
      const imported = await operation();
      if (!imported.ok) {
        if (mounted.current) {
          setNotice(imported.error);
          setUnauthorized(Boolean(imported.unauthorized));
        }
        return;
      }
      if (mounted.current)
        setNotice(
          "Import started. Processing continues in the background. Add the ready recording to your playlist, then save the homepage.",
        );
    } catch (error) {
      if (mounted.current)
        setNotice(
          error instanceof Error
            ? error.message
            : "Import failed. Please retry.",
        );
    } finally {
      if (mounted.current) setBusy(false);
      onBusy(false);
    }
  };
  return {
    busy,
    notice: refreshNotice || notice,
    unauthorized,
    upload: (file: File) => run(() => uploadAudio(file)),
    importUrl: (url: string) =>
      run(() => startAudioImport({ kind: "url", url })),
    retry: (id: string) => run(() => startAudioImport({ kind: "retry", id })),
  };
}
