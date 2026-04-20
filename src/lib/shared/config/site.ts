import type { Json } from "@/types";

export const SITE_CONFIG_KEY = "site";

export type SiteConfig = {
  aboutMe: string;
  socialLinks: {
    bilibili: string;
    github: string;
    email: string;
    qq: string;
  };
  playlist: string;
};

export const defaultSiteConfig = {
  aboutMe: "",
  socialLinks: {
    bilibili: "",
    github: "",
    email: "",
    qq: "",
  },
  playlist: "",
} satisfies SiteConfig;

const isRecord = (value: Json | null): value is Record<string, Json> =>
  Boolean(value && typeof value === "object" && !Array.isArray(value));

const getString = (value: Json | undefined) =>
  typeof value === "string" ? value : "";

export const parseSiteConfig = (value: Json | null): SiteConfig => {
  if (!isRecord(value)) return defaultSiteConfig;

  const socialLinks = isRecord(value.socialLinks) ? value.socialLinks : {};
  return {
    aboutMe: getString(value.aboutMe),
    socialLinks: {
      bilibili: getString(socialLinks.bilibili),
      github: getString(socialLinks.github),
      email: getString(socialLinks.email),
      qq: getString(socialLinks.qq),
    },
    playlist: getString(value.playlist),
  };
};

export const getThemedPlaylistUrl = (
  playlist: string,
  theme: "dark" | "light",
) => {
  const url = new URL(playlist);
  url.searchParams.set("theme", theme);
  return url.toString();
};
