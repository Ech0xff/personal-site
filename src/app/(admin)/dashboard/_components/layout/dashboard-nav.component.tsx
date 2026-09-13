"use client";

import * as stylex from "@stylexjs/stylex";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  FileText,
  FolderOpen,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import LogoutButton from "#components/shared/logout-button.component";
import ThemeToggle from "#components/shared/theme-toggle.component";
import { Magnetic } from "#components/ui/magnetic.component";
import { ROUTES } from "#lib/shared/routes/routes.const";

import { styles } from "./dashboard-nav.style";

const navItems = [
  { name: "Guestbook", path: ROUTES.DASHBOARD.GUESTBOOK, icon: BookOpen },
  { name: "Posts", path: ROUTES.DASHBOARD.POSTS, icon: FileText },
  { name: "Thoughts", path: ROUTES.DASHBOARD.THOUGHTS, icon: MessageCircle },
  { name: "Events", path: ROUTES.DASHBOARD.EVENT, icon: Calendar },
  { name: "Files", path: ROUTES.DASHBOARD.FILES, icon: FolderOpen },
];

export default function DashboardNav() {
  const pathname = usePathname();
  return (
    <aside {...stylex.props(styles.sidebar)}>
      <div {...stylex.props(styles.header)}>
        <Link
          href={ROUTES.HOME}
          aria-label="Back"
          title="Back"
          {...stylex.props(styles.back)}
        >
          <Magnetic compact>
            <ArrowLeft size={20} aria-hidden />
            <span {...stylex.props(styles.label)}>Back</span>
          </Magnetic>
        </Link>
        <ThemeToggle />
      </div>
      <nav aria-label="Dashboard" {...stylex.props(styles.nav)}>
        {navItems.map(({ name, path, icon: Icon }) => (
          <Link
            key={path}
            href={path}
            aria-label={name}
            title={name}
            aria-current={pathname === path ? "page" : undefined}
            {...stylex.props(styles.link, pathname === path && styles.current)}
          >
            <Magnetic compact>
              <Icon size={20} aria-hidden />
              <span {...stylex.props(styles.label)}>{name}</span>
            </Magnetic>
          </Link>
        ))}
      </nav>
      <div {...stylex.props(styles.logout)}>
        <LogoutButton labelStyle={styles.label} />
      </div>
    </aside>
  );
}
