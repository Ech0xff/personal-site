const miku = {
  id: "miku",
  duration: 223.125,
  src: "/audio/miku.mp3",
  spectrumSrc: "/audio/miku.spectrum.bin",
  title: "Miku feat. Hatsune Miku",
  artist: "Anamanaguchi",
  descriptionSrc: "/audio/miku.vtt",
  sourcePage: "https://anamanaguchi.bandcamp.com/track/miku-feat-hatsune-miku",
} as const;
export const playlist = [
  {
    id: "quiet-morning",
    src: "/audio/quiet-morning.wav",
    spectrumSrc: "/audio/quiet-morning.spectrum.bin",
    title: "A quiet morning",
    artist: "A little melody for this desk",
    duration: 16,
    descriptionSrc: "/audio/quiet-morning.vtt",
    sourcePage: null,
  },
  miku,
] as const;
