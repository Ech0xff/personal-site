import SvgGithub from "@/components/icons/Github";
import SvgGoogle from "@/components/icons/Google";
import type { Json } from "@/types";

export type OAuthProvider = "github" | "google";
export const AUTH_CONFIG_KEYS = {
  oauthProviders: "auth.oauthProviders",
  legacyOauthEnabled: "auth.oauthEnabled",
} as const;

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

export const allOAuthProviders = Object.keys(providerConfig) as OAuthProvider[];

const isOAuthProvider = (value: Json | null): value is OAuthProvider =>
  typeof value === "string" && value in providerConfig;

export const resolveOauthProviders = (
  value: Json | null,
  providers: OAuthProvider[] = allOAuthProviders,
) => {
  if (value === false) return [];

  if (Array.isArray(value)) {
    return value.filter(
      (provider): provider is OAuthProvider =>
        isOAuthProvider(provider) && providers.includes(provider),
    );
  }

  return providers;
};
