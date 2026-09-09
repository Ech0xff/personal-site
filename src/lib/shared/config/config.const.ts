export const CONFIG_KEY = {
  ABOUT_ME: "ABOUT_ME",
  DICTIONARY: "DICTIONARY",
  OAUTH: "OAUTH",
  PLAYLIST_URL: "PLAYLIST_URL",
  RECENT_PLAN: "RECENT_PLAN",
} as const;

export const CONFIG_SCOPE = {
  GLOBAL: "global",
  LOCALE: "locale",
} as const;

export const IDENTITY_PROVIDER = {
  EMAIL: "email",
  GITHUB: "github",
  GOOGLE: "google",
} as const;

export const OAUTH_PROVIDERS = [
  IDENTITY_PROVIDER.GITHUB,
  IDENTITY_PROVIDER.GOOGLE,
] as const;
