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
const movable = { draggable: true, resizable: true } as const;
const fixed = { draggable: false, resizable: false } as const;

export const deskItemDefinitions = {
  display: {
    appearance: {
      rotation: -4,
      offsetX: 0,
      offsetY: 0,
      hoverRotation: 0,
      hoverX: 0,
      hoverY: 0,
      hoverScale: 1,
    },
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
    width: 420,
    height: 306,
    padding: 18,
    minScale: 0.8,
    maxScale: 1.3,
  },
  intro: {
    appearance: {
      rotation: 0,
      offsetX: 0,
      offsetY: 0,
      hoverRotation: 0,
      hoverX: 0,
      hoverY: 0,
      hoverScale: 1,
    },
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
    padding: 24,
    minScale: 1,
    maxScale: 1,
  },
  lamp: {
    appearance: {
      rotation: 0,
      offsetX: 0,
      offsetY: 0,
      hoverRotation: 0,
      hoverX: 0,
      hoverY: 0,
      hoverScale: 1,
    },
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
    appearance: {
      rotation: -3,
      offsetX: 0,
      offsetY: 0,
      hoverRotation: 0,
      hoverX: 0,
      hoverY: 0,
      hoverScale: 1.02,
    },
    name: "Music",
    configSchema: recordConfigSchema,
    defaultConfig: recordConfigSchema.parse({}),
    capabilities: movable,
    width: 320,
    height: 340,
    padding: 18,
    minScale: 0.8,
    maxScale: 1.3,
  },
  books: {
    appearance: {
      rotation: 5,
      offsetX: 0,
      offsetY: 0,
      hoverRotation: 1,
      hoverX: 0,
      hoverY: -5,
      hoverScale: 1,
    },
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
    appearance: {
      rotation: -8,
      offsetX: 0,
      offsetY: 0,
      hoverRotation: -3,
      hoverX: 0,
      hoverY: 0,
      hoverScale: 1,
    },
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
  coffee: {
    appearance: {
      rotation: 13,
      offsetX: 0,
      offsetY: 0,
      hoverRotation: 13,
      hoverX: 0,
      hoverY: 0,
      hoverScale: 1,
    },
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
    appearance: {
      rotation: 0,
      offsetX: 0,
      offsetY: 0,
      hoverRotation: 0,
      hoverX: 0,
      hoverY: 0,
      hoverScale: 1,
    },
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
export const deskAppearanceSchema = z
  .object({
    draggable: z.boolean().optional(),
    rotation: z.number().finite().min(-180).max(180),
    offsetX: z.number().finite().min(-48).max(48),
    offsetY: z.number().finite().min(-48).max(48),
    hoverRotation: z.number().finite().min(-180).max(180),
    hoverX: z.number().finite().min(-48).max(48),
    hoverY: z.number().finite().min(-48).max(48),
    hoverScale: z.number().finite().min(0.5).max(2),
    minScale: z.number().finite().min(0.5).max(2),
    maxScale: z.number().finite().min(0.5).max(2),
  })
  .refine((value) => value.minScale <= value.maxScale, {
    path: ["maxScale"],
    message: "Maximum scale must be at least the minimum scale.",
  });
export type DeskAppearance = z.infer<typeof deskAppearanceSchema> & {
  draggable: boolean;
};
export function defaultDeskAppearance(
  type: keyof typeof deskItemDefinitions,
): DeskAppearance {
  const definition = deskItemDefinitions[type];
  return {
    draggable: definition.capabilities.draggable,
    ...definition.appearance,
    minScale: definition.minScale,
    maxScale: definition.maxScale,
  };
}
const identity = (type: keyof typeof deskItemDefinitions) => ({
  id: z.string().min(1).max(100),
  name: z.string().min(1).max(80),
  appearance: deskAppearanceSchema
    .prefault(() => defaultDeskAppearance(type))
    .transform((value) => ({
      ...value,
      draggable:
        value.draggable ?? deskItemDefinitions[type].capabilities.draggable,
    })),
});
export const deskItemSchema = z.discriminatedUnion("type", [
  z.object({
    ...identity("display"),
    type: z.literal("display"),
    config: displayConfigSchema,
  }),
  z.object({
    ...identity("intro"),
    type: z.literal("intro"),
    config: introConfigSchema,
  }),
  z.object({
    ...identity("lamp"),
    type: z.literal("lamp"),
    config: emptyConfigSchema,
  }),
  z.object({
    ...identity("record"),
    type: z.literal("record"),
    config: recordConfigSchema,
  }),
  z.object({
    ...identity("books"),
    type: z.literal("books"),
    config: booksConfigSchema,
  }),
  z.object({
    ...identity("letter"),
    type: z.literal("letter"),
    config: letterConfigSchema,
  }),
  z.object({
    ...identity("coffee"),
    type: z.literal("coffee"),
    config: emptyConfigSchema,
  }),
  z.object({
    ...identity("pencil"),
    type: z.literal("pencil"),
    config: emptyConfigSchema,
  }),
]);
export type DeskItem = z.infer<typeof deskItemSchema>;
export type DeskItemType = DeskItem["type"];
export type IntroConfig = z.infer<typeof introConfigSchema>;

export function restoreDeskItemContent(item: DeskItem): DeskItem {
  const definition = deskItemDefinitions[item.type];
  const restored = deskItemSchema.parse({
    ...item,
    name: definition.name,
    appearance: defaultDeskAppearance(item.type),
    config: definition.defaultConfig,
  });
  return { ...restored, name: item.name, appearance: item.appearance };
}
