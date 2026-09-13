"use client";

import * as stylex from "@stylexjs/stylex";
import { Plus } from "lucide-react";

import Button from "#components/ui/button.component";
import { space } from "#design/tokens.stylex";
const styles = stylex.create({
  plus: {
    height: space.md,
    width: space.md,
  },
});
interface Props {
  label: string;
  openEditor: (id: string | null) => void;
}
export default function OpenEditorButton({ label, openEditor }: Props) {
  return (
    <Button onClick={() => openEditor(null)}>
      <Plus {...stylex.props(styles.plus)} />
      {label}
    </Button>
  );
}
