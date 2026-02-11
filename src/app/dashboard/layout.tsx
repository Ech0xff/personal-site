import Link from "next/link";

import {
  ArrowLeft,
  Calendar,
  FileText,
  Image,
  LayoutDashboard,
  MessageCircle,
  UserCog,
} from "lucide-react";

import LogOutButton from "@/components/LogOutButton";
import ThemeToggle from "@/components/ThemeToggle";
import { makeServerClient } from "@/lib/supabase";

const navItems = [
  {
    isAdmin: false,
    name: "Account",
    path: "/dashboard",
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
  const supabase = await makeServerClient();

  const isAdmin =
    (await supabase.auth.getSession()).data.session?.user.app_metadata.role ===
    "admin";
  return (
    <div className="flex h-screen w-screen bg-(--theme-bg)">
      {/* Sidebar */}
      <aside className="top-0 left-0 z-40 flex h-screen w-auto flex-col border-r border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
        {/* Header */}
        <div className="flex gap-2 p-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold text-zinc-900 transition-colors hover:text-blue-600 dark:text-zinc-100 dark:hover:text-blue-400"
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </Link>
          <ThemeToggle />
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {navItems
            .filter((item) => (item.isAdmin ? isAdmin : true))
            .map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {item.name}
              </Link>
            ))}
        </nav>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-zinc-200 p-4 dark:border-zinc-800">
          <LogOutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="relative h-screen flex-1 overflow-auto p-8">
        {children}
      </main>
    </div>
  );
}
