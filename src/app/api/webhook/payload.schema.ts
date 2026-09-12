import { z } from "zod";

const recordSchema = z.object({ id: z.uuid().optional() });

export const webhookPayloadSchema = z
  .object({
    table: z.enum([
      "configs",
      "event_tags",
      "events",
      "post_tags",
      "posts",
      "thoughts",
    ]),
    record: recordSchema.nullable().optional(),
    new: recordSchema.nullable().optional(),
    old_record: recordSchema.nullable().optional(),
  })
  .refine(
    (payload) =>
      payload.table !== "posts" ||
      Boolean((payload.record ?? payload.new)?.id ?? payload.old_record?.id),
    { message: "Post webhooks require a record ID", path: ["record"] },
  );
