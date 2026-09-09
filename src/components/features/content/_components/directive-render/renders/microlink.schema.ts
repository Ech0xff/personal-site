import { z } from "zod";

const microlinkImageSchema = z.object({ url: z.string().optional() });
const microlinkDataSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  publisher: z.string().optional(),
  url: z.string().optional(),
  image: microlinkImageSchema.optional(),
  logo: microlinkImageSchema.optional(),
});
const microlinkResponseSchema = z.object({
  status: z.string().optional(),
  data: microlinkDataSchema.optional(),
  message: z.string().optional(),
});

export type MicrolinkData = z.infer<typeof microlinkDataSchema>;

export const parseMicrolinkResponse = (value: unknown) =>
  microlinkResponseSchema.parse(value);
