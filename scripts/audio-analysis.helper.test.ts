import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  readSpectrum,
  sampleSpectrum,
} from "../src/app/redesign/_components/record-spectrum.helper";
import { analyzeAudio } from "./audio-analysis.helper";

await describe("precomputed record spectra", async () => {
  await it("keeps silence empty and rejects incomplete analysis files", () => {
    const encoded = analyzeAudio(new Float64Array(11025), 11025);
    const data = readSpectrum(encoded.buffer);
    assert.ok(sampleSpectrum(data, 0.5).every((value) => value === 0));
    assert.throws(() => readSpectrum(encoded.buffer.slice(0, -1)));
    assert.throws(() => readSpectrum(new ArrayBuffer(8)));
  });
  await it("places a bass tone in its frequency band and samples using playback time", () => {
    const samples = Float64Array.from({ length: 22050 }, (_, i) =>
      i < 11025 ? Math.sin((2 * Math.PI * 220 * i) / 11025) * 0.8 : 0,
    );
    const data = readSpectrum(analyzeAudio(samples, 11025).buffer);
    const active = sampleSpectrum(data, 0.5);
    const peak = active.indexOf(Math.max(...active));
    assert.ok(peak >= 7 && peak <= 9);
    assert.ok(active[peak] > 0.8);
    assert.ok(active[23] < 0.05);
    assert.ok(sampleSpectrum(data, 1.5).every((value) => value === 0));
    assert.ok(sampleSpectrum(data, 2).every((value) => value === 0));
  });
});
