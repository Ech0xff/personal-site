"use client";
import Link from "next/link";
import { createContext, useContext, type ComponentProps } from "react";

export const NavigationContext = createContext<(href: string) => void>(
  () => undefined,
);
export function DeskLink({
  href,
  children,
  ...props
}: Omit<ComponentProps<typeof Link>, "href" | "onNavigate"> &
  Readonly<{ href: string }>) {
  const navigate = useContext(NavigationContext);
  return (
    <Link
      {...props}
      href={href}
      onNavigate={(event) => {
        event.preventDefault();
        navigate(href);
      }}
    >
      {children}
    </Link>
  );
}
