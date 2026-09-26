import * as stylex from "@stylexjs/stylex";
import { LogOut } from "lucide-react";

import Button from "#components/ui/button.component";
import type { StyleInput } from "#design/style.type";
import { color } from "#design/tokens.stylex";
import { logout } from "#lib/server/auth/auth.actions";
const styles = stylex.create({
  button: { color: color.dangerText, paddingInline: "10px", fontSize: "16px" },
});
export default function LogoutButton({
  xstyle,
  labelStyle,
  onBeforeLogout,
}: {
  xstyle?: StyleInput;
  labelStyle?: StyleInput;
  onBeforeLogout?: () => boolean;
}) {
  return (
    <form
      action={logout}
      onSubmit={(event) => {
        if (onBeforeLogout && !onBeforeLogout()) event.preventDefault();
      }}
    >
      <Button
        type="submit"
        variant="ghost"
        aria-label="Logout"
        title="Logout"
        xstyle={[styles.button, xstyle]}
      >
        <LogOut size={18} aria-hidden />
        <span {...stylex.props(labelStyle)}>Logout</span>
      </Button>
    </form>
  );
}
