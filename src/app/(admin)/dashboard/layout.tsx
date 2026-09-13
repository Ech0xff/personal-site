import * as stylex from "@stylexjs/stylex";
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
import { color, font, space, shape, motionToken } from "#design/tokens.stylex";
import { getDictionary } from "#lib/server/dictionary/dictionary.service";
import { makeServerClient } from "#lib/server/supabase.client";
import { getUserStatus } from "#lib/shared/auth/session.service";
import { ROUTES } from "#lib/shared/routes/routes.const";

import DashboardModalOptions from "./_components/dashboard-modal-options.component";
const styles = stylex.create({
  link: {
    display: "flex",
    alignItems: "center",
    gap: space.sm,
    borderTopLeftRadius: shape.control,
    borderTopRightRadius: shape.control,
    borderBottomRightRadius: shape.control,
    borderBottomLeftRadius: shape.control,
    paddingLeft: space.sm,
    paddingRight: space.sm,
    paddingTop: "10px",
    paddingBottom: "10px",
    fontSize: font.control,
    lineHeight: 1.5,
    fontWeight: font.medium,
    color: {
      default: color.muted,
      ":hover": color.text,
    },
    transitionProperty:
      "color, background-color, border-color, text-decoration-color",
    transitionDuration: motionToken.fast,
    transitionTimingFunction: "ease",
    backgroundColor: {
      default: null,
      ":hover": color.surfaceHover,
    },
  },
  container: {
    height: "20px",
    width: "20px",
    flexShrink: 0,
  },
  row: {
    gap: space.xs,
  },
  link2: {
    display: "flex",
    alignItems: "center",
    gap: space.xs,
    fontSize: font.navigation,
    lineHeight: 1.5,
    fontWeight: font.semibold,
    color: {
      default: color.text,
      ":hover": color.infoText,
    },
    transitionProperty:
      "color, background-color, border-color, text-decoration-color",
    transitionDuration: motionToken.fast,
    transitionTimingFunction: "ease",
  },
  icon: {
    height: "20px",
    width: "20px",
  },
  dropdownPopover: {
    marginLeft: "auto",
    display: {
      default: null,
      "@media (min-width: 768px)": "none",
    },
  },
  button: {
    marginLeft: "auto",
  },
  column: {
    marginTop: space.md,
    display: {
      default: "none",
      "@media (min-width: 768px)": "flex",
    },
    gap: space.xxs,
  },
  logoutButton: {
    marginTop: {
      default: null,
      "@media (min-width: 768px)": "auto",
    },
  },
  container2: {
    display: "block",
    backgroundColor: {
      default: color.surfaceMuted,
      ':is([data-theme="dark"] *)': color.surface,
    },
    paddingTop: space.sm,
    paddingRight: space.sm,
    paddingBottom: space.sm,
    paddingLeft: space.sm,
    flexDirection: {
      default: "row",
      "@media (min-width: 768px)": "column",
    },
    alignItems: {
      default: "center",
      "@media (min-width: 768px)": "flex-start",
    },
  },
  container3: {
    marginLeft: "auto",
    display: "block",
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "0%",
    gap: space.xs,
    flexDirection: {
      default: "row",
      "@media (min-width: 768px)": "column",
    },
  },
  container4: {
    position: "relative",
    display: "block",
    height: "100dvh",
    width: "100dvw",
    backgroundColor: color.canvas,
    flexDirection: {
      default: "row",
      "@media (min-width: 768px)": "row",
    },
  },
  layout1: {
    borderBottomWidth: { default: shape.fine, "@media (min-width: 768px)": 0 },
    borderBottomStyle: "solid",
    borderBottomColor: color.line,
    borderRightWidth: { default: 0, "@media (min-width: 768px)": shape.fine },
    borderRightStyle: "solid",
    borderRightColor: color.line,
    display: "flex",
    flexDirection: {
      default: "row",
      "@media (min-width: 768px)": "column",
    },
  },
  layout2: {
    display: "flex",
    flexDirection: {
      default: "row",
      "@media (min-width: 768px)": "column",
    },
  },
  layout3: {
    display: {
      default: "none",
      "@media (min-width: 768px)": "flex",
    },
  },
  layout4: {
    display: "flex",
    flexDirection: {
      default: "column",
      "@media (min-width: 768px)": "row",
    },
  },
});
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
    <Link key={item.path} href={item.path} {...stylex.props(styles.link)}>
      <item.icon {...stylex.props(styles.container)} />
      <div>{item.name}</div>
    </Link>
  );
  return (
    <Stack xstyle={[styles.container2, styles.layout1]}>
      {/* Header */}
      <Stack x xstyle={styles.row}>
        <Link href={ROUTES.HOME} {...stylex.props(styles.link2)}>
          <ArrowLeft {...stylex.props(styles.icon)} />
          <div>Back</div>
        </Link>
        <ThemeToggle />
      </Stack>
      {/* Navigation & Logout */}
      <Stack xstyle={[styles.container3, styles.layout2]}>
        {/* Navigation */}
        <>
          <DropdownPopover
            xstyle={styles.dropdownPopover}
            trigger={
              <Button
                variant="ghost"
                aria-label={dictionary.common.menu}
                xstyle={styles.button}
              >
                <Menu {...stylex.props(styles.icon)} />
              </Button>
            }
          >
            {navItems
              .filter((item) => (item.isAdmin ? isAdmin : true))
              .map(navIconRender)}
          </DropdownPopover>
          <Stack y xstyle={[styles.column, styles.layout3]}>
            {navItems
              .filter((item) => (item.isAdmin ? isAdmin : true))
              .map(navIconRender)}
          </Stack>
        </>
        {/* Logout */}
        <LogoutButton xstyle={styles.logoutButton} />
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
    <Stack xstyle={[styles.container4, styles.layout4]}>
      <DashboardModalOptions />
      <Navbar isAdmin={isAdmin} />
      {/* Main Content */}
      {children}
    </Stack>
  );
}
