import { z } from "zod";

import { recordConfigSchema } from "../audio/audio.schema";

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
const emptyConfigSchema = z.object({}).strict();

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
  },
  lamp: {
    name: "Lamp",
    configSchema: emptyConfigSchema,
    defaultConfig: {},
  },
  record: {
    name: "Music",
    configSchema: recordConfigSchema,
    defaultConfig: recordConfigSchema.parse({}),
  },
  books: {
    name: "Posts",
    configSchema: booksConfigSchema,
    defaultConfig: {
      eyebrow: "NOTES & OBSERVATIONS",
      title: "Between\nthe lines.",
      author: "WORDS BY ECH0XFF",
    },
  },
  letter: {
    name: "Thoughts",
    configSchema: letterConfigSchema,
    defaultConfig: {
      heading: "THINKING OUT LOUD",
      body: "Small thoughts,\neveryday ramblings,\nand whatever comes to mind.",
      signature: "— notes from my day",
    },
  },
  coffee: {
    name: "Coffee",
    configSchema: emptyConfigSchema,
    defaultConfig: {},
  },
  pencil: {
    name: "Pencil",
    configSchema: emptyConfigSchema,
    defaultConfig: {},
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
  z.object({
    ...identity,
    type: z.literal("lamp"),
    config: emptyConfigSchema,
  }),
  z.object({
    ...identity,
    type: z.literal("record"),
    config: recordConfigSchema,
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
