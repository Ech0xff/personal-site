import { localizeHref } from "./i18n/i18n.helper";
import type { Locale } from "./i18n/i18n.type";

// Centralized management of all route paths
export const ROUTES = {
  // Public routes
  HOME: "/",
  POSTS: "/posts",
  POST: (id: string) => `/posts/${id}`,
  THOUGHTS: "/thoughts",
  EVENTS: "/events",

  // Auth routes
  AUTH: "/auth",

  // Dashboard routes
  DASHBOARD: {
    CONFIG: "/dashboard/config",
    POSTS: "/dashboard/posts",
    THOUGHTS: "/dashboard/thoughts",
    EVENT: "/dashboard/event",
    TAGS: "/dashboard/tags",
    IMAGES: "/dashboard/images",
    ACCOUNT: "/dashboard/account",
  },
} as const;

export const getLocalizedRoutes = (locale: Locale) => {
  return {
    HOME: localizeHref(locale, ROUTES.HOME),
    POSTS: localizeHref(locale, ROUTES.POSTS),
    POST: (id: string) => localizeHref(locale, ROUTES.POST(id)),
    THOUGHTS: localizeHref(locale, ROUTES.THOUGHTS),
    EVENTS: localizeHref(locale, ROUTES.EVENTS),
    AUTH: localizeHref(locale, ROUTES.AUTH),
    DASHBOARD: {
      CONFIG: localizeHref(locale, ROUTES.DASHBOARD.CONFIG),
      POSTS: localizeHref(locale, ROUTES.DASHBOARD.POSTS),
      THOUGHTS: localizeHref(locale, ROUTES.DASHBOARD.THOUGHTS),
      EVENT: localizeHref(locale, ROUTES.DASHBOARD.EVENT),
      TAGS: localizeHref(locale, ROUTES.DASHBOARD.TAGS),
      IMAGES: localizeHref(locale, ROUTES.DASHBOARD.IMAGES),
      ACCOUNT: localizeHref(locale, ROUTES.DASHBOARD.ACCOUNT),
    },
  } as const;
};
