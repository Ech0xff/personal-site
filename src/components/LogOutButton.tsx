"use client";
import { LogOut } from "lucide-react";

import { makeBrowserClient } from "@/lib/client/supabase";

export default function LogOutButton() {
  const supabase = makeBrowserClient();
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/dashboard/account";
  };

  return (
    <button
      type="submit"
      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
      onClick={handleLogout}
    >
      <LogOut className="h-4 w-4" />
      Logout
    </button>
  );
}
