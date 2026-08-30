import type { TaggedUnion, ValueOf } from "type-fest";
import type { z } from "zod";

import type { Json } from "#types";

import type { Locale } from "../i18n-new";
import { CONFIG_KEY, CONFIG_SCOPE } from "./config.const";

export type ConfigKey = ValueOf<typeof CONFIG_KEY>;
export type ConfigScope = ValueOf<typeof CONFIG_SCOPE>;

export type ConfigLocaleContext = {
  locale: Locale;
};

export type ConfigDefinition<Override extends Json, Resolved> = {
  schema: z.ZodType<Override>;
  resolve(defaults: Resolved, override: Override): Resolved;
} & TaggedUnion<
  "scope",
  {
    [CONFIG_SCOPE.GLOBAL]: {
      defaults: () => Resolved;
    };
    [CONFIG_SCOPE.LOCALE]: {
      defaults: (context: ConfigLocaleContext) => Resolved;
    };
  }
>;
