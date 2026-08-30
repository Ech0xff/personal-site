import { OAuthProvider } from "../config/types";
import { dictionaries, Dictionary, PartialDictionary } from "../i18n-new";
import { CONFIG_KEY, CONFIG_SCOPE } from "./config.const";
import { defineConfig } from "./config.helper";
import { ConfigKey, ConfigScope } from "./config.type";

type ConfigRegistryEntry = {
  readonly scope: ConfigScope;
};

export const CONFIG_REGISTRY = {
  [CONFIG_KEY.OAUTH]: defineConfig<OAuthProvider[], OAuthProvider[]>({
    scope: CONFIG_SCOPE.GLOBAL,
    defaults: () => [],
    decode: () => [],
    resolve: (_, override) => override,
  }),
  [CONFIG_KEY.DICTIONARY]: defineConfig<PartialDictionary, Dictionary>({
    scope: CONFIG_SCOPE.LOCALE,
    defaults: ({ locale }) => dictionaries[locale],
    decode: () => {
      return {};
    },
    resolve: (_, _override) => _,
  }),
} as const satisfies Record<ConfigKey, ConfigRegistryEntry>;

export type ConfigRegistry = typeof CONFIG_REGISTRY;
