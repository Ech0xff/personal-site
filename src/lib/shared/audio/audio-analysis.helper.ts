/** Decode the little-endian, mono PCM16 WAV produced by the analysis command. */
export function readAnalysisPcm(bytes: Uint8Array) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const text = (offset: number) =>
    String.fromCharCode(...bytes.subarray(offset, offset + 4));
  if (text(0) !== "RIFF" || text(8) !== "WAVE")
    throw new Error("Expected a WAV file");
  let rate = 0;
  for (let offset = 12; offset + 8 <= bytes.length;) {
    const size = view.getUint32(offset + 4, true);
    const start = offset + 8;
    if (start + size > bytes.length) throw new Error("Incomplete WAV chunk");
    if (text(offset) === "fmt ") {
      if (
        size < 16 ||
        view.getUint16(start, true) !== 1 ||
        view.getUint16(start + 2, true) !== 1 ||
        view.getUint16(start + 14, true) !== 16
      )
        throw new Error("Expected mono PCM16 audio");
      rate = view.getUint32(start + 4, true);
    }
    if (text(offset) === "data") {
      if (!rate) throw new Error("Missing WAV format");
      return {
        rate,
        samples: Float64Array.from(
          { length: Math.floor(size / 2) },
          (_, index) => view.getInt16(start + index * 2, true) / 32768,
        ),
      };
    }
    offset = start + size + (size % 2);
  }
  throw new Error("Missing WAV samples");
}

/** Radix-2 FFT over a Hann window; all mutation stays inside the analysis operation. */
function magnitudes(samples: Float64Array, start: number, size: number) {
  const real = Float64Array.from(
    { length: size },
    (_, i) =>
      (samples[start + i] ?? 0) *
      (0.5 - 0.5 * Math.cos((2 * Math.PI * i) / (size - 1))),
  );
  const imaginary = new Float64Array(size);
  for (let i = 1, j = 0; i < size; i++) {
    let bit = size >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) [real[i], real[j]] = [real[j], real[i]];
  }
  for (let length = 2; length <= size; length *= 2) {
    const half = length / 2;
    for (let start = 0; start < size; start += length) {
      for (let i = 0; i < half; i++) {
        const angle = (-2 * Math.PI * i) / length;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const a = start + i;
        const b = a + half;
        const re = real[b] * cos - imaginary[b] * sin;
        const im = real[b] * sin + imaginary[b] * cos;
        real[b] = real[a] - re;
        imaginary[b] = imaginary[a] - im;
        real[a] += re;
        imaginary[a] += im;
      }
    }
  }
  return Float64Array.from(
    { length: size / 2 },
    (_, i) => (Math.hypot(real[i], imaginary[i]) * 4) / size,
  );
}

export function analyzeAudio(
  samples: Float64Array,
  rate: number,
): Uint8Array<ArrayBuffer> {
  const fps = 30;
  const bands = 24;
  const size = 1024;
  const frames = Math.ceil((samples.length / rate) * fps);
  const result = new Uint8Array(16 + frames * bands);
  const header = new DataView(result.buffer);
  header.setUint32(0, 0x53503031);
  header.setUint16(4, fps, true);
  header.setUint16(6, bands, true);
  header.setUint32(8, frames, true);
  header.setFloat32(12, samples.length / rate, true);
  const edges = Array.from({ length: bands + 1 }, (_, i) =>
    Math.max(1, Math.round((45 * (5000 / 45) ** (i / bands) * size) / rate)),
  );
  for (let frame = 0; frame < frames; frame++) {
    const spectrum = magnitudes(
      samples,
      Math.round((frame / fps) * rate) - size / 2,
      size,
    );
    for (let band = 0; band < bands; band++) {
      let peak = 0;
      for (
        let bin = edges[band];
        bin < Math.max(edges[band] + 1, edges[band + 1]);
        bin++
      )
        peak = Math.max(peak, spectrum[bin] ?? 0);
      const level = Math.max(
        0,
        Math.min(1, (20 * Math.log10(Math.max(peak, 1e-6)) + 65) / 65),
      );
      result[16 + frame * bands + band] = Math.round(level * 255);
    }
  }
  return result;
}
