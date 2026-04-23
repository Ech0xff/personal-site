import type { Json } from "@/types";

export const LEGACY_SITE_CONFIG_KEY = "site";

export const SITE_CONFIG_KEYS = {
  aboutMe: "site.aboutMe",
  playlistUrl: "site.playlistUrl",
} as const;

type RawSiteConfigValues = {
  aboutMe: Json | null;
  playlistUrl: Json | null;
  legacyValue?: Json | null;
};

export type SiteConfig = {
  aboutMe: string;
  playlistUrl: string;
};

export const defaultSiteConfig = {
  aboutMe: "",
  playlistUrl: "",
} satisfies SiteConfig;

const isRecord = (value: Json | null): value is Record<string, Json> =>
  Boolean(value && typeof value === "object" && !Array.isArray(value));

const getString = (value: Json | null | undefined) =>
  typeof value === "string" ? value : "";

const getStringConfigValue = (value: Json | null | undefined) => ({
  hasValue: typeof value === "string",
  value: getString(value),
});

export const parseLegacySiteConfig = (value: Json | null): SiteConfig => {
  if (!isRecord(value)) return defaultSiteConfig;

  return {
    aboutMe: getString(value.aboutMe),
    playlistUrl: getString(value.playlist),
  };
};

export const buildSiteConfig = ({
  aboutMe,
  playlistUrl,
  legacyValue = null,
}: RawSiteConfigValues): SiteConfig => {
  const resolvedAboutMe = getStringConfigValue(aboutMe);
  const resolvedPlaylistUrl = getStringConfigValue(playlistUrl);
  const legacyConfig = parseLegacySiteConfig(legacyValue);

  return {
    aboutMe: resolvedAboutMe.hasValue
      ? resolvedAboutMe.value
      : legacyConfig.aboutMe,
    playlistUrl: resolvedPlaylistUrl.hasValue
      ? resolvedPlaylistUrl.value
      : legacyConfig.playlistUrl,
  };
};

export const getThemedPlaylistUrl = (
  playlistUrl: string,
  theme: "dark" | "light",
) => {
  const url = new URL(playlistUrl);
  url.searchParams.set("theme", theme);
  return url.toString();
};
