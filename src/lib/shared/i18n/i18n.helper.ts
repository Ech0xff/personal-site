import { assert } from "es-toolkit";
import { flow } from "es-toolkit/fp";

import { defaultLocale, locales } from "./i18n.const";
import type { Locale } from "./i18n.type";

type HrefParts = {
  readonly pathname: string;
  readonly search: string;
  readonly hash: string;
};

const ensureLeadingSlash = (value: string): string =>
  !value ? "/" : value.startsWith("/") ? value : `/${value}`;

const pathSegments = (pathname: string): readonly string[] =>
  ensureLeadingSlash(pathname).split("/").filter(Boolean);

const parseHref = (href: string): HrefParts => {
  const hashIndex = href.indexOf("#");
  const hash = hashIndex < 0 ? "" : href.slice(hashIndex);
  const withoutHash = hashIndex < 0 ? href : href.slice(0, hashIndex);
  const searchIndex = withoutHash.indexOf("?");
  const search = searchIndex < 0 ? "" : withoutHash.slice(searchIndex);
  const pathname =
    searchIndex < 0 ? withoutHash : withoutHash.slice(0, searchIndex);

  return { pathname: ensureLeadingSlash(pathname), search, hash };
};

const formatHref = ({ pathname, search, hash }: HrefParts): string =>
  `${pathname}${search}${hash}`;

export const isSupportedLocale = (value: unknown): value is Locale =>
  locales.some((locale) => locale === value);

export const parseLocale = (value: unknown): Locale | null =>
  isSupportedLocale(value) ? value : null;

export const normalizeLocale = (value: unknown): Locale =>
  parseLocale(value) ?? defaultLocale;

export function assertLocale(value: unknown): asserts value is Locale {
  assert(
    isSupportedLocale(value),
    `${String(value)} is not a supported locale`,
  );
}

export const getNextLocale = (locale: Locale): Locale =>
  locales[(locales.indexOf(locale) + 1) % locales.length];

/** Resolves a supported locale from the leading pathname segment. */
export const getLocaleFromPathname = (pathname: string): Locale | null =>
  parseLocale(pathSegments(pathname)[0]);

const prependLocale =
  (locale: Locale) =>
  ({ pathname, search, hash }: HrefParts): HrefParts => ({
    pathname: `/${locale}${pathname === "/" ? "" : pathname}`,
    search,
    hash,
  });

/**
 * Localizes a locale-free href, such as a `ROUTES` constant or `/posts/123`.
 * The href must not already carry a locale; use `switchLocaleHref` for that.
 */
export const localizeHref = (locale: Locale, href: string): string =>
  flow(parseHref, prependLocale(locale), formatHref)(href);

/**
 * Rewrites an href that is already localized under `from` so it points at `to`.
 * The `from` prefix is a precondition guaranteed by the route we are on, not
 * something to probe for.
 */
export const switchLocaleHref = (
  from: Locale,
  to: Locale,
  href: string,
): string => {
  const { pathname, search, hash } = parseHref(href);

  assert(
    getLocaleFromPathname(pathname) === from,
    `"${href}" is not a ${from} URL`,
  );

  return formatHref({
    pathname: `/${to}${pathname.slice(from.length + 1)}`,
    search,
    hash,
  });
};
