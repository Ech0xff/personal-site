import { useEffect, useState } from "react";

import {
  readSpectrum,
  type RecordSpectrumData,
} from "./record-spectrum.helper";

export function useRecordSpectrum(src: string) {
  const [loaded, setLoaded] = useState<Readonly<{
    src: string;
    data: RecordSpectrumData;
  }> | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      try {
        const response = await fetch(src, { signal: controller.signal });
        if (!response.ok)
          throw new Error(`Spectrum request failed: ${response.status}`);
        const data = readSpectrum(await response.arrayBuffer());
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
