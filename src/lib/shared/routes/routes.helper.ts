import { localizeHref } from "#lib/shared/i18n/i18n.helper";
import type { Locale } from "#lib/shared/i18n/i18n.type";

import { ROUTES } from "./routes.const";

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
