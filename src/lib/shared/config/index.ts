import { toMerged } from "es-toolkit";
import type { z } from "zod";

import SvgGithub from "#components/icons/Github";
import SvgGoogle from "#components/icons/Google";

import {
  dictionaries,
  type Dictionary,
  type Locale,
  type PartialDictionary,
} from "../i18n";
import { CONFIG_KEY, CONFIG_SCOPE } from "./config.const";
import { defineConfig } from "./config.helper";
import {
  dictionaryOverrideSchema,
  oauthProvidersSchema,
  recentPlansSchema,
  stringConfigSchema,
} from "./config.schema";
import type {
  ConfigKey,
  ConfigScope,
  OAuthProvider,
  RecentPlan,
} from "./config.type";

export * from "./config.const";
export * from "./config.helper";
export * from "./config.schema";
export * from "./config.type";

export const CONFIG_REGISTRY = {
  [CONFIG_KEY.ABOUT_ME]: defineConfig<string, string>({
    scope: CONFIG_SCOPE.LOCALE,
    defaults: () => "Hi, I'm Ech0xff. Welcome to my personal site!",
    schema: stringConfigSchema,
    resolve: (_, override) => override,
  }),
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
  [CONFIG_KEY.PLAYLIST_URL]: defineConfig<string, string>({
    scope: CONFIG_SCOPE.LOCALE,
    defaults: () => "",
    schema: stringConfigSchema,
    resolve: (_, override) => override,
  }),
  [CONFIG_KEY.RECENT_PLAN]: defineConfig<RecentPlan[], RecentPlan[]>({
    scope: CONFIG_SCOPE.LOCALE,
    defaults: () => [],
    schema: recentPlansSchema,
    resolve: (_, override) => override,
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

export const getConfigDefaults = <K extends ConfigKey>(
  key: K,
  locale: Locale,
): ConfigValue<K> => {
  const definition = CONFIG_REGISTRY[key];
  return (
    definition.scope === CONFIG_SCOPE.LOCALE
      ? definition.defaults({ locale })
      : definition.defaults()
  ) as ConfigValue<K>;
};

export const generatePlaylistUrl = (
  playlistUrl: string,
  theme: "dark" | "light",
) => {
  const url = new URL(playlistUrl);
  url.searchParams.set("theme", theme);
  return url.toString();
};

export const providerConfig: Record<
  OAuthProvider,
  {
    label: string;
    icon: React.ElementType;
    color: string;
  }
> = {
  github: {
    label: "GitHub",
    icon: SvgGithub,
    color: "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900",
  },
  google: {
    label: "Google",
    icon: SvgGoogle,
    color: "bg-white text-zinc-900",
  },
};
