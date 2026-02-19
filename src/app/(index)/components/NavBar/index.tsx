import Link from "next/link";

import { CalendarDays, FileText, Lightbulb } from "lucide-react";

import ThemeToggle from "@/components/shared/ThemeToggle";
import StackX from "@/components/ui/StackX";
import StackY from "@/components/ui/StackY";
import { cn } from "@/lib/shared/utils";

import NavBarController from "./NavBarController";
import "./index.scss";

export default function NavBar({ className }: { className?: string }) {
  const navItems = [
    { name: "POSTS", path: "/posts", icon: FileText },
    { name: "THOUGHTS", path: "/thoughts", icon: Lightbulb },
    { name: "EVENTS", path: "/events", icon: CalendarDays },
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
    <>
      <NavBarController />
      <StackY
        className={cn(
          "fixed top-0 left-0 z-100 w-screen duration-300",
          "group-data-[scrolled=true]:backdrop-blur-md",
          "sm:group-data-[home=false]:px-(--layout-padding-x)",
          className,
        )}
      >
        <StackY
          className={cn(
            "relative flex-1 duration-300",
            "sm:group-data-[scrolled=true]:px-(--layout-padding-x)",
          )}
        >
          <StackX
            className={cn(
              "mx-auto w-full items-center justify-between px-4 py-2",
              "group-data-[scrolled=true]:backdrop-blur-md",
              "group-data-[home=false]:backdrop-blur-md",
            )}
          >
            {/* Navbar Main */}
            <Link href="/" className="flex flex-col">
              <div className={cn("text-xl font-black", "sm:text-lg")}>
                BBLF&#39;s Reef
              </div>
              <div
                className={cn(
                  "hidden text-sm text-gray-500 dark:text-gray-400",
                  "sm:block",
                )}
              >
                A corner for my thoughts.
              </div>
            </Link>
            {/* Nav Items - Right aligned */}
            <StackX className={cn("items-center gap-4")}>
              <details className="group/nav-menu relative sm:hidden">
                <summary className="cursor-pointer list-none select-none">
                  MENU
                </summary>
                <StackY
                  className={cn(
                    "pointer-events-none absolute top-full left-1/2 mt-2 -translate-x-1/2 items-center gap-2 rounded-md bg-(--nav-button-line-bg) p-2 opacity-0 backdrop-blur-md transition-all duration-300",
                    "group-open/nav-menu:pointer-events-auto group-open/nav-menu:opacity-100",
                  )}
                >
                  {navItems.map(navItemRender)}
                </StackY>
              </details>

              <StackX className="hidden items-center gap-4 sm:flex">
                {navItems.map(navItemRender)}
              </StackX>
              {/* Dark Mode Toggle */}
              <ThemeToggle />
            </StackX>
          </StackX>
        </StackY>
        {/* Bottom Border */}
        <div
          className={cn(
            "mx-auto h-px bg-(--nav-button-line-bg) duration-300",
            "w-full",
            "group-data-[home=true]:w-screen",
            "sm:w-[calc(100svw-2*var(--layout-padding-x))]",
          )}
        />
      </StackY>
    </>
  );
}
