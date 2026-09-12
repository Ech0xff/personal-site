import { z } from "zod";

export const thoughtImagesSchema = z
  .array(z.string())
  .transform((images) => [...new Set(images)]);
