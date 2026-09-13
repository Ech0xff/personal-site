import "server-only";
import { z } from "zod";

import {
  linkMetadataSchema,
  webUrlSchema,
} from "#lib/shared/content/link-metadata.schema";
const responseSchema = z.object({
  status: z.literal("success"),
  data: z.object({
    title: z.string().nullish(),
    description: z.string().nullish(),
    publisher: z.string().nullish(),
    image: z.object({ url: z.string().nullish() }).nullish(),
    logo: z.object({ url: z.string().nullish() }).nullish(),
  }),
});
export async function readLinkMetadata(input: unknown) {
  const url = webUrlSchema.parse(input);
  const endpoint = new URL("https://api.microlink.io/");
  endpoint.searchParams.set("url", url);
  const response = await fetch(endpoint, {
    signal: AbortSignal.timeout(12000),
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Link metadata is unavailable.");
  const { data } = responseSchema.parse(await response.json());
  return linkMetadataSchema.parse({
    url,
    title: (data.title ?? "").slice(0, 500),
    description: (data.description ?? "").slice(0, 2000),
    siteName: (data.publisher ?? "").slice(0, 200),
    image: webUrlSchema.safeParse(data.image?.url).success
      ? data.image?.url
      : "",
    icon: webUrlSchema.safeParse(data.logo?.url).success ? data.logo?.url : "",
  });
}
