import { redirect } from "next/navigation";

import {
  ArrowLeft,
  Calendar,
  FileText,
  Image,
  LayoutDashboard,
  Menu,
  MessageCircle,
  UserCog,
} from "lucide-react";

import LogoutButton from "@/components/shared/LogoutButton";
import ThemeToggle from "@/components/shared/ThemeToggle";
import DropdownPopover from "@/components/ui/DropdownPopover";
import Link from "@/components/ui/Link";
import Stack from "@/components/ui/Stack";
import StackX from "@/components/ui/StackX";
import { makeServerClient } from "@/lib/server/supabase";
import { cn } from "@/lib/shared/utils/tailwind";
import { getUserStatus } from "@/lib/shared/utils/tools";

const navItems = [
  {
    isAdmin: false,
    name: "Account",
    path: "/dashboard/account",
    icon: LayoutDashboard,
  },
  {
    isAdmin: true,
    name: "Overview",
    path: "/dashboard/overview",
    icon: UserCog,
  },
  { isAdmin: true, name: "Posts", path: "/dashboard/posts", icon: FileText },
  {
    isAdmin: true,
    name: "Thoughts",
    path: "/dashboard/thoughts",
    icon: MessageCircle,
  },
  { isAdmin: true, name: "Events", path: "/dashboard/event", icon: Calendar },
  { isAdmin: true, name: "Images", path: "/dashboard/images", icon: Image },
];

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const client = await makeServerClient();
  const { isAuth, isAdmin } = await getUserStatus(client);

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
  if (!isAuth) redirect("/auth");
  return (
    <Stack
      className={cn(
        "relative flex h-dvh w-dvw bg-(--theme-bg)",
        "flex-col divide-y",
        "md:flex-row md:divide-x",
      )}
    >
      {/* Sidebar */}
      <Stack
        className={cn(
          "flex bg-zinc-50 p-3 dark:bg-zinc-900",
          "flex-row items-center",
          "md:flex-col md:items-start",
        )}
      >
        {/* Header */}
        <StackX className="gap-2">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold text-zinc-900 transition-colors hover:text-blue-600 dark:text-zinc-100 dark:hover:text-blue-400"
          >
            <ArrowLeft className="h-5 w-5" />
            <div>Back</div>
          </Link>
          <ThemeToggle />
        </StackX>
        {/* Navigation & Logout */}
        <Stack className={cn("ml-auto flex flex-1 gap-2", "md:flex-col")}>
          {/* Navigation */}
          <>
            <DropdownPopover
              className="ml-auto md:hidden"
              trigger={
                <button className="ml-auto rounded-md p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800">
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

      {/* Main Content */}
      {children}
    </Stack>
  );
}
