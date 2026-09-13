const miku = {
  id: "miku",
  duration: 223.125,
  src: "/redesign/miku.mp3",
  spectrumSrc: "/redesign/miku.spectrum.bin",
  title: "Miku feat. Hatsune Miku",
  artist: "Anamanaguchi",
  descriptionSrc: "/redesign/miku.vtt",
  sourcePage: "https://anamanaguchi.bandcamp.com/track/miku-feat-hatsune-miku",
} as const;
export const playlist = [
  {
    id: "quiet-morning",
    src: "/redesign/quiet-morning.wav",
    spectrumSrc: "/redesign/quiet-morning.spectrum.bin",
    title: "A quiet morning",
    artist: "A little melody for this desk",
    duration: 16,
    descriptionSrc: "/redesign/quiet-morning.vtt",
    sourcePage: null,
  },
  miku,
] as const;
