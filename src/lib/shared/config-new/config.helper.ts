import { ConfigDefinition } from "./config.type";

export const defineConfig = <Override, Resolved>(
  definition: ConfigDefinition<Override, Resolved>,
) => definition;
