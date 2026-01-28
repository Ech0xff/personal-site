import Link from "next/link";

import ThemeToggle from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

import NavBarController from "./NavBarController";
import "./index.scss";

export default function NavBar() {
  const navItems = [
    { name: "POSTS", path: "/posts" },
    { name: "THOUGHTS", path: "/thoughts" },
    { name: "EVENTS", path: "/events" },
  ];

  return (
    <>
      <NavBarController />
      <nav className={cn("px fixed top-0 left-0 z-100 w-screen")}>
        <div
          className={cn(
            "relative w-full bg-(--nav-bg) px-(--nav-padding-x) duration-(--duration-fast)",
            "group-data-[home=false]:backdrop-blur-md",
          )}
        >
          <div className={cn("mx-auto flex w-full px-4 py-2")}>
            {/* Navbar Main */}
            <div className="flex flex-1 items-center justify-between">
              <Link href="/" className="flex flex-col">
                <div className="font-black">BBLF&#39;s Reef</div>

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
          {/* Bottom Border */}
          <div
            className={cn(
              "absolute right-0 bottom-0 left-0 h-px bg-(--nav-button-line-bg)",
              "group-data-[home=false]:inset-x-(--nav-padding-x)",
            )}
          />
        </div>
      </nav>
    </>
  );
}
