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

import LogoutButton from "@/components/shared/LogoutButton";
import ThemeToggle from "@/components/shared/ThemeToggle";
import DropdownPopover from "@/components/ui/DropdownPopover";
import Stack from "@/components/ui/Stack";
import { makeServerClient } from "@/lib/server/supabase";
import { getLocalizedRoutes } from "@/lib/shared/routes";
import { cn } from "@/lib/shared/utils/tailwind";
import { getUserStatus } from "@/lib/shared/utils/tools";

import DashboardModalOptions from "./_components/DashboardModalOptions";

async function Navbar({
  isAdmin,
  locale,
}: {
  isAdmin: boolean;
  locale: string;
}) {
  "use cache";
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
      path: routes.DASHBOARD.Config,
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
      className="flex items-center gap-3 rounded-lg px-3 py-2.5 font-medium text-sm text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
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
          className="flex items-center gap-2 font-semibold text-lg text-zinc-900 transition-colors hover:text-blue-600 dark:text-zinc-100 dark:hover:text-blue-400"
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
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
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
      <Navbar isAdmin={isAdmin} locale={locale} />
      {/* Main Content */}
      {children}
    </Stack>
  );
}
