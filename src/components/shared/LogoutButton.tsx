"use client";
import { ComponentPropsWithoutRef } from "react";

import { LogOut } from "lucide-react";
import { toast } from "sonner";

import { makeBrowserClient } from "@/lib/client/supabase";

interface Props extends ComponentPropsWithoutRef<"button"> {
  className?: string;
}

export default function LogOutButton({ className, ...props }: Props) {
  const supabase = makeBrowserClient();
  const handleLogout = async () => {
    const toastId = toast.loading("Logging out...");
    supabase.auth.signOut().then(({ error }) => {
      if (error) {
        toast.error("Failed to log out", { id: toastId });
      } else {
        toast.success("Logged out successfully.", { id: toastId });
        window.location.href = "/dashboard/account";
      }
    });
  };

  return (
    <button
      type="submit"
      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 ${className}`}
      onClick={handleLogout}
      {...props}
    >
      <LogOut className="h-4 w-4" />
      Logout
    </button>
  );
}
