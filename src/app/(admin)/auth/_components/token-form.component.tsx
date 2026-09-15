"use client";
import * as stylex from "@stylexjs/stylex";
import { useActionState } from "react";

import Button from "#components/ui/button.component";
import Input from "#components/ui/input.component";
import { color, space } from "#design/tokens.stylex";
import { login } from "#lib/server/auth/auth.actions";
const styles = stylex.create({
  form: { display: "flex", flexDirection: "column", gap: space.md },
  error: { color: color.dangerText },
});
export default function TokenForm() {
  const [state, action, pending] = useActionState(login, { error: "" });
  return (
    <form action={action} {...stylex.props(styles.form)}>
      <Input
        label="Access token"
        emphasized
        id="admin-token"
        name="token"
        type="password"
        autoComplete="current-password"
        required
        aria-describedby={state.error ? "login-error" : undefined}
      />
      {state.error && (
        <p id="login-error" role="alert" {...stylex.props(styles.error)}>
          {state.error}
        </p>
      )}
      <Button type="submit" loading={pending}>
        Sign in
      </Button>
    </form>
  );
}
