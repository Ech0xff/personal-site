import {
  readSpectrum,
  type RecordSpectrumData,
} from "#lib/shared/audio/spectrum.helper";
export async function loadSpectrum(
  src: string,
  signal: AbortSignal,
): Promise<RecordSpectrumData> {
  const response = await fetch(src, { signal });
  if (!response.ok)
    throw new Error(`Spectrum request failed: ${response.status}`);
  return readSpectrum(await response.arrayBuffer());
}
