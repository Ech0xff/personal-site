import * as stylex from "@stylexjs/stylex";
import type { KeyboardEvent, ReactNode } from "react";

import { space } from "../_design/tokens.stylex";

const styles = stylex.create({
  root: { display: "flex", gap: space.xs, width: "100%" },
});

function navigateDisplayTabs(event: KeyboardEvent<HTMLDivElement>) {
  const buttons = [
    ...event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]'),
  ];
  const current = buttons.findIndex((button) => button === event.target);
  if (current < 0) return;
  const next = {
    ArrowRight: (current + 1) % buttons.length,
    ArrowLeft: (current - 1 + buttons.length) % buttons.length,
    Home: 0,
    End: buttons.length - 1,
  }[event.key];
  if (next === undefined) return;
  event.preventDefault();
  buttons[next].focus();
  buttons[next].click();
}

export function DisplayTabs({
  label,
  children,
}: Readonly<{ label: string; children: ReactNode }>) {
  return (
    <div
      role="tablist"
      tabIndex={-1}
      aria-label={label}
      onKeyDown={navigateDisplayTabs}
      {...stylex.props(styles.root)}
    >
      {children}
    </div>
  );
}
