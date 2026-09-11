import { Link2 } from "lucide-react";
import type { z } from "zod";

import SvgGithub from "#components/icons/Github";
import SvgGoogle from "#components/icons/Google";

import { defaultDictionary } from "../dictionary/dictionary.const";
import { mergeDictionary } from "../dictionary/dictionary.helper";
import { dictionaryOverrideSchema } from "../dictionary/dictionary.schema";
import type {
  Dictionary,
  DictionaryOverride,
} from "../dictionary/dictionary.type";
import { CONFIG_KEY, IDENTITY_PROVIDER } from "./config.const";
import { defineConfig } from "./config.helper";
import {
  oauthProvidersSchema,
  recentPlansSchema,
  stringConfigSchema,
} from "./config.schema";
import type {
  ConfigKey,
  ConfigDefinition,
  IdentityProvider,
  OAuthProvider,
  RecentPlan,
} from "./config.type";

export * from "./config.const";
export * from "./config.helper";
export * from "./config.schema";
export * from "./config.type";

export const CONFIG_REGISTRY = {
  [CONFIG_KEY.DICTIONARY]: defineConfig<DictionaryOverride, Dictionary>({
    defaults: () => defaultDictionary,
    schema: dictionaryOverrideSchema,
    resolve: mergeDictionary,
  }),
  [CONFIG_KEY.ABOUT_ME]: defineConfig<string, string>({
    defaults: () => "Hi, I'm Ech0xff. Welcome to my personal site!",
    schema: stringConfigSchema,
    resolve: (_, override) => override,
  }),
  [CONFIG_KEY.OAUTH]: defineConfig<OAuthProvider[], OAuthProvider[]>({
    defaults: () => [],
    schema: oauthProvidersSchema,
    resolve: (_, override) => override,
  }),
  [CONFIG_KEY.PLAYLIST_URL]: defineConfig<string, string>({
    defaults: () => "",
    schema: stringConfigSchema,
    resolve: (_, override) => override,
  }),
  [CONFIG_KEY.RECENT_PLAN]: defineConfig<RecentPlan[], RecentPlan[]>({
    defaults: () => [],
    schema: recentPlansSchema,
    resolve: (_, override) => override,
  }),
} as const;

export type ConfigRegistry = typeof CONFIG_REGISTRY;

export type ConfigOverride<K extends ConfigKey> = z.output<
  ConfigRegistry[K]["schema"]
>;

export type ConfigValue<K extends ConfigKey> = ReturnType<
  ConfigRegistry[K]["resolve"]
>;

export type ConfigSnapshot<K extends ConfigKey> = {
  readonly [P in K]: ConfigValue<P>;
};

export type ConfigOverrideSnapshot<K extends ConfigKey> = {
  readonly [P in K]: ConfigOverride<P> | null;
};

const registry: {
  [P in ConfigKey]: ConfigDefinition<ConfigOverride<P>, ConfigValue<P>>;
} = CONFIG_REGISTRY;

export const getConfigDefinition = <K extends ConfigKey>(key: K) =>
  registry[key];

export const getConfigDefaults = <K extends ConfigKey>(
  key: K,
): ConfigValue<K> => {
  const definition = getConfigDefinition(key);
  return definition.defaults();
};

export const generatePlaylistUrl = (
  playlistUrl: string,
  theme: "dark" | "light",
) => {
  const url = new URL(playlistUrl);
  url.searchParams.set("theme", theme);
  return url.toString();
};

export const providerConfig = {
  [IDENTITY_PROVIDER.EMAIL]: {
    label: "email",
    icon: Link2,
    color: "bg-zinc-500 text-white",
  },
  [IDENTITY_PROVIDER.GITHUB]: {
    label: "GitHub",
    icon: SvgGithub,
    color: "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900",
  },
  [IDENTITY_PROVIDER.GOOGLE]: {
    label: "Google",
    icon: SvgGoogle,
    color: "bg-white text-zinc-900",
  },
} satisfies Record<
  IdentityProvider,
  {
    label: string;
    icon: React.ElementType;
    color: string;
  }
>;
