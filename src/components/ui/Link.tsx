import NextLink from "next/link";

// import { getNormalizedLocale } from "@/i18n/tools";
import { getLocale } from "next-intl/server";

interface Props {
  children: React.ReactNode;
  href: string;
  className?: string;
  title?: string;
  locale?: string;
}
export default async function Link({ children, href, locale, ...props }: Props) {
//   locale = getNormalizedLocale(locale);
  // TODO: Adapt to use cache
  locale = await getLocale();

  return (
    <NextLink href={`/${locale}${href}`} {...props}>
      {children}
    </NextLink>
  );
}
