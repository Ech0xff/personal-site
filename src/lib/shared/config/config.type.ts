import type { ValueOf } from "type-fest";
import type { z } from "zod";

import type { Json } from "#types";

import type { CONFIG_KEY, IDENTITY_PROVIDER } from "./config.const";
import type { oauthProvidersSchema, recentPlansSchema } from "./config.schema";

export type ConfigKey = ValueOf<typeof CONFIG_KEY>;

export type OAuthProvider = z.output<typeof oauthProvidersSchema>[number];
export type IdentityProvider = ValueOf<typeof IDENTITY_PROVIDER>;

export type RecentPlan = z.output<typeof recentPlansSchema>[number];

export type ConfigDefinition<Override extends Json, Resolved> = {
  schema: z.ZodType<Override>;
  defaults: () => Resolved;
  resolve(defaults: Resolved, override: Override): Resolved;
};
