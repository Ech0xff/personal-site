import Link from "next/link";

import {
  ArrowLeft,
  Calendar,
  FileText,
  Image,
  LayoutDashboard,
  LogOut,
  MessageCircle,
} from "lucide-react";

import { logout } from "@/actions";
import ThemeToggle from "@/components/ThemeToggle";

const navItems = [
  { name: "Overview", path: "/dashboard", icon: LayoutDashboard },
  { name: "Posts", path: "/dashboard/posts", icon: FileText },
  { name: "Thoughts", path: "/dashboard/thoughts", icon: MessageCircle },
  { name: "Events", path: "/dashboard/event", icon: Calendar },
  { name: "Images", path: "/dashboard/images", icon: Image },
];

export default function Layout({ children }: { children: React.ReactNode }) {
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
          {navItems.map((item) => (
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
          <form action={logout}>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="relative flex-1 p-8">{children}</main>
    </div>
  );
}
