import { toMerged } from "es-toolkit";
import type { z } from "zod";

import type { OAuthProvider } from "../config/types";
import {
  dictionaries,
  type Dictionary,
  type PartialDictionary,
} from "../i18n-new";
import { CONFIG_KEY, CONFIG_SCOPE } from "./config.const";
import { defineConfig } from "./config.helper";
import {
  dictionaryOverrideSchema,
  oauthProvidersSchema,
} from "./config.schema";
import type { ConfigKey, ConfigScope } from "./config.type";

export * from "./config.const";
export * from "./config.helper";
export * from "./config.schema";
export * from "./config.type";

export const CONFIG_REGISTRY = {
  [CONFIG_KEY.OAUTH]: defineConfig<OAuthProvider[], OAuthProvider[]>({
    scope: CONFIG_SCOPE.GLOBAL,
    defaults: () => [],
    schema: oauthProvidersSchema,
    resolve: (_, override) => override,
  }),
  [CONFIG_KEY.DICTIONARY]: defineConfig<PartialDictionary, Dictionary>({
    scope: CONFIG_SCOPE.LOCALE,
    defaults: ({ locale }) => dictionaries[locale],
    schema: dictionaryOverrideSchema,
    resolve: (defaults, override) => toMerged(defaults, override),
  }),
} as const satisfies Record<ConfigKey, { readonly scope: ConfigScope }>;

export type ConfigRegistry = typeof CONFIG_REGISTRY;

export type ConfigOverride<K extends ConfigKey> = z.output<
  ConfigRegistry[K]["schema"]
>;

export type ConfigValue<K extends ConfigKey> = ReturnType<
  ConfigRegistry[K]["resolve"]
>;

export type ConfigSnapshot<K extends ConfigKey> = Readonly<{
  [P in K]: ConfigValue<P>;
}>;

export type ConfigOverrideSnapshot<K extends ConfigKey> = Readonly<{
  [P in K]: ConfigOverride<P> | null;
}>;
