import { cn } from "#legacy/helpers/tailwind.helper";

import Button, { type ButtonProps } from "./button.component";
type Props = ButtonProps & { "aria-label": string };
const sizes = { sm: "w-8", md: "w-10", lg: "w-12" } as const;
export default function IconButton({
  size = "md",
  className,
  variant = "ghost",
  ...props
}: Props) {
  return (
    <Button
      {...props}
      size={size}
      variant={variant}
      className={cn(sizes[size], "p-0", className)}
    />
  );
}
