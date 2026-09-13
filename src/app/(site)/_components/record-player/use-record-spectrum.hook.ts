import { useEffect, useState } from "react";

import { loadSpectrum } from "#lib/client/audio/spectrum.service";
import { type RecordSpectrumData } from "#lib/shared/audio/spectrum.helper";

export function useRecordSpectrum(src: string) {
  const [loaded, setLoaded] = useState<Readonly<{
    src: string;
    data: RecordSpectrumData;
  }> | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      try {
        const data = await loadSpectrum(src, controller.signal);
        if (!controller.signal.aborted) setLoaded({ src, data });
      } catch (error) {
        if (!controller.signal.aborted)
          console.warn("Audio spectrum unavailable", error);
      }
    };
    void load();
    return () => controller.abort();
  }, [src]);
  return loaded?.src === src ? loaded.data : null;
}
