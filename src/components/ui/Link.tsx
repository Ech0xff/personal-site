import NextLink from "next/link";

import { useLocale } from "#i18n";
import { localizeHref } from "#lib/shared/i18n";

interface Props {
  children: React.ReactNode;
  /**
   * A locale-free href, such as a `ROUTES` constant or `/posts/123`. The locale
   * of the current route is prepended here; pass `getLocalizedRoutes` output
   * only to APIs that navigate outside this component.
   */
  href: string;
  className?: string;
  title?: string;
}
export default function Link({ children, href, ...props }: Props) {
  const locale = useLocale();

  return (
    <NextLink href={localizeHref(locale, href)} {...props}>
      {children}
    </NextLink>
  );
}
