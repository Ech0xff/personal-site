import { routing } from "./routing";

const localeSet = new Set(routing.locales);

const ensureLeadingSlash = (value: string) => {
  if (!value) return "/";
  return value.startsWith("/") ? value : `/${value}`;
};

const splitHref = (href: string) => {
  const hashIndex = href.indexOf("#");
  const hash = hashIndex >= 0 ? href.slice(hashIndex) : "";
  const hrefWithoutHash = hashIndex >= 0 ? href.slice(0, hashIndex) : href;
  const searchIndex = hrefWithoutHash.indexOf("?");
  const search = searchIndex >= 0 ? hrefWithoutHash.slice(searchIndex) : "";
  const pathname =
    searchIndex >= 0 ? hrefWithoutHash.slice(0, searchIndex) : hrefWithoutHash;

  return {
    pathname: ensureLeadingSlash(pathname || "/"),
    search,
    hash,
  };
};

export const isSupportedLocale = (
  locale?: string | null,
): locale is (typeof routing.locales)[number] =>
  Boolean(locale && localeSet.has(locale));

export const normalizeLocale = (locale?: string | null) =>
  isSupportedLocale(locale) ? locale : routing.defaultLocale;

export const getPreferredLocale = (cookieLocale?: string | null) =>
  normalizeLocale(cookieLocale);

export const getLocaleFromPathname = (pathname: string) => {
  const [firstSegment] = ensureLeadingSlash(pathname)
    .split("/")
    .filter(Boolean);
  return isSupportedLocale(firstSegment) ? firstSegment : null;
};

export const stripLocalePrefix = (pathname: string) => {
  const normalizedPathname = ensureLeadingSlash(pathname);
  const locale = getLocaleFromPathname(normalizedPathname);

  if (!locale) return normalizedPathname;

  const strippedPathname = normalizedPathname.slice(locale.length + 1);
  return strippedPathname ? ensureLeadingSlash(strippedPathname) : "/";
};

export const localizeHref = (locale: string, href: string) => {
  const normalizedLocale = normalizeLocale(locale);
  const { pathname, search, hash } = splitHref(href);
  const localeFreePathname = stripLocalePrefix(pathname);
  const localizedPathname =
    localeFreePathname === "/"
      ? `/${normalizedLocale}`
      : `/${normalizedLocale}${localeFreePathname}`;

  return `${localizedPathname}${search}${hash}`;
};

export const switchLocaleInPathname = (
  pathname: string,
  targetLocale: string,
) => localizeHref(targetLocale, pathname);
