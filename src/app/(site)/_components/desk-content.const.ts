// All copy and media are local fixtures until the CMS integration phase.
export const profile = {
  name: "Ech0xff",
  greeting: "Hi there",
  role: "A programmer, a gamer, and a curious learner.",
  introduction:
    "I write code, collect little moments, and occasionally turn them into words. This is my small corner of the internet — a place to think out loud and leave a few things behind.",
} as const;
export const navigation = [
  { href: "/", label: "Home" },
  { href: "/posts", label: "Posts" },
  { href: "/thoughts", label: "Thoughts" },
  { href: "/events", label: "Events" },
] as const;
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
export const terminalLines = [
  "whoami\nech0xff — still curious.",
  "const life = {\n  learning: true,\n  coffee: 'always'\n};",
  "cat today.txt\nlearn a little.\nmake something.",
] as const;

export const socialLinks: Readonly<{
  github: string | null;
  email: string | null;
  x: string | null;
  bilibili: string | null;
}> = {
  github: null,
  email: null,
  x: null,
  bilibili: null,
};

export const introGreetings = [
  "Hello",
  "你好",
  "Bonjour",
  "Ciao",
  "Hola",
  "こんにちは",
  "Hallo",
  "Ciallo~",
] as const;
