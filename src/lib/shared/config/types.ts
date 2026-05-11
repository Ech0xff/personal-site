// types.ts
export type ConfigKey =
  | "aboutMe"
  | "playlistUrl"
  | "oauthProviders"
  | "siteInfo"
  | "recentPlan";

export type OAuthProvider = "github" | "google";

export type RecentPlan = {
  task: string;
  status: "waiting" | "completed" | "pending" | "failed";
  createdAt: string;
  completedAt?: string;
};

export type ConfigValue = {
  aboutMe: string;
  playlistUrl: string;
  oauthProviders: OAuthProvider[];
  siteInfo: {
    title: string;
    hero: string;
    typing: string[];
    bio: string;
    filing: string;
  };
  recentPlan: RecentPlan[];
};

export type ConfigsMap = {
  [K in ConfigKey]: ConfigValue[K];
};
