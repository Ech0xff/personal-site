/** Creates an original, deterministic ambient loop; no recordings or samples. */
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
const sampleRate = 22050;
const duration = 16;
const samples = new Float64Array(sampleRate * duration);
const chords = [
  [48, 55, 59, 64],
  [45, 52, 55, 60],
  [41, 48, 52, 57],
  [43, 50, 53, 59],
];
const frequency = (midi: number) => 440 * 2 ** ((midi - 69) / 12);
// Wrap note tails to the start of the buffer for a continuous loop.
for (const [chordIndex, chord] of chords.entries()) {
  for (const [noteIndex, note] of chord.entries()) {
    const start = chordIndex * 4 + noteIndex * 0.45;
    for (let i = 0; i < sampleRate * 6; i++) {
      const t = i / sampleRate;
      const envelope =
        (1 - Math.exp(-t * 24)) *
        Math.exp(-t * 1.05) *
        Math.min(1, (6 - t) * 2);
      const phase = 2 * Math.PI * frequency(note + 12) * t;
      const tone =
        Math.sin(phase) +
        0.18 * Math.sin(phase * 2) +
        0.045 * Math.sin(phase * 3);
      const index = (Math.round(start * sampleRate) + i) % samples.length;
      samples[index] += tone * envelope * 0.16;
    }
  }
}
const wav = Buffer.alloc(44 + samples.length * 2);
wav.write("RIFF", 0);
wav.writeUInt32LE(wav.length - 8, 4);
wav.write("WAVEfmt ", 8);
wav.writeUInt32LE(16, 16);
wav.writeUInt16LE(1, 20);
wav.writeUInt16LE(1, 22);
wav.writeUInt32LE(sampleRate, 24);
wav.writeUInt32LE(sampleRate * 2, 28);
wav.writeUInt16LE(2, 32);
wav.writeUInt16LE(16, 34);
wav.write("data", 36);
wav.writeUInt32LE(samples.length * 2, 40);
for (const [index, value] of samples.entries())
  wav.writeInt16LE(Math.round(Math.tanh(value) * 24000), 44 + index * 2);
const output = new URL("../public/redesign/quiet-morning.wav", import.meta.url);
await mkdir(new URL(".", output), { recursive: true });
await writeFile(output, wav);
console.log(
  `Created ${fileURLToPath(output)} (${duration}s, ${wav.length} bytes)`,
);
