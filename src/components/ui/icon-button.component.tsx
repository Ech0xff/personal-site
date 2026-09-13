import * as stylex from "@stylexjs/stylex";

import { space } from "#design/tokens.stylex";

import Button, { type ButtonProps } from "./button.component";
const styles = stylex.create({
  sm: {
    width: space.xl,
  },
  md: {
    width: "40px",
  },
  lg: {
    width: space.xxl,
  },
  button: {
    paddingTop: "0px",
    paddingRight: "0px",
    paddingBottom: "0px",
    paddingLeft: "0px",
  },
});
type Props = ButtonProps & {
  "aria-label": string;
};
const sizes = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
} as const;
export default function IconButton({
  size = "md",
  xstyle,
  variant = "ghost",
  ...props
}: Props) {
  return (
    <Button
      {...props}
      size={size}
      variant={variant}
      xstyle={[sizes[size], styles.button, xstyle]}
    />
  );
}
