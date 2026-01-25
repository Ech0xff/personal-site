import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { cn, gd } from "@/lib/utils";

export default function NavBar() {
  const navItems = [
    { name: "POSTS", path: "/posts" },
    { name: "THOUGHTS", path: "/thoughts" },
    { name: "EVENTS", path: "/events" },
  ];

  return (
    <nav className={cn("z-100 top-0 left-0 px fixed w-screen")}>
      <div
        className={cn(
          "relative w-full duration-(--duration-fast) px-(--nav-padding-x)",
          gd("home", true, "bg-(--nav-bg)"),
          gd("home", false, "backdrop-blur-md"),
        )}
      >
        <div className={cn("py-2 mx-auto flex w-full px-4")}>
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
        {/* Bottom Border */}
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 h-px bg-(--theme-border)",
            gd("home", false, "inset-x-(--nav-padding-x)"),
          )}
        />
      </div>
    </nav>
  );
}
