import { statusSchema } from "./status.schema";

export const parseContentStatus = <T extends { status: string }>(row: T) => {
  const { status, ...rest } = row;
  return { ...rest, status: statusSchema.parse(status) };
};
