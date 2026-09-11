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
import Button from "#components/ui/button.component";
import DropdownPopover from "#components/ui/dropdown-popover.component";
import Stack from "#components/ui/stack.component";
import { getDictionary } from "#lib/server/dictionary/dictionary.service";
import { makeServerClient } from "#lib/server/supabase.client";
import { getUserStatus } from "#lib/shared/auth/session.service";
import { ROUTES } from "#lib/shared/routes/routes.const";
import { cn } from "#lib/shared/utils/tailwind.helper";

import DashboardModalOptions from "./_components/dashboard-modal-options.component";

async function Navbar({ isAdmin }: { isAdmin: boolean }) {
  "use cache";

  const dictionary = await getDictionary();
  const navItems = [
    {
      isAdmin: false,
      name: "Account",
      path: ROUTES.DASHBOARD.ACCOUNT,
      icon: LayoutDashboard,
    },
    {
      isAdmin: true,
      name: "Config",
      path: ROUTES.DASHBOARD.CONFIG,
      icon: UserCog,
    },
    {
      isAdmin: true,
      name: "Posts",
      path: ROUTES.DASHBOARD.POSTS,
      icon: FileText,
    },
    {
      isAdmin: true,
      name: "Thoughts",
      path: ROUTES.DASHBOARD.THOUGHTS,
      icon: MessageCircle,
    },
    {
      isAdmin: true,
      name: "Events",
      path: ROUTES.DASHBOARD.EVENT,
      icon: Calendar,
    },
    {
      isAdmin: true,
      name: "Tags",
      path: ROUTES.DASHBOARD.TAGS,
      icon: Tags,
    },
    {
      isAdmin: true,
      name: "Images",
      path: ROUTES.DASHBOARD.IMAGES,
      icon: Image,
    },
  ];

  const navIconRender = (item: (typeof navItems)[number]) => (
    <Link
      key={item.path}
      href={item.path}
      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-text-muted transition-colors hover:bg-surface-hover hover:text-text-primary"
    >
      <item.icon className="h-5 w-5 shrink-0" />
      <div>{item.name}</div>
    </Link>
  );

  return (
    <Stack
      className={cn(
        "flex bg-surface-muted p-3 dark:bg-surface-card",
        "flex-row items-center",
        "md:flex-col md:items-start",
      )}
    >
      {/* Header */}
      <Stack x className="gap-2">
        <Link
          href={ROUTES.HOME}
          className="flex items-center gap-2 text-lg font-semibold text-text-primary transition-colors hover:text-info-text"
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
              <Button
                variant="ghost"
                aria-label={dictionary.common.menu}
                className="ml-auto"
              >
                <Menu className="h-5 w-5" />
              </Button>
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
  const client = await makeServerClient();
  const { isAuth, isAdmin } = await getUserStatus(client);
  if (!isAuth) redirect(ROUTES.AUTH);

  return (
    <Stack
      className={cn(
        "relative flex h-dvh w-dvw bg-(--theme-bg)",
        "flex-col divide-y divide-border-default",
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
