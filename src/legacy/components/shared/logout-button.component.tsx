"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ComponentPropsWithoutRef } from "react";
import { toast } from "sonner";

import { useDictionary } from "#dictionary";
import { makeBrowserClient } from "#lib/client/supabase.client";
import { ROUTES } from "#lib/shared/routes/routes.const";

interface Props extends ComponentPropsWithoutRef<"button"> {
  className?: string;
}

export default function LogOutButton({ className, ...props }: Props) {
  const router = useRouter();
  const dictionary = useDictionary();
  const supabase = makeBrowserClient();

  const handleLogout = async () => {
    const toastId = toast.loading(dictionary.auth.loggingOut);
    await supabase.auth
      .signOut()
      .then(({ error }) => {
        if (error) {
          toast.error(dictionary.auth.errorLoggingOut, { id: toastId });
        } else {
          toast.success(dictionary.auth.loggedOutSuccessfully, {
            id: toastId,
          });
          router.replace(ROUTES.AUTH);
        }
      })
      .catch(() => {
        toast.error(dictionary.auth.errorLoggingOut, { id: toastId });
      });
  };

  return (
    <button
      type="submit"
      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-danger-text transition-colors hover:bg-danger-bg   ${className}`}
      onClick={handleLogout}
      {...props}
    >
      <LogOut className="h-4 w-4" />
      Logout
    </button>
  );
}
