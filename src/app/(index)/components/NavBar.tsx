import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

export default function NavBar() {
  const navItems = [
    { name: "POSTS", path: "/posts" },
    { name: "THOUGHTS", path: "/thoughts" },
    { name: "EVENTS", path: "/events" },
  ];

  return (
    <nav className="z-100 top-0 left-0 px fixed w-screen border-b border-solid transition-all duration-(--duration-fast) bg-(--nav-bg) border-(--theme-border) group-data-[home=false]:sticky">
      <div className="relative w-full">
        <div
          className={cn(
            "mx-auto flex w-full py-4 transition-all",
            "duration-(--duration-fast) px-(--nav-padding-x)",
          )}
        >
          {/* Navbar Main */}
          <div className="flex-1 flex items-center justify-between">
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
      </div>
    </nav>
  );
}
