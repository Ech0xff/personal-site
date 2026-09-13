import { z } from "zod";

const headerSchema = z.object({
  fps: z.number().int().min(1).max(120),
  bands: z.number().int().min(1).max(128),
  frames: z.number().int().positive(),
  duration: z.number().finite().positive(),
});
export type RecordSpectrumData = Readonly<
  z.infer<typeof headerSchema> & { samples: Uint8Array }
>;

export function readSpectrum(buffer: ArrayBuffer): RecordSpectrumData {
  if (buffer.byteLength < 16) throw new Error("Incomplete audio spectrum");
  const view = new DataView(buffer);
  if (view.getUint32(0) !== 0x53503031)
    throw new Error("Unsupported audio spectrum");
  const header = headerSchema.parse({
    fps: view.getUint16(4, true),
    bands: view.getUint16(6, true),
    frames: view.getUint32(8, true),
    duration: view.getFloat32(12, true),
  });
  if (buffer.byteLength !== 16 + header.frames * header.bands)
    throw new Error("Invalid spectrum frame count");
  return { ...header, samples: new Uint8Array(buffer, 16) };
}

export function sampleSpectrum(
  data: RecordSpectrumData,
  seconds: number,
): readonly number[] {
  if (!Number.isFinite(seconds) || seconds < 0 || seconds >= data.duration)
    return Array.from({ length: data.bands }, () => 0);
  const position = Math.min(data.frames - 1, seconds * data.fps);
  const frame = Math.floor(position);
  const next = Math.min(frame + 1, data.frames - 1);
  const mix = position - frame;
  return Array.from({ length: data.bands }, (_, band) => {
    const start = data.samples[frame * data.bands + band];
    const end = data.samples[next * data.bands + band];
    return (start + (end - start) * mix) / 255;
  });
}
