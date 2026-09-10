import {
  CalendarDays,
  FileText,
  LayoutDashboard,
  Lightbulb,
  Menu,
} from "lucide-react";
import { cacheTag } from "next/cache";
import type React from "react";

import GlobalSearchTrigger from "#components/features/search/global-search-trigger.component";
import LanguageToggle from "#components/shared/language-toggle.component";
import Link from "#components/shared/link.component";
import ThemeToggle from "#components/shared/theme-toggle.component";
import DropdownPopover from "#components/ui/dropdown-popover.component";
import Stack from "#components/ui/stack.component";
import { useT } from "#i18n";
import { CACHE_TAGS } from "#lib/server/cache";
import { cn } from "#lib/shared/utils";

import FooterSection from "./_components/footer-section.component";
import LayoutClient from "./_components/layout-client.component";

import "./layout.scss";

function Navbar() {
  const t = useT().scope((d) => d.navigation);

  const navItems = [
    { name: t((d) => d.posts), path: "/posts", icon: FileText },
    {
      name: t((d) => d.thoughts),
      path: "/thoughts",
      icon: Lightbulb,
    },
    {
      name: t((d) => d.events),
      path: "/events",
      icon: CalendarDays,
    },
    {
      name: t((d) => d.dashboard),
      path: "/dashboard/account",
      icon: LayoutDashboard,
    },
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
            {t((d) => d.description)}
          </div>
        </Link>
        {/* Nav Items - Right aligned */}
        <Stack x className={cn("relative items-center gap-4")}>
          <DropdownPopover
            className="md:hidden"
            trigger={
              <button type="button">
                <Menu className="h-5 w-5" />
              </button>
            }
          >
            {navItems.map(navItemRender)}
          </DropdownPopover>

          <Stack x className="hidden items-center gap-4 md:flex">
            {navItems.map(navItemRender)}
          </Stack>
          <GlobalSearchTrigger />
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
}: {
  children: React.ReactNode;
}) {
  "use cache";
  cacheTag(CACHE_TAGS.config);

  return (
    <LayoutClient navbar={<Navbar />}>
      {children}
      <Footer />
    </LayoutClient>
  );
}

function Footer() {
  const t = useT();

  return <FooterSection filing={t((d) => d.footer.filing)} />;
}
