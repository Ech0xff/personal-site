import SvgGithub from "@/components/icons/Github";
import SvgGoogle from "@/components/icons/Google";
import type { Json } from "@/types/supabase";

export const CONFIG_KEYS = {
  aboutMe: "aboutMe",
  playlistUrl: "playlistUrl",
  oauthProviders: "oauthProviders",
  siteInfo: "siteInfo",
  recentPlan: "recentPlan",
} as const;

export type TaskStatus = "waiting" | "completed" | "pending" | "failed";

export type RecentPlanTask = { [key: string]: Json | undefined } & {
  task: string;
  status: TaskStatus;
  createdAt: string;
  completedAt?: string;
};

export type RecentPlanConfig = RecentPlanTask[];

export const taskStatusConfig: Record<
  TaskStatus,
  { label: string; color: string }
> = {
  waiting: {
    label: "未开始",
    color: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200",
  },
  pending: {
    label: "进行中",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
  },
  completed: {
    label: "完成",
    color:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
  },
  failed: {
    label: "失败",
    color: "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300",
  },
};

const taskStatuses = Object.keys(taskStatusConfig) as TaskStatus[];

const isTaskStatus = (value: unknown): value is TaskStatus =>
  typeof value === "string" && taskStatuses.includes(value as TaskStatus);

export function resolveRecentPlanConfig(value: unknown): RecentPlanConfig {
  if (!Array.isArray(value)) return [];

  return value.reduce<RecentPlanConfig>((plans, item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) return plans;

    const plan = item as Record<string, unknown>;
    if (!isNonEmptyString(plan.task) || !isTaskStatus(plan.status)) {
      return plans;
    }

    const createdAt = isNonEmptyString(plan.createdAt)
      ? plan.createdAt
      : new Date().toISOString();
    const completedAt = isNonEmptyString(plan.completedAt)
      ? { completedAt: plan.completedAt }
      : {};

    plans.push({
      task: plan.task,
      status: plan.status,
      createdAt,
      ...completedAt,
    });
    return plans;
  }, []);
}

export type SiteInfoConfig = { [key: string]: Json | undefined } & {
  title: string;
  hero: string;
  typing: string[];
  bio: string;
  filing: string;
};

export const DEFAULT_SITE_INFO: SiteInfoConfig = {
  title: "Muyu's Little Nest",
  hero: "Muyu's Nest",
  typing: ["N 30.57° | E 104.06° | UTC/GMT +08:00", "echo 'Hello World!'"],
  bio: "Let's create something cool.",
  filing: "© 2025 Muyu. All rights reserved.",
};

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const isNonEmptyStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.length > 0 && value.every(isNonEmptyString);

export function resolveSiteInfoConfig(value: unknown): SiteInfoConfig {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return DEFAULT_SITE_INFO;
  }

  const siteInfo = value as Record<string, unknown>;

  return {
    ...DEFAULT_SITE_INFO,
    ...(isNonEmptyString(siteInfo.title) ? { title: siteInfo.title } : {}),
    ...(isNonEmptyString(siteInfo.hero) ? { hero: siteInfo.hero } : {}),
    ...(isNonEmptyStringArray(siteInfo.typing)
      ? { typing: siteInfo.typing }
      : {}),
    ...(isNonEmptyString(siteInfo.bio) ? { bio: siteInfo.bio } : {}),
    ...(isNonEmptyString(siteInfo.filing) ? { filing: siteInfo.filing } : {}),
  };
}

export type ConfigValue = {
  [CONFIG_KEYS.aboutMe]: string;
  [CONFIG_KEYS.playlistUrl]: string;
  [CONFIG_KEYS.oauthProviders]: OAuthProvider[];
  [CONFIG_KEYS.siteInfo]: SiteInfoConfig;
  [CONFIG_KEYS.recentPlan]: RecentPlanConfig;
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
