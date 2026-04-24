import SvgGithub from "@/components/icons/Github";
import SvgGoogle from "@/components/icons/Google";

export const CONFIG_KEYS = {
  aboutMe: "aboutMe",
  playlistUrl: "playlistUrl",
  oauthProviders: "oauthProviders",
} as const;

export type ConfigValue = {
  [CONFIG_KEYS.aboutMe]: string;
  [CONFIG_KEYS.playlistUrl]: string;
  [CONFIG_KEYS.oauthProviders]: OAuthProvider[];
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
