import { z } from "zod";

export const statusSchema = z.enum(["show", "hide"]);
export type Status = z.output<typeof statusSchema>;
