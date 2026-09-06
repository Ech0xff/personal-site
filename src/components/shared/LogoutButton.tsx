"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ComponentPropsWithoutRef } from "react";
import { toast } from "sonner";

import { useLocale, useT } from "#i18n";
import { makeBrowserClient } from "#lib/client/supabase";
import { getLocalizedRoutes } from "#lib/shared/routes";

interface Props extends ComponentPropsWithoutRef<"button"> {
  className?: string;
}

export default function LogOutButton({ className, ...props }: Props) {
  const router = useRouter();
  const locale = useLocale();
  const t = useT().scope((d) => d.auth);
  const routes = getLocalizedRoutes(locale);
  const supabase = makeBrowserClient();

  const handleLogout = async () => {
    const toastId = toast.loading(t((d) => d.loggingOut));
    supabase.auth.signOut().then(({ error }) => {
      if (error) {
        toast.error(
          t((d) => d.errorLoggingOut),
          { id: toastId },
        );
      } else {
        toast.success(
          t((d) => d.loggedOutSuccessfully),
          {
            id: toastId,
          },
        );
        router.replace(routes.AUTH);
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
