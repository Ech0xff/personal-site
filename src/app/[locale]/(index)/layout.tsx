import React from "react";

import {
  CalendarDays,
  FileText,
  LayoutDashboard,
  Lightbulb,
  Menu,
} from "lucide-react";

import LanguageToggle from "@/components/shared/LanguageToggle";
import ThemeToggle from "@/components/shared/ThemeToggle";
import DropdownPopover from "@/components/ui/DropdownPopover";
import FooterSection from "@/components/ui/FooterSection";
import Link from "@/components/ui/Link";
import Stack from "@/components/ui/Stack";
import { getT } from "@/lib/shared/i18n/tools";
import { cn } from "@/lib/shared/utils";

import LayoutClient from "./_components/LayoutClient";
import "./layout.scss";

function Navbar({ locale }: { className?: string; locale?: string }) {
  const t = getT("Navigation", locale);

  const navItems = [
    { name: t("posts"), path: "/posts", icon: FileText },
    { name: t("thoughts"), path: "/thoughts", icon: Lightbulb },
    { name: t("events"), path: "/events", icon: CalendarDays },
    { name: t("dashboard"), path: "/dashboard/account", icon: LayoutDashboard },
  ];

  const navItemRender = (item: (typeof navItems)[number]) => (
    <Link
      key={item.path}
      href={item.path}
      className="group/nav-item relative inline-flex items-center justify-center gap-2"
    >
      <item.icon size={14} aria-hidden="true" />
      {item.name}
      <div className="absolute bottom-0 left-1/2 h-px w-px -translate-x-1/2 bg-current opacity-0 transition-all duration-300 group-hover/nav-item:w-full group-hover/nav-item:opacity-100" />
    </Link>
  );

  return (
    <Stack y className={cn("relative flex-1 duration-300")}>
      <Stack
        x
        className={cn("mx-auto w-full items-center justify-between px-4 py-2")}
      >
        {/* Navbar Main */}
        <Link href="/" className="flex min-w-0 flex-col">
          <div className={cn("text-xl font-black", "sm:text-lg")}>Blog</div>
          <div
            className={cn(
              "hidden truncate text-sm text-gray-500 dark:text-gray-400",
              "sm:block",
            )}
          >
            {t("description")}
          </div>
        </Link>
        {/* Nav Items - Right aligned */}
        <Stack x className={cn("relative items-center gap-4")}>
          <DropdownPopover
            className="md:hidden"
            trigger={
              <button>
                <Menu className="h-5 w-5" />
              </button>
            }
          >
            {navItems.map(navItemRender)}
          </DropdownPopover>

          <Stack x className="hidden items-center gap-4 md:flex">
            {navItems.map(navItemRender)}
          </Stack>
          <LanguageToggle />
          {/* Dark Mode Toggle */}
          <ThemeToggle />
        </Stack>
      </Stack>
    </Stack>
  );
}

export default async function Layout({
  children,
  params,
}: {
  params: Promise<{ locale: string }>;
  children: React.ReactNode;
}) {
  "use cache";
  const { locale } = await params;
  return (
    <LayoutClient navbar={<Navbar locale={locale} />}>
      {children}
      <FooterSection />
    </LayoutClient>
  );
}
