"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { useStatusStore, type LayoutStatus } from "@/store/useStatus";
import { cn } from "@/lib/utils";

interface NavBarProps {
  layoutPadding: string;
}

export default function NavBar({ layoutPadding }: NavBarProps) {
  const layoutStatus = useStatusStore((state) => state.layoutStatus);
  const setLayoutStatus = useStatusStore((state) => state.setLayoutStatus);
  const pathname = usePathname();
  const navItems = [
    { name: "POSTS", path: "/posts" },
    { name: "THOUGHTS", path: "/thoughts" },
    { name: "EVENTS", path: "/events" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentStatus = useStatusStore.getState().layoutStatus;
      const isScrolled = window.scrollY > 10;
      const isHome = pathname === "/";
      const status: LayoutStatus = isScrolled
        ? "scrolled"
        : isHome
        ? "home-top"
        : "other-top";
      if (status !== currentStatus) setLayoutStatus(status);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname, setLayoutStatus]);

  return (
    <nav
      className={cn(
        "z-100 top-0 left-0 px fixed w-screen border-b border-solid border-transparent transition-all duration-(--duration-fast)",
        {
          "bg-(--nav-bg) border-(--theme-border)!": layoutStatus === "scrolled",
        },
      )}
    >
      <div className="relative w-full">
        <div
          className={`mx-auto flex w-full py-4 px-8 transition-all duration-(--duration-fast) ${cn({
            [layoutPadding]:
              layoutStatus === "scrolled" || layoutStatus === "other-top",
          })}`}
        >
          {/* Navbar Main */}
          <div className="flex-1 flex items-center justify-between">
            <Link href="/" className="flex flex-col">
              <div className="font-black"> BBLF&#39;s Reef</div>

              <div className="text-sm">A corner for my thoughts.</div>
            </Link>
            {/* Nav Items - Right aligned */}
            <div className="flex items-center gap-6">
              {navItems.map((item) => (
                <Link key={item.path} href={item.path}>
                  {item.name}
                </Link>
              ))}

              {/* Dark Mode Toggle */}
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
