import {
  ArrowLeft,
  Calendar,
  FileText,
  Image,
  LayoutDashboard,
  Menu,
  MessageCircle,
  Tags,
  UserCog,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import LogoutButton from "#components/shared/logout-button.component";
import ThemeToggle from "#components/shared/theme-toggle.component";
import DropdownPopover from "#components/ui/dropdown-popover.component";
import Stack from "#components/ui/stack.component";
import { getLocale } from "#lib/server/i18n";
import { makeServerClient } from "#lib/server/supabase.client";
import { getUserStatus } from "#lib/shared/auth/session.service";
import { getLocalizedRoutes } from "#lib/shared/routes/routes.helper";
import { cn } from "#lib/shared/utils/tailwind.helper";

import DashboardModalOptions from "./_components/dashboard-modal-options.component";

async function Navbar({ isAdmin }: { isAdmin: boolean }) {
  "use cache";
  const locale = await getLocale();
  const routes = getLocalizedRoutes(locale);

  const navItems = [
    {
      isAdmin: false,
      name: "Account",
      path: routes.DASHBOARD.ACCOUNT,
      icon: LayoutDashboard,
    },
    {
      isAdmin: true,
      name: "Config",
      path: routes.DASHBOARD.CONFIG,
      icon: UserCog,
    },
    {
      isAdmin: true,
      name: "Posts",
      path: routes.DASHBOARD.POSTS,
      icon: FileText,
    },
    {
      isAdmin: true,
      name: "Thoughts",
      path: routes.DASHBOARD.THOUGHTS,
      icon: MessageCircle,
    },
    {
      isAdmin: true,
      name: "Events",
      path: routes.DASHBOARD.EVENT,
      icon: Calendar,
    },
    {
      isAdmin: true,
      name: "Tags",
      path: routes.DASHBOARD.TAGS,
      icon: Tags,
    },
    {
      isAdmin: true,
      name: "Images",
      path: routes.DASHBOARD.IMAGES,
      icon: Image,
    },
  ];

  const navIconRender = (item: (typeof navItems)[number]) => (
    <Link
      key={item.path}
      href={item.path}
      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
    >
      <item.icon className="h-5 w-5 shrink-0" />
      <div>{item.name}</div>
    </Link>
  );

  return (
    <Stack
      className={cn(
        "flex bg-zinc-50 p-3 dark:bg-zinc-900",
        "flex-row items-center",
        "md:flex-col md:items-start",
      )}
    >
      {/* Header */}
      <Stack x className="gap-2">
        <Link
          href={routes.HOME}
          className="flex items-center gap-2 text-lg font-semibold text-zinc-900 transition-colors hover:text-blue-600 dark:text-zinc-100 dark:hover:text-blue-400"
        >
          <ArrowLeft className="h-5 w-5" />
          <div>Back</div>
        </Link>
        <ThemeToggle />
      </Stack>
      {/* Navigation & Logout */}
      <Stack className={cn("ml-auto flex flex-1 gap-2", "md:flex-col")}>
        {/* Navigation */}
        <>
          <DropdownPopover
            className="ml-auto md:hidden"
            trigger={
              <button
                type="button"
                className="ml-auto rounded-md p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <Menu className="h-5 w-5" />
              </button>
            }
          >
            {navItems
              .filter((item) => (item.isAdmin ? isAdmin : true))
              .map(navIconRender)}
          </DropdownPopover>
          <Stack y className="mt-4 hidden gap-1 md:flex">
            {navItems
              .filter((item) => (item.isAdmin ? isAdmin : true))
              .map(navIconRender)}
          </Stack>
        </>
        {/* Logout */}
        <LogoutButton className="md:mt-auto" />
      </Stack>
    </Stack>
  );
}

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const routes = getLocalizedRoutes(locale);
  const client = await makeServerClient();
  const { isAuth, isAdmin } = await getUserStatus(client);
  if (!isAuth) redirect(routes.AUTH);

  return (
    <Stack
      className={cn(
        "relative flex h-dvh w-dvw bg-(--theme-bg)",
        "flex-col divide-y",
        "md:flex-row md:divide-x",
      )}
    >
      <DashboardModalOptions />
      <Navbar isAdmin={isAdmin} />
      {/* Main Content */}
      {children}
    </Stack>
  );
}
