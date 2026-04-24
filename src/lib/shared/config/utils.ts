export const generatePlaylistUrl = (
  playlistUrl: string,
  theme: "dark" | "light",
) => {
  const url = new URL(playlistUrl);
  url.searchParams.set("theme", theme);
  return url.toString();
};

export const generateConfigKey = (key: string, locale?: string) => {
  return locale ? `${key}:${locale}` : key;
};
