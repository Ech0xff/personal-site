import { z } from "zod";

import { documentTitle } from "./document.helper";
import { documentSchema } from "./document.schema";
import { statusSchema } from "./status.schema";

export const contentRecordSchema = z
  .object({
    id: z.uuid(),
    content: documentSchema,
    color: z.string().default("#3b82f6"),
    status: statusSchema,
    published_at: z.string(),
  })
  .transform((record) => ({ ...record, title: documentTitle(record.content) }));
