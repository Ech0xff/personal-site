import { type Locale, routing } from "#lib/shared/i18n/routing";

export const generatePlaylistUrl = (
  playlistUrl: string,
  theme: "dark" | "light",
) => {
  const url = new URL(playlistUrl);
  url.searchParams.set("theme", theme);
  return url.toString();
};

export const generateConfigKey = (
  key: string,
  locale: Locale = routing.defaultLocale,
) => {
  return `${key}:${locale}`;
};
