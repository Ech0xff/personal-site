"use client";

import * as stylex from "@stylexjs/stylex";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ComponentPropsWithoutRef } from "react";
import { toast } from "sonner";

import type { StyleInput } from "#design/style.type";
import { color, font, space, shape, motionToken } from "#design/tokens.stylex";
import { useDictionary } from "#dictionary";
import { makeBrowserClient } from "#lib/client/supabase.client";
import { ROUTES } from "#lib/shared/routes/routes.const";
const styles = stylex.create({
  button: {
    display: "flex",
    alignItems: "center",
    gap: space.xs,
    borderTopLeftRadius: shape.control,
    borderTopRightRadius: shape.control,
    borderBottomRightRadius: shape.control,
    borderBottomLeftRadius: shape.control,
    paddingLeft: space.sm,
    paddingRight: space.sm,
    paddingTop: space.xs,
    paddingBottom: space.xs,
    fontSize: font.control,
    lineHeight: 1.5,
    fontWeight: font.medium,
    color: color.dangerText,
    transitionProperty:
      "color, background-color, border-color, text-decoration-color",
    transitionDuration: motionToken.fast,
    transitionTimingFunction: "ease",
    backgroundColor: {
      default: null,
      ":hover": color.dangerSurface,
    },
  },
  logOut: {
    height: space.md,
    width: space.md,
  },
});
interface Props extends ComponentPropsWithoutRef<"button"> {
  xstyle?: StyleInput;
}
export default function LogOutButton({ xstyle, ...props }: Props) {
  const router = useRouter();
  const dictionary = useDictionary();
  const supabase = makeBrowserClient();
  const handleLogout = async () => {
    const toastId = toast.loading(dictionary.auth.loggingOut);
    await supabase.auth
      .signOut()
      .then(({ error }) => {
        if (error) {
          toast.error(dictionary.auth.errorLoggingOut, {
            id: toastId,
          });
        } else {
          toast.success(dictionary.auth.loggedOutSuccessfully, {
            id: toastId,
          });
          router.replace(ROUTES.AUTH);
        }
      })
      .catch(() => {
        toast.error(dictionary.auth.errorLoggingOut, {
          id: toastId,
        });
      });
  };
  return (
    <button
      type="submit"
      {...stylex.props([styles.button, xstyle, null])}
      onClick={handleLogout}
      {...props}
    >
      <LogOut {...stylex.props(styles.logOut)} />
      Logout
    </button>
  );
}
