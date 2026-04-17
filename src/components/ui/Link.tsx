"use client";
import NextLink from "next/link";

import { useCurrentLocale } from "@/lib/client/locale";
import { localizeHref } from "@/lib/shared/i18n";

interface Props {
  children: React.ReactNode;
  href: string;
  className?: string;
  title?: string;
}
export default function Link({ children, href, ...props }: Props) {
  const locale = useCurrentLocale();

  return (
    <NextLink href={localizeHref(locale, href)} {...props}>
      {children}
    </NextLink>
  );
}
