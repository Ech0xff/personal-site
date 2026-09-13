import { z } from "zod";

import { documentSchema } from "./document.schema";
import { statusSchema } from "./status.schema";

export const contentRecordSchema = z.object({
  id: z.uuid(),
  title: z.string().default(""),
  content: documentSchema,
  color: z.string().default("#3b82f6"),
  status: statusSchema,
  published_at: z.string(),
});
