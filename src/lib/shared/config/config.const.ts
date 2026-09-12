export const CONFIG_KEY = {
  DICTIONARY: "DICTIONARY",
  ABOUT_ME: "ABOUT_ME",
  OAUTH: "OAUTH",
  PLAYLIST_URL: "PLAYLIST_URL",
  RECENT_PLAN: "RECENT_PLAN",
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
