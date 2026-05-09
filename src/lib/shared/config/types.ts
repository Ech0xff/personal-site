import SvgGithub from "@/components/icons/Github";
import SvgGoogle from "@/components/icons/Google";
import type { Json } from "@/types/supabase";

export const CONFIG_KEYS = {
  aboutMe: "aboutMe",
  playlistUrl: "playlistUrl",
  oauthProviders: "oauthProviders",
  siteInfo: "siteInfo",
} as const;

export type SiteInfoConfig = { [key: string]: Json | undefined } & {
  title: string;
  hero: string;
  typing: string[];
  bio: string;
  filing: string;
};

export const DEFAULT_SITE_INFO: SiteInfoConfig = {
  title: "Muyu's Little Nest",
  hero: "Muyu's Nest",
  typing: ["N 30.57° | E 104.06° | UTC/GMT +08:00", "echo 'Hello World!'"],
  bio: "Let's create something cool.",
  filing: "© 2025 Muyu. All rights reserved.",
};

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const isNonEmptyStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.length > 0 && value.every(isNonEmptyString);

export function resolveSiteInfoConfig(value: unknown): SiteInfoConfig {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return DEFAULT_SITE_INFO;
  }

  const siteInfo = value as Record<string, unknown>;

  return {
    ...DEFAULT_SITE_INFO,
    ...(isNonEmptyString(siteInfo.title) ? { title: siteInfo.title } : {}),
    ...(isNonEmptyString(siteInfo.hero) ? { hero: siteInfo.hero } : {}),
    ...(isNonEmptyStringArray(siteInfo.typing)
      ? { typing: siteInfo.typing }
      : {}),
    ...(isNonEmptyString(siteInfo.bio) ? { bio: siteInfo.bio } : {}),
    ...(isNonEmptyString(siteInfo.filing) ? { filing: siteInfo.filing } : {}),
  };
}

export type ConfigValue = {
  [CONFIG_KEYS.aboutMe]: string;
  [CONFIG_KEYS.playlistUrl]: string;
  [CONFIG_KEYS.oauthProviders]: OAuthProvider[];
  [CONFIG_KEYS.siteInfo]: SiteInfoConfig;
};

export type ConfigKey = keyof ConfigValue;

export type OAuthProvider = "github" | "google";

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
