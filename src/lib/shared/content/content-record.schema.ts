import { z } from "zod";

import { documentTitle } from "./document.helper";
import { documentSchema } from "./document.schema";
import { statusSchema } from "./status.schema";

export const contentRecordSchema = z
  .object({
    id: z.uuid(),
    content: documentSchema,
    status: statusSchema,
    published_at: z.string(),
  })
  .transform((record) => ({ ...record, title: documentTitle(record.content) }));
