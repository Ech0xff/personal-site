import { deskConfigurationSchema } from "./desk-configuration.schema";
import { deskItemDefinitions } from "./desk-item.schema";

export const defaultDeskConfiguration = deskConfigurationSchema.parse({
  items: Object.entries(deskItemDefinitions).map(([type, definition]) => ({
    id: type,
    type,
    name: definition.name,
    config: definition.defaultConfig,
  })),
});
