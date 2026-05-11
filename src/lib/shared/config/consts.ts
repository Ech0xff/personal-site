// consts.ts
import SvgGithub from "@/components/icons/Github";
import SvgGoogle from "@/components/icons/Google";
import type { ConfigKey, ConfigsMap, OAuthProvider } from "./types";

export const CONFIG_KEYS = {
  aboutMe: "aboutMe",
  playlistUrl: "playlistUrl",
  oauthProviders: "oauthProviders",
  siteInfo: "siteInfo",
  recentPlan: "recentPlan",
} as const satisfies Record<ConfigKey, ConfigKey>;

export const DEFAULT_CONFIG: ConfigsMap = {
  aboutMe: "Hi, I'm Muyu. Welcome to my personal site!",
  playlistUrl: "",
  oauthProviders: [],
  siteInfo: {
    title: "Muyu's Little Nest",
    hero: "Muyu's Nest",
    typing: ["echo 'Hello World!'"],
    bio: "Let's create something cool.",
    filing: "© 2025 Muyu. All rights reserved.",
  },
  recentPlan: [],
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
