import { z } from "zod";

const text = z.string().max(4000);
const webLink = z
  .url({ protocol: /^https?$/ })
  .max(2048)
  .nullable();
export const displayConfigSchema = z.object({
  terminalLines: z.array(text).min(1).max(30),
});
export const introConfigSchema = z.object({
  name: text,
  greeting: text,
  role: text,
  introduction: text,
  links: z.object({
    github: webLink,
    email: z
      .url({ protocol: /^mailto$/ })
      .max(2048)
      .nullable(),
    x: webLink,
    bilibili: webLink,
  }),
});
const booksConfigSchema = z.object({
  eyebrow: text,
  title: text,
  author: text,
});
const letterConfigSchema = z.object({
  heading: text,
  body: text,
  signature: text,
});
const calendarConfigSchema = z.object({
  heading: text,
  month: text,
  day: text,
  caption: text,
});
const emptyConfigSchema = z.object({}).strict();
const movable = { draggable: true, resizable: true } as const;
const fixed = { draggable: false, resizable: false } as const;

export const deskItemDefinitions = {
  display: {
    name: "Display",
    configSchema: displayConfigSchema,
    defaultConfig: {
      terminalLines: [
        "whoami\nech0xff — still curious.",
        "const life = {\n  learning: true,\n  coffee: 'always'\n};",
        "cat today.txt\nlearn a little.\nmake something.",
      ],
    },
    capabilities: movable,
    width: 300,
    height: 386,
    padding: 18,
    minScale: 0.8,
    maxScale: 1.3,
  },
  intro: {
    name: "Introduction",
    configSchema: introConfigSchema,
    defaultConfig: {
      name: "Ech0xff",
      greeting: "Hi there",
      role: "A programmer, a gamer, and a curious learner.",
      introduction:
        "I write code, collect little moments, and occasionally turn them into words. This is my small corner of the internet — a place to think out loud and leave a few things behind.",
      links: { github: null, email: null, x: null, bilibili: null },
    },
    capabilities: fixed,
    width: 560,
    height: 320,
    padding: 0,
    minScale: 1,
    maxScale: 1,
  },
  lamp: {
    name: "Lamp",
    configSchema: emptyConfigSchema,
    defaultConfig: {},
    capabilities: fixed,
    width: 120,
    height: 120,
    padding: 0,
    minScale: 1,
    maxScale: 1,
  },
  record: {
    name: "Music",
    configSchema: emptyConfigSchema,
    defaultConfig: {},
    capabilities: movable,
    width: 320,
    height: 340,
    padding: 18,
    minScale: 0.8,
    maxScale: 1.3,
  },
  books: {
    name: "Posts",
    configSchema: booksConfigSchema,
    defaultConfig: {
      eyebrow: "NOTES & OBSERVATIONS",
      title: "Between\nthe lines.",
      author: "WORDS BY ECH0XFF",
    },
    capabilities: movable,
    width: 214,
    height: 244,
    padding: 25,
    minScale: 0.8,
    maxScale: 1.4,
  },
  letter: {
    name: "Thoughts",
    configSchema: letterConfigSchema,
    defaultConfig: {
      heading: "THINKING OUT LOUD",
      body: "Small thoughts,\neveryday ramblings,\nand whatever comes to mind.",
      signature: "— notes from my day",
    },
    capabilities: movable,
    width: 260,
    height: 244,
    padding: 24,
    minScale: 0.8,
    maxScale: 1.4,
  },
  calendar: {
    name: "Events",
    configSchema: calendarConfigSchema,
    defaultConfig: {
      heading: "LIFE LATELY",
      month: "SEPTEMBER",
      day: "12",
      caption: "one day at a time.",
    },
    capabilities: movable,
    width: 125,
    height: 170,
    padding: 20,
    minScale: 0.8,
    maxScale: 1.4,
  },
  coffee: {
    name: "Coffee",
    configSchema: emptyConfigSchema,
    defaultConfig: {},
    capabilities: movable,
    width: 145,
    height: 130,
    padding: 20,
    minScale: 0.7,
    maxScale: 1.5,
  },
  pencil: {
    name: "Pencil",
    configSchema: emptyConfigSchema,
    defaultConfig: {},
    capabilities: movable,
    width: 118,
    height: 35,
    padding: 8,
    minScale: 0.7,
    maxScale: 1.5,
  },
} as const;
const identity = {
  id: z.string().min(1).max(100),
  name: z.string().min(1).max(80),
};
export const deskItemSchema = z.discriminatedUnion("type", [
  z.object({
    ...identity,
    type: z.literal("display"),
    config: displayConfigSchema,
  }),
  z.object({
    ...identity,
    type: z.literal("intro"),
    config: introConfigSchema,
  }),
  z.object({ ...identity, type: z.literal("lamp"), config: emptyConfigSchema }),
  z.object({
    ...identity,
    type: z.literal("record"),
    config: emptyConfigSchema,
  }),
  z.object({
    ...identity,
    type: z.literal("books"),
    config: booksConfigSchema,
  }),
  z.object({
    ...identity,
    type: z.literal("letter"),
    config: letterConfigSchema,
  }),
  z.object({
    ...identity,
    type: z.literal("calendar"),
    config: calendarConfigSchema,
  }),
  z.object({
    ...identity,
    type: z.literal("coffee"),
    config: emptyConfigSchema,
  }),
  z.object({
    ...identity,
    type: z.literal("pencil"),
    config: emptyConfigSchema,
  }),
]);
export type DeskItem = z.infer<typeof deskItemSchema>;
export type DeskItemType = DeskItem["type"];
export type IntroConfig = z.infer<typeof introConfigSchema>;
