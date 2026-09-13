export const profile = {
  name: "Ech0xff",
  greeting: "Hi there",
  role: "A programmer, a gamer, and a curious learner.",
  introduction:
    "I write code, collect little moments, and occasionally turn them into words. This is my small corner of the internet — a place to think out loud and leave a few things behind.",
} as const;
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
