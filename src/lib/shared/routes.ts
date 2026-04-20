import { localizeHref, normalizeLocale } from "./i18n/locale";

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
    CONIFG: "/dashboard/config",
    POSTS: "/dashboard/posts",
    THOUGHTS: "/dashboard/thoughts",
    EVENT: "/dashboard/event",
    TAGS: "/dashboard/tags",
    IMAGES: "/dashboard/images",
    ACCOUNT: "/dashboard/account",
  },
} as const;

export const getLocalizedRoutes = (locale: string) => {
  const normalizedLocale = normalizeLocale(locale);

  return {
    HOME: localizeHref(normalizedLocale, ROUTES.HOME),
    POSTS: localizeHref(normalizedLocale, ROUTES.POSTS),
    POST: (id: string) => localizeHref(normalizedLocale, ROUTES.POST(id)),
    THOUGHTS: localizeHref(normalizedLocale, ROUTES.THOUGHTS),
    EVENTS: localizeHref(normalizedLocale, ROUTES.EVENTS),
    AUTH: localizeHref(normalizedLocale, ROUTES.AUTH),
    DASHBOARD: {
      Config: localizeHref(normalizedLocale, ROUTES.DASHBOARD.CONIFG),
      POSTS: localizeHref(normalizedLocale, ROUTES.DASHBOARD.POSTS),
      THOUGHTS: localizeHref(normalizedLocale, ROUTES.DASHBOARD.THOUGHTS),
      EVENT: localizeHref(normalizedLocale, ROUTES.DASHBOARD.EVENT),
      TAGS: localizeHref(normalizedLocale, ROUTES.DASHBOARD.TAGS),
      IMAGES: localizeHref(normalizedLocale, ROUTES.DASHBOARD.IMAGES),
      ACCOUNT: localizeHref(normalizedLocale, ROUTES.DASHBOARD.ACCOUNT),
    },
  } as const;
};
