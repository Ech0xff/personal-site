import SvgGithub from "@/components/icons/Github";
import SvgGoogle from "@/components/icons/Google";

export type OAuthProvider = "github" | "google";

const providerConfig: Record<
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

function parseProviders(): OAuthProvider[] {
  const raw = process.env.NEXT_PUBLIC_OAUTH_PROVIDERS;
  if (!raw) return [];
  const providers = raw
    .split(",")
    .map((p) => p.trim() as OAuthProvider)
    .filter((p) => p in providerConfig);
  return providers.length > 0 ? providers : ["github"];
}

export const oauthProviders = parseProviders();
export { providerConfig };
