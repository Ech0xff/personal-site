import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { file, spawn, which, write } from "bun";

import { playlist } from "../src/app/redesign/_components/desk-content.const";
import { analyzeAudio, readAnalysisPcm } from "./audio-analysis.helper";

const temporary = await mkdtemp(join(tmpdir(), "redesign-spectrum-"));
try {
  for (const track of playlist) {
    const input = `public${track.src}`;
    const wav = join(temporary, `${track.id}.wav`);
    const ffmpeg = which("ffmpeg");
    const afconvert = which("afconvert");
    const command = ffmpeg
      ? [
          ffmpeg,
          "-v",
          "error",
          "-y",
          "-i",
          input,
          "-ac",
          "1",
          "-ar",
          "11025",
          "-c:a",
          "pcm_s16le",
          wav,
        ]
      : afconvert
        ? [afconvert, input, wav, "-f", "WAVE", "-d", "LEI16@11025", "-c", "1"]
        : null;
    if (!command)
      throw new Error(
        "Install FFmpeg to regenerate audio spectra (macOS can also use afconvert).",
      );
    const process = spawn(command, {
      stdout: "inherit",
      stderr: "inherit",
    });
    if ((await process.exited) !== 0)
      throw new Error(`Cannot decode ${track.title}`);
    const { samples, rate } = readAnalysisPcm(
      new Uint8Array(await file(wav).arrayBuffer()),
    );
    const spectrum = analyzeAudio(samples, rate);
    await write(`public${track.spectrumSrc}`, spectrum);
    console.log(
      `${track.title}: ${(samples.length / rate).toFixed(3)}s, ${spectrum.byteLength} spectrum bytes`,
    );
  }
} finally {
  await rm(temporary, { recursive: true, force: true });
}
