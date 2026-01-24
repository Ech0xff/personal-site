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
    <nav
      className={cn(
        "z-100 top-0 left-0 px fixed w-screen transition-all duration-(--duration-fast)",
        "group-data-[home=false]:sticky group-data-[home=false]:px-(--nav-padding-x)",
      )}
    >
      <div
        className={cn(
          "relative w-full border-b border-solid bg-(--nav-bg) border-(--theme-border)",
          "duration-(--duration-fast) group-data-[home=true]:px-(--nav-padding-x) px-4",
        )}
      >
        <div className={cn("mx-auto flex w-full py-4 transition-all")}>
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
