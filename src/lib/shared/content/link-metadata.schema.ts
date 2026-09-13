import { z } from "zod";
export const webUrlSchema = z
  .string()
  .max(4096)
  .refine((value) => {
    try {
      return ["http:", "https:"].includes(new URL(value).protocol);
    } catch {
      return false;
    }
  }, "Use an HTTP or HTTPS link.");
const optionalUrl = z.preprocess(
  (value) => value ?? "",
  z.union([z.literal(""), webUrlSchema]),
);
export const linkMetadataSchema = z.object({
  url: webUrlSchema,
  title: z.string().max(500),
  description: z.string().max(2000),
  siteName: z.string().max(200),
  image: optionalUrl,
  icon: optionalUrl,
});
