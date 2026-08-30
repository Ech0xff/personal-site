import type { Json } from "#types";

import type { ConfigDefinition } from "./config.type";

export const defineConfig = <Override extends Json, Resolved>(
  definition: ConfigDefinition<Override, Resolved>,
) => definition;
