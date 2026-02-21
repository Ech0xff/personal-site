"use client";
import NextLink from "next/link";
import { usePathname } from "next/navigation";

import { routing } from "@/i18n/routing";

interface Props {
  children: React.ReactNode;
  href: string;
  className?: string;
  title?: string;
}
export default function Link({ children, href, ...props }: Props) {
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || routing.defaultLocale;

  return (
    <NextLink href={`/${locale}${href}`} {...props}>
      {children}
    </NextLink>
  );
}
