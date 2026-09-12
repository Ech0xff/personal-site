import { z } from "zod";

const microlinkImageSchema = z.object({ url: z.string().optional() });
const microlinkDataSchema = z.object({
  title: z.string().nullish(),
  description: z.string().nullish(),
  publisher: z.string().nullish(),
  url: z.string().optional(),
  image: microlinkImageSchema.nullish(),
  logo: microlinkImageSchema.nullish(),
});
const microlinkResponseSchema = z.object({
  status: z.string().optional(),
  data: microlinkDataSchema.optional(),
  message: z.string().optional(),
});

export type MicrolinkData = z.infer<typeof microlinkDataSchema>;

export const parseMicrolinkResponse = (value: unknown) =>
  microlinkResponseSchema.parse(value);
