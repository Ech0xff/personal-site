"use client";

import * as stylex from "@stylexjs/stylex";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";

import Input from "#components/ui/input.component";
import { color, font, space, shape } from "#design/tokens.stylex";
import { makeBrowserClient } from "#lib/client/supabase.client";
import { getUserStatus } from "#lib/shared/auth/session.service";
const styles = stylex.create({
  container: {
    display: "flex",
    alignItems: "center",
    borderTopLeftRadius: shape.control,
    borderTopRightRadius: shape.control,
    borderBottomRightRadius: shape.control,
    borderBottomLeftRadius: shape.control,
    backgroundColor: color.surfaceMuted,
    paddingTop: space.xxs,
    paddingRight: space.xxs,
    paddingBottom: space.xxs,
    paddingLeft: space.xxs,
  },
  input: {
    width: "128px",
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    backgroundColor: "transparent",
    fontSize: font.control,
    lineHeight: 1.5,
  },
});
type Props = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};
export default function AuthorInput({ value, onChange, disabled }: Props) {
  const supabase = useMemo(() => makeBrowserClient(), []);
  useEffect(() => {
    if (value) return;
    const fillNickname = async () => {
      const userStatus = await getUserStatus(supabase);
      const nickname = userStatus.metadata.nickname;
      if (nickname && !value) {
        onChange(nickname);
      }
    };
    fillNickname().catch(() => toast.error("Failed to load author nickname"));
  }, [onChange, supabase, value]);
  return (
    <div {...stylex.props(styles.container)}>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type="text"
        placeholder="Author"
        disabled={disabled}
        controlSize="sm"
        xstyle={styles.input}
      />
    </div>
  );
}
